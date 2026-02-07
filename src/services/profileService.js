import api from './api';

/**
 * Profile Service
 * Handles all profile-related API calls
 */

const profileService = {
    /**
     * Get customer profile
     * @returns {Promise} Profile data
     */
    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update customer profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise} Updated profile data
     */
    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update profile picture
     * @param {String} profilePicture - Base64 image string or URL
     * @returns {Promise} Updated profile picture URL
     */
    updateProfilePicture: async (profilePicture) => {
        try {
            const response = await api.put('/profile/picture', { profilePicture });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Change password
     * @param {Object} passwordData - Contains currentPassword, newPassword, confirmPassword
     * @returns {Promise} Success message
     */
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/profile/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Delete account (soft delete - deactivate)
     * @param {Object} deleteData - Contains password and confirmDelete
     * @returns {Promise} Success message
     */
    deleteAccount: async (deleteData) => {
        try {
            const response = await api.delete('/profile', { data: deleteData });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Permanently delete account (hard delete)
     * @param {Object} deleteData - Contains password and confirmDelete
     * @returns {Promise} Success message
     */
    permanentDeleteAccount: async (deleteData) => {
        try {
            const response = await api.delete('/profile/permanent', { data: deleteData });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Add email to account (if registered with mobile)
     * @param {String} email - Email address to add
     * @returns {Promise} Success message with OTP sent
     */
    addEmail: async (email) => {
        try {
            const response = await api.post('/profile/add-email', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Add mobile to account (if registered with email)
     * @param {String} mobile - Mobile number to add
     * @returns {Promise} Success message with OTP sent
     */
    addMobile: async (mobile) => {
        try {
            const response = await api.post('/profile/add-mobile', { mobile });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Verify OTP for added email/mobile
     * @param {Object} verifyData - Contains otp and type ('email' or 'mobile')
     * @returns {Promise} Success message
     */
    verifyAddition: async (verifyData) => {
        try {
            const response = await api.post('/profile/verify-addition', verifyData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default profileService;
