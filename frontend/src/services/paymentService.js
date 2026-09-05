import api from './api';

const paymentService = {
  createCheckoutSession: async (productIds) => {
    const response = await api.post('/payments/checkout-session', { productIds });
    return response.data.data;
  },
};

export default paymentService;
