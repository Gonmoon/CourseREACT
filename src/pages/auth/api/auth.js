import axios from 'axios';

const api = axios.create({
  baseURL: '/api/users',
  withCredentials: true,
});

export const authApi = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  me: async () => {
    try {
      const { data } = await api.get('/me');
      return data;
    } catch (e) {
      return null;
    }
  },
  logout: () => api.post('/logout'),
  updateProfile: async (id, data) => {
    const response = await axios.put(`/api/usersAdmin/${id}`, data);
    return response.data;
  },
};