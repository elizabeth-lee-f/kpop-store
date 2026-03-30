const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Получить все товары (публичный доступ)
router.get('/', async (req, res) => {
    try {
        const { category, artist, preorder } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (artist) query.artist = new RegExp(artist, 'i');
        if (preorder) query.isPreorder = preorder === 'true';
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить один товар
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать товар (только админ)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить товар (только админ)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить товар (только админ)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;