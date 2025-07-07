const Employer = require('../models/Employer');
const User = require('../models/User');
const IDAnalyzer = require('idanalyzer'); // Optional for KYC

exports.registerEmployer = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.',
      });
    }

    // Check if employer already exists for this user
    const existing = await Employer.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Employer profile already exists for this user.',
      });
    }

    const uploadedFiles = req.files || {};

    if (!uploadedFiles?.idFront?.[0] || !uploadedFiles?.selfie?.[0]) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID front and selfie are required for KYC verification.',
      });
    }

    // OPTIONAL: Face match verification using IDAnalyzer
    const coreapi = new IDAnalyzer.CoreAPI(process.env.IDANALYZER_API_KEY, 'US');
    const verification = await coreapi.verify({
      document_primary: uploadedFiles.idFront[0].path,
      biometric_photo: uploadedFiles.selfie[0].path,
      face_match: true,
    });

    if (!verification?.result?.face_match) {
      return res.status(400).json({
        status: 'fail',
        message: 'Face does not match ID. KYC verification failed.',
      });
    }

    // Extract form fields
    const {
      firstName, lastName, email, phone, dob, gender,
      street, city, state, zip, country,
      hasCriminalRecord, explanation,
      confirmInfo, consent,
    } = req.body;

    const employerData = {
      user: userId,
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address: { street, city, state, zip, country },
      idFront: uploadedFiles.idFront[0].filename,
      idBack: uploadedFiles?.idBack?.[0]?.filename || '',
      selfie: uploadedFiles.selfie[0].filename,
      criminalRecord: {
        hasRecord: hasCriminalRecord === 'yes',
        explanation: hasCriminalRecord === 'yes' ? explanation : '',
      },
      confirmInfo: confirmInfo === 'true',
      consent: consent === 'true',
      profileApproved: false, // Admin approves later
    };

    const employer = await Employer.create(employerData);

    // ✅ Update User model with employer ref and role
    await User.findByIdAndUpdate(userId, {
      employer: employer._id,
      role: 'employer',
    });

    res.status(201).json({
      status: 'success',
      message: 'Employer profile registered successfully.',
      data: { employer },
    });

  } catch (error) {
    console.error('❌ Employer registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Employer registration failed.',
      error: error.message,
    });
  }
};
