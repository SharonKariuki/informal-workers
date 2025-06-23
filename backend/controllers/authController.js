const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { promisify } = require('util');

// Helper to sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1) Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use. Please login or use another email.'
      });
    }

    // 2) Create user
    const newUser = await User.create({ firstName, lastName, email, password });

    // 3) Create email verification token
    const verificationToken = newUser.createVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // 4) Build verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking this link:\n\n${verificationUrl}\n\nIf you did not sign up, ignore this email.`;

    // 5) Send email
    await sendEmail({
      email: newUser.email,
      subject: 'Verify your email - KaziLink',
      message,
      html: `
        <h2>Welcome to KaziLink, ${newUser.firstName}!</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't request this, ignore this email.</p>
      `
    });

    res.status(201).json({
      status: 'success',
      message: 'Verification email sent!'
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired.'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password.'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please verify your email first. Check your inbox.'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Protect route middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not logged in. Please login to access this route.'
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Optionally handle password change check
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Password was changed recently. Please login again.'
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Protect route error:', err);
    res.status(401).json({ status: 'fail', message: 'Unauthorized access.' });
  }
};
