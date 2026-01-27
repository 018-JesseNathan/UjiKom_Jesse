import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Poliklinik API
export const polyclinicAPI = {
  getAll: () => api.get('/poliklinik'),
  getById: (id) => api.get(`/poliklinik/${id}`),
  create: (data) => api.post('/poliklinik', data),
  update: (id, data) => api.put(`/poliklinik/${id}`, data),
  delete: (id) => api.delete(`/poliklinik/${id}`),
};

export default api;
