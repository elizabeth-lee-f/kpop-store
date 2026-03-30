require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Подключение к БД и синхронизация
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ PostgreSQL Connected & Tables Synced');
        
        // Запуск сервера
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('❌ Database Error:', err);
    });

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));