const getProductsService = require('./getProducts');
const getProductByIdService = require('./getProductById');
const createProductService = require('./createProduct');
const updateProductService = require('./updateProduct');
const deleteProductService = require('./deleteProduct');

module.exports = {
    getAll: getProductsService.execute.bind(getProductsService),
    getById: getProductByIdService.execute.bind(getProductByIdService),
    create: createProductService.execute.bind(createProductService),
    update: updateProductService.execute.bind(updateProductService),
    delete: deleteProductService.execute.bind(deleteProductService),
};