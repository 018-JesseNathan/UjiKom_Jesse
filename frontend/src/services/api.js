import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Poliklinik API functions
export const polyclinicAPI = {
  // Get all polyclinics
  getAll: () => api.get('/poliklinik'),
  
  // Get polyclinic by ID
  getById: (id) => api.get(`/poliklinik/${id}`),
  
  // Create new polyclinic
  create: (data) => api.post('/poliklinik', data),
  
  // Update polyclinic
  update: (id, data) => api.put(`/poliklinik/${id}`, data),
  
  // Delete polyclinic
  delete: (id) => api.delete(`/poliklinik/${id}`),
};

export default api;

