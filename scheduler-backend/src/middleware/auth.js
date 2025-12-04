const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
try {
const authHeader = req.header('Authorization');


if (!authHeader) {
  return res.status(401).json({ 
    success: false, 
    message: 'No authentication token, access denied' 
  });
}

const token = authHeader.replace('Bearer ', '');
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id).select('-password');

if (!user) {
  return res.status(401).json({ 
    success: false, 
    message: 'User not found' 
  });
}

req.user = user;
next();


} catch (error) {
console.error('Auth middleware error:', error);
res.status(401).json({
success: false,
message: 'Token is invalid or expired'
});
}
};
