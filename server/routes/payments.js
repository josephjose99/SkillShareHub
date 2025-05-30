const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Create payment
router.post('/create', paymentController.createPayment);

// Execute payment
router.post('/execute', paymentController.executePayment);

// Get payment details
router.get('/:id', paymentController.getPaymentDetails);

module.exports = router; 