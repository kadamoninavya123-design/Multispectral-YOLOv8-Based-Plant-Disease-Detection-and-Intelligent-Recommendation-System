import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (email, password) =>
    api.post('/auth/register', { email, password });

export const loginUser = (email, password) =>
    api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

// Prediction
export const predictDisease = (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const savePrediction = (data) =>
    api.post('/predict/save', data);

// History
export const getHistory = () => api.get('/history');

export const getHistoryDetail = (id) => api.get(`/history/${id}`);

export const deleteHistory = (id) => api.delete(`/history/${id}`);

export default api;
