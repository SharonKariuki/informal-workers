const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  postedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}
  ,
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Temporary'],
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Internship', 'Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'],
  },
  minSalary: {
    type: Number,
  },
  maxSalary: {
    type: Number,
  },
  remoteWork: {
    type: String,
    enum: ['On-site only', 'Hybrid', 'Remote only'],
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  applicationEmail: {
    type: String,
    required: true,
  },
  externalUrl: {
    type: String,
  },
  screeningQuestion: {
    type: String,
  },
  requireResume: {
    type: Boolean,
    default: false,
  },
  requireCoverLetter: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
