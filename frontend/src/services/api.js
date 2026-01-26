import axios from 'axios';

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
};

export default api;

