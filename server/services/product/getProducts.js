const Product = require('../../models/Product');
const { Op } = require('sequelize');

class GetProductsService {
    async execute(filters) {
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
}

module.exports = new GetProductsService();