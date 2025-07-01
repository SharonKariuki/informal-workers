const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const Worker = require('../models/Worker');

// Upload fields: idFront, idBack, cv, certificate
const multiUpload = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]);

router.post('/register', multiUpload, async (req, res) => {
    console.log('🛠️ Worker registration hit', req.body);
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'Missing user ID' });

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

    const uploadedFiles = req.files;

    const newWorker = new Worker({
      user: userId,
      role: role || 'worker',
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address: { street, city, state, zip, country },
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
        certificationDate
      },
      criminalRecord: {
        hasRecord: criminalRecord === 'Yes',
        explanation
      },
      idFront: uploadedFiles.idFront?.[0]?.filename || '',
      idBack: uploadedFiles.idBack?.[0]?.filename || '',
      cv: uploadedFiles.cv?.[0]?.filename || '',
      certification: {
        certificationName,
        issuingOrg,
        certificationDate,
        certificate: uploadedFiles.certificate?.[0]?.filename || ''
      },
      confirmInfo: confirmInfo === 'true',
      consent: consent === 'true'
    });

    await newWorker.save();
    return res.status(201).json({ message: 'Worker registered with files!' });
  } catch (err) {
    console.error('Worker registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
