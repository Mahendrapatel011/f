import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/apiConfig';

/**
 * Authentication Service
 * All authentication related API calls
 */

class AuthService {
    /**
     * Register new customer
     * @param {string} identifier - Email or mobile number
     * @param {string} password - Password
     * @param {string} confirmPassword - Confirm password
     * @returns {Promise} API response
     */
    async register(identifier, password, confirmPassword) {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
            identifier,
            password,
            confirmPassword
        });
        return response.data;
    }

    /**
     * Verify OTP after registration
     * @param {string} identifier - Email or mobile number
     * @param {string} otp - OTP code
     * @returns {Promise} API response
     */
    async verifyOTP(identifier, otp) {
        const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
            identifier,
            otp
        });

        // Save token and customer data
        if (response.data.success && response.data.data) {
            this.saveAuthData(response.data.data);
        }

        return response.data;
    }

    /**
     * Login customer
     * @param {string} identifier - Email or mobile number
     * @param {string} password - Password
     * @returns {Promise} API response
     */
    async login(identifier, password) {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
            identifier,
            password
        });

        // Save token and customer data
        if (response.data.success && response.data.data) {
            this.saveAuthData(response.data.data);
        }

        return response.data;
    }

    /**
     * Request password reset OTP
     * @param {string} identifier - Email or mobile number
     * @returns {Promise} API response
     */
    async forgotPassword(identifier) {
        const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
            identifier
        });
        return response.data;
    }

    /**
     * Verify reset password OTP
     * @param {string} identifier - Email or mobile number
     * @param {string} otp - OTP code
     * @returns {Promise} API response
     */
    async verifyResetOTP(identifier, otp) {
        const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
            identifier,
            otp
        });
        return response.data;
    }

    /**
     * Reset password
     * @param {string} identifier - Email or mobile number
     * @param {string} otp - OTP code
     * @param {string} password - New password
     * @param {string} confirmPassword - Confirm new password
     * @returns {Promise} API response
     */
    async resetPassword(identifier, otp, password, confirmPassword) {
        const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            identifier,
            otp,
            password,
            confirmPassword
        });
        return response.data;
    }

    /**
     * Resend OTP
     * @param {string} identifier - Email or mobile number
     * @param {string} type - OTP type ('registration' or 'reset')
     * @returns {Promise} API response
     */
    async resendOTP(identifier, type = 'registration') {
        const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
            identifier,
            type
        });
        return response.data;
    }

    /**
     * Get current customer profile
     * @returns {Promise} API response
     */
    async getCurrentCustomer() {
        const response = await api.get(API_ENDPOINTS.AUTH.GET_ME);
        return response.data;
    }

    /**
     * Logout customer
     */
    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
        window.location.href = '/';
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    /**
     * Get stored customer data
     * @returns {Object|null}
     */
    getCustomer() {
        const customer = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
        return customer ? JSON.parse(customer) : null;
    }

    /**
     * Get stored token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    /**
     * Save authentication data to localStorage
     * @private
     * @param {Object} data - Auth data containing token and customer
     */
    saveAuthData(data) {
        if (data.token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        }
        if (data.customer) {
            localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(data.customer));
        }
    }
}

// Export singleton instance
export default new AuthService();
