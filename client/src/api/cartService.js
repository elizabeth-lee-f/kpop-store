import api from './axios';

export const cartService = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },
    
    addToCart: async (productId, quantity = 1) => {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    },
    
    removeFromCart: async (itemId) => {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    },
    
    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};