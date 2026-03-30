const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('album', 'lightstick', 'photocard', 'apparel'),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isPreorder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    releaseDate: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true,
    tableName: 'products'
});

module.exports = Product;