import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.patch(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  getAnalytics: (params) => api.get('/bookings/analytics', { params }),
  getWhatsAppLink: (id, isCancellation = false) => api.get(`/bookings/${id}/whatsapp`, { params: { isCancellation } }),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getCategories: () => api.get('/services/categories'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  create: (data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/staff', data, config);
  },
  update: (id, data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put(`/staff/${id}`, data, config);
  },
  changeBranch: (id, branch) => api.patch(`/staff/${id}/branch`, { branch }),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Branches API
export const branchesAPI = {
  getAll: (params) => api.get('/branches', { params }),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
};

// Attendance API
export const attendanceAPI = {
  create: (data) => api.post('/attendance', data),
  getAll: (params) => api.get('/attendance', { params }),
  getByStaff: (staffId, params) => api.get(`/attendance/staff/${staffId}`, { params }),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  delete: (id) => api.delete(`/attendance/${id}`),
};

// Coupons API
export const couponsAPI = {
  getAll: (params) => api.get('/coupons', { params }),
  validate: (code, price) => api.post('/coupons/validate', { code, price }),
  getAllAdmin: () => api.get('/coupons/all'),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;

