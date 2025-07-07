const express = require("express");
const multer = require("multer");
const router = express.Router();
const kycController = require("../controllers/kycController");

const upload = multer({ dest: "uploads/" });

router.post(
  "/submit",
  upload.fields([{ name: "selfie", maxCount: 1 }, { name: "idDoc", maxCount: 1 }]),
  kycController.submitKYC
);

module.exports = router;
