import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const bookingService = {
    getBusinessBookings: async (search = '') => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/orders/business/my-orders?search=${search}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getBusinessStats: async () => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/orders/business/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateBookingStatus: async (orderId, orderStatus) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.patch(`${API_URL}/orders/${orderId}/status`,
            { orderStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    sendVerificationOtp: async (orderId) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/orders/${orderId}/send-otp`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    verifyOrderOtp: async (orderId, otp) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/orders/${orderId}/verify-otp`, { otp }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default bookingService;
