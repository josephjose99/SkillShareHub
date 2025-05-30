const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
const { register, login, getMe, googleCallback, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  googleCallback
);

module.exports = router; 