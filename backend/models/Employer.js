const mongoose = require('mongoose');

// Embedded Address Subschema
const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  { _id: false }
);

// Embedded Criminal Record Subschema
const criminalRecordSchema = new mongoose.Schema(
  {
    hasRecord: { type: Boolean, default: false },
    explanation: String,
  },
  { _id: false }
);

// Main Employer Schema
const employerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ['employer'],
      default: 'employer',
    },

    // Personal Info
    profileApproved: { type: Boolean, default: false },
    firstName: { type: String, required: true },
    
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    dob: { type: String, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },

    address: addressSchema,
    criminalRecord: criminalRecordSchema,

    // Verification Docs
    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    selfie: { type: String, required: true },

    // Admin Approval
    // profileApproved: { type: Boolean, default: false },
    // status: {
    //   type: String,
    //   enum: ['pending', 'approved', 'rejected'],
    //   default: 'pending',
    // },

    // Ratings and Reviews
    averageRating: { type: Number, default: 5 },
    totalReviews: { type: Number, default: 0 },

    // Optional Business Info
    companyName: { type: String },
    companyWebsite: { type: String },
    profilePhoto: { type: String },

    // User Consent
    confirmInfo: { type: Boolean, required: true },
    consent: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employer', employerSchema);
