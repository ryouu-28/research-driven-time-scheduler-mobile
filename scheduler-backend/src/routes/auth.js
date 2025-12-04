const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// ===== PUBLIC ROUTES (No authentication required) =====

// POST /api/auth/register
// Body: { email, password, name }
router.post('/register', authController.register);

// POST /api/auth/login
// Body: { email, password }
router.post('/login', authController.login);

// ===== PROTECTED ROUTES (Authentication required) =====

// GET /api/auth/me
// Headers: { Authorization: "Bearer <token>" }
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;