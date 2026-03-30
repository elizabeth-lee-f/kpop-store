const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const { category, artist, preorder } = req.query;
        let where = {};
        
        if (category) where.category = category;
        if (artist) where.artist = { [require('sequelize').Op.iLike]: `%${artist}%` };
        if (preorder) where.isPreorder = preorder === 'true';
        
        const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить один товар
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать товар (админ)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить товар (админ)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;