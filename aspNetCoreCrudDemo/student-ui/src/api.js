import axios from 'axios';

// Update this if your backend runs on a different port
export const API_BASE = 'https://localhost:7112/api';

const api = axios.create({
    baseURL: API_BASE
});

// Attach the JWT to every request, if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is missing/expired, the API returns 401 — force a re-login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;
