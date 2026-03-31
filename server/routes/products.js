const express = require('express');
const router = express.Router();
const productService = require('../services/productService'); // <-- Импортируем сервис
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

// Получить все товары (Можно оставить публичным или добавить verifyToken по требованию)
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAll(req.query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить один товар
router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(err.message === 'Product not found' ? 404 : 500).json({ error: err.message });
    }
});

// Создать товар (ТОЛЬКО АДМИН)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const product = await productService.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить товар (ТОЛЬКО АДМИН)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await productService.update(req.params.id, req.body);
        res.json(product);
    } catch (err) {
        res.status(err.message === 'Product not found' ? 404 : 500).json({ error: err.message });
    }
});

// Удалить товар (ТОЛЬКО АДМИН)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await productService.delete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(err.message === 'Product not found' ? 404 : 500).json({ error: err.message });
    }
});

module.exports = router;