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
};

export const getUserIdFromCookie = () => {
  const matches = document.cookie.match(new RegExp('(?:^|; )' + 'token'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  const token = matches ? decodeURIComponent(matches[1]) : null;
  
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const parsed = JSON.parse(jsonPayload);
    return parsed.id || null;
  } catch (e) {
    console.error("Ошибка парсинга JWT токена", e);
    return null;
  }
};