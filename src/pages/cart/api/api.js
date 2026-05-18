import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const ticketsApi = {
  getAll: async () => {
    const response = await instance.get('/tickets');
    return response.data;
  },
  getById: async (id) => {
    const response = await instance.get(`/tickets/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await instance.put(`/tickets/${id}`, data);
    return response.data;
  }
};

export const ordersApi = {
  create: async (orderData) => {
    const response = await instance.post('/orders', orderData);
    return response.data;
  },
  getAll: async () => {
    const response = await instance.get('/orders');
    return response.data;
  },
  getByUserId: async (userId) => {
    const response = await instance.get(`/orders/${userId}`);
    return response.data;
  }
};

export const cartApi = {
  getByUserId: async (userId) => {
    const response = await instance.get(`/cart/${userId}`);
    return response.data;
  },
  add: async (cartData) => {
    const response = await instance.post('/cart', cartData);
    return response.data;
  },
  remove: async (id) => {
    const response = await instance.delete(`/cart/${id}`);
    return response.data;
  }
};

export const favoritesApi = {
  getByUserId: async (userId) => {
    const response = await instance.get(`/favorites/${userId}`);
    return response.data;
  },
  add: async (favoriteData) => {
    const response = await instance.post('/favorites', favoriteData);
    return response.data;
  },
  remove: async (id) => {
    const response = await instance.delete(`/favorites/${id}`);
    return response.data;
  }
};

export const documentsApi = {
  create: async (documentData) => {
    const response = await instance.post('/documents', documentData);
    return response.data;
  },
  getByOrderId: async (orderId) => {
    const response = await instance.get(`/documents/order/${orderId}`);
    return response.data;
  }
};

