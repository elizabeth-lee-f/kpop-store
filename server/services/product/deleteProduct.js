
const Product = require('../../models/Product');

class DeleteProductService {
    async execute(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
        return { message: 'Product deleted' };
    }
}

module.exports = new DeleteProductService();