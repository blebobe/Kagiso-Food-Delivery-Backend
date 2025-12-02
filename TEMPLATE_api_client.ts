// API Client - Copy to: src/api/client.ts
// Location: Kagiso-Customer-App/src/api/client.ts

import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name, role: 'customer' }),
};

export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getById: (id: number) => api.get(`/restaurants/${id}`),
  getMenu: (id: number) => api.get(`/restaurants/${id}/menu`),
};

export const orderAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}`, { status }),
};

export default api;
