const Product = require('../models/Product');
const { Op } = require('sequelize');

class ProductService {
    // Получить все товары
    async getAll(filters) {
        let where = {};
        
        if (filters.category) where.category = filters.category;
        if (filters.artist) {
            where.artist = { [Op.iLike]: `%${filters.artist}%` };
        }
        if (filters.preorder) {
            where.isPreorder = filters.preorder === 'true';
        }

        return await Product.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
    }

    // Получить один товар
    async getById(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    // Создать товар
    async create(data) {
        return await Product.create(data);
    }

    // Обновить товар
    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.update(data);
        return product;
    }

    // Удалить товар
    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
        return { message: 'Product deleted' };
    }
}

module.exports = new ProductService();