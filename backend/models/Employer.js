const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String, trim: true },
  country: { type: String, trim: true }
}, { _id: false });

const criminalRecordSchema = new mongoose.Schema({
  hasRecord: { type: Boolean, default: false },
  explanation: { type: String, trim: true }
}, { _id: false });

const employerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['employer'],
    default: 'employer'
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  address: addressSchema,
  criminalRecord: criminalRecordSchema,
  idFront: { type: String, required: true },
  idBack: { type: String, required: true },
  confirmInfo: { type: Boolean, required: true },
  consent: { type: Boolean, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employer', employerSchema);
