import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createPayment = async (courseId) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create`, { courseId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const executePayment = async (paymentId, payerId) => {
  try {
    const response = await axios.post(`${API_URL}/payments/execute`, {
      paymentId,
      payerId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 