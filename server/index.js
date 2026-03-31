require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');

// Импортируем модели
const User = require('./models/User');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');

const app = express();
const server = http.createServer(app);

// Настройка Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Хранилище сообщений чата
let chatMessages = [];

// WebSocket подключение
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Отправляем историю
    socket.emit('chat_history', chatMessages);

    // Получение сообщения
    socket.on('send_message', (data) => {
        const message = {
            id: Date.now(),
            text: data.text,
            user: data.user || 'Гость',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAdmin: data.isAdmin || false
        };

        chatMessages.push(message);
        if (chatMessages.length > 50) {
            chatMessages.shift();
        }

        io.emit('receive_message', message);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Middleware
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Подключение к БД и синхронизация
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ PostgreSQL Connected & Tables Synced');
        
        const PORT = process.env.PORT || 5001;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`💬 Chat service ready`);
        });
    })
    .catch(err => {
        console.log('❌ Database Error:', err);
    });

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

module.exports = { app, io };