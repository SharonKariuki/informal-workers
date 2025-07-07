const Job = require('../models/jobModels');
const jwt = require('jsonwebtoken');

/**
 * Create a new job post
 * @route POST /api/jobs
 * @access Private (Employer only)
 */
exports.createJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing token. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const jobData = {
      ...req.body,
      postedBy: userId, // ✅ add user as poster
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all jobs posted by a specific employer
 * @route GET /api/jobs/employer/:employerId
 */
exports.getJobsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    const jobs = await Job.find({ postedBy: employerId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all jobs
 * @route GET /api/jobs
 */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single job by ID
 * @route GET /api/jobs/:id
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a job by ID
 * @route PUT /api/jobs/:id
 */
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete a job by ID
 * @route DELETE /api/jobs/:id
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
