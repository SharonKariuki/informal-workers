const Employer = require('../models/Employer');

/**
 * @desc    Register an employer profile
 * @route   POST /api/employers/register?userId=...
 * @access  Private (after email verification)
 */
exports.registerEmployer = async (req, res) => {
  try {
    const { userId } = req.query;
    const employerData = req.body;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.'
      });
    }

    // Optional: Check if this user already has a profile
    const existing = await Employer.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Employer profile already exists for this user.'
      });
    }

    const employer = await Employer.create({
      ...employerData,
      user: userId
    });

    res.status(201).json({
      status: 'success',
      message: 'Employer profile registered successfully.',
      data: { employer }
    });
  } catch (error) {
    console.error('Employer registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Employer registration failed.',
      error: error.message
    });
  }
};
