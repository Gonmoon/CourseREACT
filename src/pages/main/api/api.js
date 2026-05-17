import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

export const ticketsApi = {
  getAll: async () => {
    const { data } = await api.get('/tickets');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/tickets/${id}`);
    return data;
  },

  search: async (query) => {
    const { data } = await api.get('/tickets/search', {
      params: {
        q: query,
      },
    });

    return data;
  },

  getPage: async (page = 1, limit = 6) => {
    const { data } = await api.get('/tickets/page', {
      params: {
        page,
        limit,
      },
    });

    return data;
  },

  sortByPriceAsc: async () => {
    const { data } = await api.get(
      '/tickets/sort/price-asc'
    );

    return data;
  },

  sortByPriceDesc: async () => {
    const { data } = await api.get(
      '/tickets/sort/price-desc'
    );

    return data;
  },

  sortByDateAsc: async () => {
    const { data } = await api.get(
      '/tickets/sort/date-asc'
    );

    return data;
  },

  sortByDateDesc: async () => {
    const { data } = await api.get(
      '/tickets/sort/date-desc'
    );

    return data;
  },
};