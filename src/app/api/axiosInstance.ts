import axios from 'axios';

const api = axios.create({
  baseURL: '', // Vite proxy will handle the forwarding to https://rokafcoding.com
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for unauthorized (e.g., redirect to login)
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
