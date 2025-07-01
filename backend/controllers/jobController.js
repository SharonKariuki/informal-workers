import Job from "../models/jobModel.js";

export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
