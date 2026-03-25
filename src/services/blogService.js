import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

const blogService = {
    getBlogs: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    
    getBlogBySlug: async (slug) => {
        const response = await axios.get(`${API_URL}/${slug}`);
        return response.data;
    },
    
    // Admin methods (can be expanded later)
    createBlog: async (blogData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, blogData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default blogService;
