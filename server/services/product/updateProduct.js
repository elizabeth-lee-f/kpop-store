const Product = require('../../models/Product');

class UpdateProductService {
    async execute(id, data) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.update(data);
        return product;
    }
}

module.exports = new UpdateProductService();