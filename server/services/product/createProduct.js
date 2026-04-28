const Product = require('../../models/Product');

class CreateProductService {
    async execute(data) {
        return await Product.create(data);
    }
}

module.exports = new CreateProductService();