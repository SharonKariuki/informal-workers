const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const Employer = require('../models/Employer');
const employerController = require("../controllers/employerController");

// ⬇️ Upload ID + Selfie
const multiUpload = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
]);

// ✅ POST: Register employer with KYC
router.post('/register', multiUpload, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'Missing user ID' });

    const {
      firstName, lastName, email, phone, dob, gender,
      street, city, state, zip, country,
      hasCriminalRecord, explanation,
      confirmInfo, consent
    } = req.body;

    const uploadedFiles = req.files;

    const newEmployer = new Employer({
      user: userId,
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address: { street, city, state, zip, country },
      idFront: uploadedFiles?.idFront?.[0]?.filename || '',
      idBack: uploadedFiles?.idBack?.[0]?.filename || '',
      selfie: uploadedFiles?.selfie?.[0]?.filename || '',  // ✅ Save selfie filename
      criminalRecord: {
        hasRecord: hasCriminalRecord === 'yes',
        explanation: hasCriminalRecord === 'yes' ? explanation : ''
      },
      confirmInfo: confirmInfo === 'true',
      consent: consent === 'true',
      status: 'pending', // Optional: Add status for admin KYC review
    });

    await newEmployer.save();
    res.status(201).json({ message: 'Employer registered successfully!' });

  } catch (err) {
    console.error('Employer registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ GET: Employer profile by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.params.userId }).populate('user');
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (err) {
    console.error('Employer fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
