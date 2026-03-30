const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const { verifyToken } = require('../middleware/authMiddleware');

// Получить корзину пользователя
router.get('/', verifyToken, async (req, res) => {
    try {
        const items = await CartItem.find({ userId: req.user.id })
            .populate('productId')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить в корзину
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID required' });
        }

        let item = await CartItem.findOne({ 
            userId: req.user.id, 
            productId 
        });
        
        if (item) {
            item.quantity += quantity || 1;
            await item.save();
        } else {
            item = await CartItem.create({ 
                userId: req.user.id, 
                productId, 
                quantity: quantity || 1 
            });
        }
        
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить количество
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await CartItem.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { quantity },
            { new: true }
        ).populate('productId');
        
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить из корзины
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await CartItem.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Очистить корзину
router.delete('/clear', verifyToken, async (req, res) => {
    try {
        await CartItem.deleteMany({ userId: req.user.id });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;