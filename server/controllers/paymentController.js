const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const paypal = require('@paypal/checkout-server-sdk');

// PayPal client configuration
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

exports.createPayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: course.price.toString()
        },
        description: `Payment for course: ${course.title}`
      }]
    });

    const order = await client.execute(request);

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price,
      paymentId: order.result.id,
      status: 'pending'
    });

    res.json({
      paymentId: payment._id,
      orderId: order.result.id
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Error creating payment' });
  }
};

exports.executePayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;
    const userId = req.user.id;

    // Get payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment belongs to user
    if (payment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Capture PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(payment.paymentId);
    const capture = await client.execute(request);

    if (capture.result.status === 'COMPLETED') {
      // Update payment status
      payment.status = 'completed';
      payment.payerId = payerId;
      await payment.save();

      // Add course to user's enrolled courses
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: payment.course }
      });

      res.json({
        message: 'Payment completed successfully',
        payment: payment
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Payment capture failed' });
    }
  } catch (error) {
    console.error('Payment execution error:', error);
    res.status(500).json({ message: 'Error executing payment' });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(id)
      .populate('course', 'title price')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment belongs to user
    if (payment.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Error retrieving payment details' });
  }
}; 