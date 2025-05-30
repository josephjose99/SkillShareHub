import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const initialOptions = {
    'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture'
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          shape: 'rect',
          label: 'pay'
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString()
                }
              }
            ]
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const order = await actions.order.capture();
            onSuccess(order);
            toast.success('Payment successful!');
          } catch (error) {
            onError(error);
            toast.error('Payment failed. Please try again.');
          }
        }}
        onError={(err) => {
          onError(err);
          toast.error('An error occurred with PayPal. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton; 