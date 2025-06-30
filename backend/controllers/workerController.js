const Worker = require('../models/Worker');

/**
 * @desc    Register a worker profile
 * @route   POST /api/workers/register?userId=...
 * @access  Private (after email verification)
 */
exports.registerWorker = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.'
      });
    }

    // Optional: Check if worker profile already exists
    const existing = await Worker.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Worker profile already exists for this user.'
      });
    }

    const workerData = {
      ...req.body,
      skills: JSON.parse(req.body.skills || '[]'),
      user: userId
    };

    const worker = await Worker.create(workerData);

    res.status(201).json({
      status: 'success',
      message: 'Worker profile registered successfully.',
      data: { worker }
    });
  } catch (error) {
    console.error('Worker registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Worker registration failed.',
      error: error.message
    });
  }
};
