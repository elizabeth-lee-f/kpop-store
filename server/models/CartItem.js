const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'cart_items'
});

// Устанавливаем связи
User.hasMany(CartItem, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { 
    foreignKey: 'productId',
    onDelete: 'CASCADE'
});
CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = CartItem;