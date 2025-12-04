const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===== HELPER FUNCTION: Generate JWT Token =====
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // Payload (data to encrypt)
    process.env.JWT_SECRET,            // Secret key
    { expiresIn: '30d' }               // Token expires in 30 days
  );
};

// ===== REGISTER NEW USER =====
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // ===== 1. VALIDATE INPUT =====
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, and name' 
      });
    }

    // ===== 2. CHECK IF USER EXISTS =====
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // ===== 3. CREATE USER =====
    // Password will be hashed automatically by User model's pre-save hook
    const user = await User.create({
      email,
      password,
      name
    });

    // ===== 4. GENERATE TOKEN =====
    const token = generateToken(user._id);

    // ===== 5. SEND RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        procrastinationType: user.procrastinationType,
        surveyCompleted: user.surveyCompleted
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user',
      error: error.message 
    });
  }
};

// ===== LOGIN USER =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== 1. VALIDATE INPUT =====
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // ===== 2. FIND USER (include password this time) =====
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // ===== 3. CHECK PASSWORD =====
    // Uses the comparePassword method we defined in User model
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // ===== 4. GENERATE TOKEN =====
    const token = generateToken(user._id);

    // ===== 5. SEND RESPONSE =====
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        procrastinationType: user.procrastinationType,
        surveyCompleted: user.surveyCompleted
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in',
      error: error.message 
    });
  }
};

// ===== GET CURRENT USER =====
// This route is protected - only logged in users can access
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        procrastinationType: req.user.procrastinationType,
        surveyCompleted: req.user.surveyCompleted,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving user',
      error: error.message 
    });
  }
};
