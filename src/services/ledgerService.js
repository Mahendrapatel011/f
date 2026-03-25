import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ledgerService = {
    // ---- BUSINESS PANEL METHODS ----
    getMyLedger: async () => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/business/ledger`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    initPayDues: async (amount) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/business/ledger/init-pay-dues`, { amount }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    verifyPayDues: async (paymentData) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/business/ledger/verify-pay-dues`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    requestWithdrawal: async (data) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/business/ledger/withdraw`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMyWithdrawals: async () => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/business/ledger/withdrawals`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // ---- ADMIN PANEL METHODS ----
    getAllLedgers: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/ledgers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getLedgerDetails: async (businessId) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/ledgers/${businessId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    settleBalance: async (data) => {
        // data = { businessId, amount, type: 'credit' / 'debit', description }
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(`${API_URL}/admin/ledgers/settle`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getWithdrawalRequests: async (status = '') => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/withdrawals?status=${status}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateWithdrawalStatus: async (id, data) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.patch(`${API_URL}/admin/withdrawals/${id}/status`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default ledgerService;
