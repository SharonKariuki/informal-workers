const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const Worker = require('../models/Worker');
const Review = require('../models/Review'); // you forgot to import this

// ✅ Handle multiple file uploads
const multiUpload = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  { name: 'selfie', maxCount: 1 } // ✅ FIXED
]);

// ✅ Register new worker
router.post('/register', multiUpload, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID in query' });
    }

    const {
      firstName, lastName, email, phone, dob, gender,
      street, city, state, zip, country,
      occupation, experience,
      education, degree, field, completionYear,
      certificationName, issuingOrg, certificationDate,
      explanation, confirmInfo, consent,
      role, criminalRecord
    } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];

    const uploadedFiles = req.files || {};

    const newWorker = new Worker({
      user: userId,
      role: role || 'worker',
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address: {
        street,
        city,
        state,
        zip,
        country
      },
      occupation,
      experience,
      skills,
      education: {
        education,
        degree,
        field,
        completionYear
      },
      certification: {
        certificationName,
        issuingOrg,
        certificationDate,
        certificate: uploadedFiles.certificate?.[0]?.filename || ''
      },
      criminalRecord: {
        hasRecord: criminalRecord === 'Yes',
        explanation
      },
      idFront: uploadedFiles.idFront?.[0]?.filename || '',
      idBack: uploadedFiles.idBack?.[0]?.filename || '',
      selfie: uploadedFiles.selfie?.[0]?.filename || '', // ✅ FIXED
      cv: uploadedFiles.cv?.[0]?.filename || '',
      confirmInfo: confirmInfo === 'true',
      consent: consent === 'true'
    });

    await newWorker.save();

    res.status(201).json({ message: 'Worker registered with files!' });
  } catch (err) {
    console.error('Worker registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Fetch worker by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.params.userId });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    console.error('Error fetching worker by user ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET full worker details with reviews
router.get('/full/:workerId', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId).populate('user');
    const reviews = await Review.find({ worker: req.params.workerId });

    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    res.json({ worker, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Upload profile photo
router.post('/upload-profile-photo/:workerId', upload.single('photo'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    worker.profilePhoto = req.file.filename;
    await worker.save();

    res.json({ message: 'Profile photo updated', profilePhoto: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
