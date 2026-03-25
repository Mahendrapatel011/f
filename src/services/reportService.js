import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const reportService = {
    uploadReport: async (formData) => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/reports`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getBusinessReports: async () => {
        const token = localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/reports/business`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getCustomerReports: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/reports/customer`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default reportService;
