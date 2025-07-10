const fs = require("fs");
const Worker = require("../models/Worker");
const User = require("../models/User");

/**
 * @desc    Submit KYC documents for manual admin review
 * @route   POST /api/kyc/submit?userId=...
 * @access  Private (after signup)
 */
exports.submitKYC = async (req, res) => {
  const { userId } = req.query;
  const selfie = req.files?.selfie?.[0];
  const idFront = req.files?.idFront?.[0];
  const idBack = req.files?.idBack?.[0];

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId in query." });
  }

  if (!selfie || !idFront) {
    return res.status(400).json({
      success: false,
      message: "Missing required KYC files: selfie and ID front are required.",
    });
  }

  try {
    // Update Worker document
    const updatedWorker = await Worker.findOneAndUpdate(
      { user: userId },
      {
        selfie: selfie.filename,
        idFront: idFront.filename,
        idBack: idBack?.filename || '',
        kycStatus: "pending",
        submittedAt: new Date(),
      },
      { new: true, upsert: false }
    );

    // Optionally mark the user as having started KYC (no approval)
    await User.findByIdAndUpdate(userId, {
      profileApproved: false,
    });

    res.status(200).json({
      success: true,
      message: "KYC documents submitted successfully. Awaiting admin review.",
      worker: updatedWorker,
    });
  } catch (err) {
    console.error("Manual KYC submission error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error during KYC submission.",
      error: err.message,
    });
  }
};
