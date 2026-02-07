import axios from 'axios';
import API_CONFIG, { STORAGE_KEYS } from '../config/apiConfig';

// Create axios instance
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER);

            // Redirect to login only if not already on auth pages
            const authPages = ['/login', '/register', '/forgot-password', '/otp-verify', '/set-new-password'];
            const currentPath = window.location.pathname;

            if (!authPages.some(page => currentPath.includes(page))) {
                window.location.href = '/login/customer';
            }
        }

        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your internet connection';
        }

        return Promise.reject(error);
    }
);

export default api;
