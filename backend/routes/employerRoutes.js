const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const upload = require('../middleware/multer');

// Register employer profile after role selection
router.post(
  '/register',
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 }
  ]),
  employerController.registerEmployer
);

module.exports = router;
