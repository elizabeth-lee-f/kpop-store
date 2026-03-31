import api from './axios';

export const cartService = {
    // Получить корзину
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    // Добавить в корзину
    addToCart: async (productId, quantity = 1) => {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    },

    // Удалить из корзины
    removeFromCart: async (itemId) => {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    },

    // Очистить корзину
    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};