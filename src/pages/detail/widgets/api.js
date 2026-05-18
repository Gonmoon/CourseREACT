import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketsApi = {
  getPage: async (params) => {
    const response = await API.get('/tickets/page', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/tickets/${id}`);
    return response.data;
  },
};

export const cartApi = {
  add: async ({ userId, ticketId, quantity }) => {
    const response = await API.post('/cart', { userId, ticketId, quantity });
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await API.get(`/cart/${userId}`);
    return response.data;
  },

  getCount: async (userId) => {
    const response = await API.get(`/cart/count/${userId}`);
    return response.data;
  },

  updateQuantity: async (id, quantity) => {
    const response = await API.put(`/cart/${id}`, { quantity });
    return response.data;
  },

  remove: async (id) => {
    const response = await API.delete(`/cart/${id}`);
    return response.data;
  },
};

export const favoritesApi = {
  add: async ({ userId, ticketId }) => {
    const response = await API.post('/favorites', { userId, ticketId });
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await API.get(`/favorites/${userId}`);
    return response.data;
  },

  getCount: async (userId) => {
    const response = await API.get(`/favorites/count/${userId}`);
    return response.data;
  },

  remove: async (id) => {
    const response = await API.delete(`/favorites/${id}`);
    return response.data;
  },
};

export const reviewsApi = {
  getByTicketId: async (ticketId) => {
    const response = await axios.get(`/api/reviews/ticket/${ticketId}`);
    return response.data;
  },
  
  remove: async (reviewId) => {
    const response = await axios.delete(`/api/reviews/${reviewId}`);
    return response.data;
  }
};