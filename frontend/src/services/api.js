import axios from 'axios';

<<<<<<< HEAD
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Poliklinik API
export const polyclinicAPI = {
    getAll: () => api.get('/poliklinik'),
    getById: (id) => api.get(`/poliklinik/${id}`),
    create: (data) => api.post('/poliklinik', data),
    update: (id, data) => api.put(`/poliklinik/${id}`, data),
    delete: (id) => api.delete(`/poliklinik/${id}`)
=======
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
>>>>>>> b332f249d4276d36333d0d8e8da4ff4994b7a35b
};

export default api;

