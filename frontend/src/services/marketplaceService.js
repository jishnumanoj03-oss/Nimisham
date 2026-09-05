import api from './api';

const marketplaceService = {
  // Public
  getProducts: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/marketplace/products?${queryString}`);
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(`/marketplace/products/${id}`);
    return response.data;
  },

  // Seller Dashboard
  getSellerProducts: async () => {
    const response = await api.get('/marketplace/seller/products');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/marketplace/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/marketplace/products/${id}`, productData);
    return response.data;
  },
  
  // Delivery & Purchases (Module 14 APIs, putting them here for now)
  getMyPurchases: async () => {
    const response = await api.get('/delivery/purchases');
    return response.data;
  },
  
  getDownloadUrl: async (productId) => {
    const response = await api.get(`/delivery/download/${productId}`);
    return response.data;
  }
};

export default marketplaceService;
