import api from './api';

/**
 * Business Authentication Service
 * Handles all business authentication API calls
 */

const businessAuthService = {
    /**
     * Register new business
     * @param {Object} data - Registration data
     * @returns {Promise} Registration response
     */
    register: async (data) => {
        try {
            const response = await api.post('/business/auth/register', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Verify OTP after registration
     * @param {Object} data - Contains email and otp
     * @returns {Promise} Verification response with token
     */
    verifyOTP: async (data) => {
        try {
            const response = await api.post('/business/auth/verify-otp', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Login business
     * @param {Object} credentials - Contains identifier and password
     * @returns {Promise} Login response with token
     */
    login: async (credentials) => {
        try {
            const response = await api.post('/business/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Forgot password - Send OTP
     * @param {String} identifier - Email or mobile
     * @returns {Promise} Success message
     */
    forgotPassword: async (identifier) => {
        try {
            const response = await api.post('/business/auth/forgot-password', { identifier });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Verify reset password OTP
     * @param {Object} data - Contains identifier and otp
     * @returns {Promise} Verification response
     */
    verifyResetOTP: async (data) => {
        try {
            const response = await api.post('/business/auth/verify-reset-otp', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Reset password
     * @param {Object} data - Contains identifier, otp, password, confirmPassword
     * @returns {Promise} Success message
     */
    resetPassword: async (data) => {
        try {
            const response = await api.post('/business/auth/reset-password', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Resend OTP
     * @param {Object} data - Contains identifier and type
     * @returns {Promise} Success message
     */
    resendOTP: async (data) => {
        try {
            const response = await api.post('/business/auth/resend-otp', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get current business profile
     * @returns {Promise} Business profile data
     */
    getMe: async () => {
        try {
            const response = await api.get('/business/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Logout business
     */
    logout: () => {
        localStorage.removeItem('business_token');
        localStorage.removeItem('business_data');
        window.location.href = '/business/login';
    }
};

export default businessAuthService;
