import api from './axios';

export const productService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/products?${params}`);
        return response.data;
    },
    
    create: async (data) => {
        const response = await api.post('/products', data);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};