const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Worker = require('../models/Worker');

exports.submitKYC = async (req, res) => {
  const { userId } = req.query;
  const selfie = req.files.selfie[0];
  const idDoc = req.files.idDoc[0];

  try {
    const formData = new FormData();
    formData.append("photo", fs.createReadStream(selfie.path));
    formData.append("document_primary", fs.createReadStream(idDoc.path));
    formData.append("apikey", process.env.ID_ANALYZER_API_KEY);

    const response = await axios.post(
      "https://api.idanalyzer.com/v3/identity/verify",
      formData,
      { headers: formData.getHeaders() }
    );

    const result = response.data;

    const worker = await Worker.findOneAndUpdate(
      { user: userId },
      {
        selfiePath: selfie.path,
        idDocPath: idDoc.path,
        kycStatus: result.result === 1 ? "pending" : "rejected", // ✅ FIXED
        kycResult: result,
      },
      { new: true }
    );

    res.status(200).json({ success: true, result, worker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "KYC failed", error: err.message });
  }
};
