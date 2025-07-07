const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const Job = require('../models/jobModels'); // Make sure this exists and is populated

router.get('/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    // 1. Find the worker by ID
    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    // 2. Extract relevant matching fields
    const { occupation, skills } = worker;

    // 3. Query jobs that match either occupation or at least one skill
    const matchedJobs = await Job.find({
      $or: [
        { occupation: { $regex: occupation, $options: 'i' } },
        { requiredSkills: { $in: skills } } // `requiredSkills` must be array in Job model
      ]
    });

    res.status(200).json(matchedJobs);
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
