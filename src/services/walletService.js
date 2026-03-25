import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const walletService = {
    getStats: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/wallet/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addMoney: async (amount) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/wallet/add-money`, { amount }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    verifyAddMoney: async (data) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/wallet/verify`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getTransactions: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/wallet/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default walletService;
