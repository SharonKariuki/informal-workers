const express = require("express");
const multer = require("multer");
const router = express.Router();
const kycController = require("../controllers/kycController");

// Store uploads in /uploads directory
const upload = multer({ dest: "uploads/" });

// ✅ Route: Submit KYC Documents for Manual Review
router.post(
  "/submit",
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 }, // optional but allowed
  ]),
  kycController.submitKYC
);

module.exports = router;
