const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    // 1. Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user by ID and attach to req object
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      return next();
    }

    // No token provided
    return res.status(401).json({ message: 'Not authorized, token missing' });
  } catch (error) {
    console.error('JWT Auth Error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = protect;
