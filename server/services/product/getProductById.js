const Product = require('../../models/Product');

class GetProductByIdService {
    async execute(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
}

module.exports = new GetProductByIdService();