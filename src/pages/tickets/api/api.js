import axios from 'axios';

const api = axios.create({
  baseURL: '/api/tickets',
});

export const ticketsApi = {
  getTickets: async ({
    page = 1,
    limit = 6,
    sort = '',
    q = '',
  } = {}) => {
    const { data } = await api.get('/page', {
      params: {
        page,
        limit,
        sort,
        q,
      },
    });

    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/${id}`);
    return data;
  },
};