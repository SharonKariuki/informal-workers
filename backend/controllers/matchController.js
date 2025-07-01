import Worker from "../models/workerModel.js";
import Job from "../models/jobModel.js";
import mongoose from "mongoose";

export const matchJobs = async (req, res) => {
  const workerId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return res.status(400).json({ error: "Invalid worker ID" });
  }

  try {
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Prepare search criteria
    const orCriteria = [];

    // Match occupation in job title
    if (worker.occupation) {
      orCriteria.push({ title: new RegExp(worker.occupation, "i") });
    }

    // Match skills in job requirements
    if (worker.skills && worker.skills.length > 0) {
      const skillsRegex = new RegExp(worker.skills.join("|"), "i");
      orCriteria.push({ requirements: { $regex: skillsRegex } });
    }

    // Match city name
    if (worker.address?.city) {
      orCriteria.push({ "location.city": new RegExp(worker.address.city, "i") });
    }

    // Build base query
    let query = {};

    if (orCriteria.length > 0) {
      query.$or = orCriteria;
    }

    // Add geospatial proximity if available
    if (worker.location?.coordinates) {
      query.$and = query.$and || [];
      query.$and.push({
        location: {
          $near: {
            $geometry: worker.location,
            $maxDistance: 20000, // 20 km
          },
        },
      });
    }

    // If no criteria, fetch all jobs
    if (Object.keys(query).length === 0) {
      query = {}; // match all jobs
    }

    const matchedJobs = await Job.find(query);

    res.status(200).json(matchedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

