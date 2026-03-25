import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ticketService = {
    // Create a new ticket (handles both customer and business based on token)
    createTicket: async (ticketFormData) => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('subject', ticketFormData.subject);
        formData.append('description', ticketFormData.description);
        formData.append('priority', ticketFormData.priority || 'Medium');
        
        if (ticketFormData.attachments && ticketFormData.attachments.length > 0) {
            ticketFormData.attachments.forEach(att => {
                formData.append('attachments', att.file);
            });
        }

        const response = await axios.post(`${API_URL}/tickets`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get all tickets for current user
    getMyTickets: async () => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Get ticket details
    getTicketDetails: async (ticketId) => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Update ticket (only if pending)
    updateTicket: async (ticketId, ticketData) => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        
        const formData = new FormData();
        formData.append('subject', ticketData.subject);
        formData.append('description', ticketData.description);
        
        // Separate existing and new attachments
        const existingAttachments = ticketData.attachments.filter(att => !att.file);
        formData.append('existingAttachments', JSON.stringify(existingAttachments));
        
        if (ticketData.attachments && ticketData.attachments.length > 0) {
            ticketData.attachments.forEach(att => {
                if (att.file) { // Only new files
                    formData.append('attachments', att.file);
                }
            });
        }

        const response = await axios.put(`${API_URL}/tickets/${ticketId}`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Add message to ticket
    addMessage: async (ticketId, message) => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        const response = await axios.post(`${API_URL}/tickets/${ticketId}/message`, { message }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Delete ticket (only if pending)
    deleteTicket: async (ticketId) => {
        const token = localStorage.getItem('token') || localStorage.getItem('businessToken');
        const response = await axios.delete(`${API_URL}/tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default ticketService;
