const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/authMiddleware');

// Получить корзину
router.get('/', verifyToken, async (req, res) => {
    try {
        const items = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [Product],
            order: [['createdAt', 'DESC']]
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить в корзину
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        let item = await CartItem.findOne({
            where: { userId: req.user.id, productId }
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

// Удалить из корзины
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await CartItem.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Очистить корзину
router.delete('/clear', verifyToken, async (req, res) => {
    try {
        await CartItem.destroy({ where: { userId: req.user.id } });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;