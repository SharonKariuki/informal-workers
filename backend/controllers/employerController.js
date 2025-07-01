const employer = require('../models/Employer');

/**
 * @desc    Register a employer profile
 * @route   POST /api/employers/register?userId=...
 * @access  Private (after email verification)
 */
exports.registerEmployer = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.'
      });
    }

    // Optional: Check if employer profile already exists
    const existing = await Employer.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Employer profile already exists for this user.'
      });
    }

    const employerData = {
      ...req.body,
      skills: JSON.parse(req.body.skills || '[]'),
      user: userId
    };

    const employer = await employer.create(employerData);

    res.status(201).json({
      status: 'success',
      message: 'employer profile registered successfully.',
      data: { employer }
    });
  } catch (error) {
    console.error('employer registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'employer registration failed.',
      error: error.message
    });
  }
};
