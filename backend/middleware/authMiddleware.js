const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied.'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ message: 'User not found.'});
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid.'});
  }
};
