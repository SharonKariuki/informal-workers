// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    role: {
      type: String,
      enum: ['employer', 'worker'],
      required: false,
      default: undefined
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isProfileComplete: {
      type: Boolean,
      default: false
    },

    profileApproved: {
      type: Boolean,
      default: false
    },

    trustBadge: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    reviews: [
      {
        type: String,
        trim: true
      }
    ],

    verificationToken: String,
    verificationTokenExpires: Date
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate and hash email verification token
userSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return rawToken;
};

module.exports = mongoose.model('User', userSchema);
