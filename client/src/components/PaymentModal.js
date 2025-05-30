import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';
import PayPalButton from './PayPalButton';
import { createPayment, executePayment } from '../services/paymentService';
import { toast } from 'react-toastify';

const PaymentModal = ({ open, onClose, course, onSuccess }) => {
  const handlePaymentSuccess = async (order) => {
    try {
      // Create payment record in our database
      const payment = await createPayment(course.id);
      
      // Execute the payment
      await executePayment(payment.id, order.payer.payer_id);
      
      // Call the success callback
      onSuccess();
      
      // Close the modal
      onClose();
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Purchase</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {course.description}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            ${course.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            One-time payment
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <PayPalButton
            amount={course.price}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal; 