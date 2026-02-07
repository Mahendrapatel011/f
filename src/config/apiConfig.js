// API Configuration
const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: '/auth/register',
        VERIFY_OTP: '/auth/verify-otp',
        LOGIN: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_RESET_OTP: '/auth/verify-reset-otp',
        RESET_PASSWORD: '/auth/reset-password',
        RESEND_OTP: '/auth/resend-otp',
        GET_ME: '/auth/me'
    },

    // Add more endpoints as needed
    PATHOLOGY: {
        LIST: '/pathology/list',
        DETAILS: '/pathology/:id'
    },

    LAB: {
        LIST: '/lab/list',
        DETAILS: '/lab/:id'
    }
};

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    CUSTOMER: 'customer',
    REFRESH_TOKEN: 'refreshToken'
};

// Toast Messages
export const TOAST_MESSAGES = {
    SUCCESS: {
        LOGIN: 'Login successful!',
        LOGOUT: 'Logged out successfully',
        REGISTER: 'Registration successful!',
        OTP_SENT: 'OTP sent successfully',
        OTP_VERIFIED: 'OTP verified successfully',
        PASSWORD_RESET: 'Password reset successful'
    },
    ERROR: {
        LOGIN_FAILED: 'Login failed. Please try again',
        NETWORK_ERROR: 'Network error. Please check your connection',
        INVALID_CREDENTIALS: 'Invalid email/mobile or password',
        SESSION_EXPIRED: 'Session expired. Please login again',
        GENERIC: 'Something went wrong. Please try again'
    }
};

export default API_CONFIG;
