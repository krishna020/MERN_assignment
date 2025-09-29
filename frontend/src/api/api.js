import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({ baseURL });

// attach token automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, (err) => Promise.reject(err));

// handle 401 centrally (optional)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // optional: remove token and reload to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
