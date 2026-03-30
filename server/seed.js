require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const products = [
    {
        title: "Golden (Jungkook)",
        artist: "BTS",
        category: "album",
        price: 25.99,
        image: "https://upload.wikimedia.org/wikipedia/en/3/3d/Jungkook_Golden.png",
        isPreorder: false,
        stock: 50
    },
    {
        title: "BOMB (Lightstick Ver.3)",
        artist: "TXT",
        category: "lightstick",
        price: 55.00,
        image: "https://image.kpopmart.com/upload/shop/202308/20230810_163333_64d4c7c1e2f7e.jpg",
        isPreorder: false,
        stock: 30
    },
    {
        title: "Get Up (2nd EP)",
        artist: "NewJeans",
        category: "album",
        price: 18.50,
        image: "https://upload.wikimedia.org/wikipedia/en/c/c9/NewJeans_Get_Up.png",
        isPreorder: true,
        releaseDate: new Date('2024-03-01'),
        stock: 100
    },
    {
        title: "Love Dive",
        artist: "IVE",
        category: "album",
        price: 16.99,
        image: "https://upload.wikimedia.org/wikipedia/en/0/0a/IVE_Love_Dive_digital_cover.jpg",
        isPreorder: false,
        stock: 45
    },
    {
        title: "Official Lightstick",
        artist: "BLACKPINK",
        category: "lightstick",
        price: 52.00,
        image: "https://cdn.shopify.com/s/files/1/0559/3038/0451/products/Blackpink-Lightstick.jpg",
        isPreorder: false,
        stock: 25
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🔌 Connected to MongoDB');
        
        // Очистка базы
        await Product.deleteMany({});
        await User.deleteMany({});
        
        // Добавление товаров
        await Product.insertMany(products);
        console.log('✅ Products added');
        
        // Создание админа
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.findOneAndUpdate(
            { email: 'admin@kpop.com' },
            { 
                email: 'admin@kpop.com', 
                password: hashedPassword, 
                role: 'admin' 
            },
            { upsert: true }
        );
        
        // Создание тестового пользователя
        const userPassword = await bcrypt.hash('user123', 10);
        await User.findOneAndUpdate(
            { email: 'user@kpop.com' },
            { 
                email: 'user@kpop.com', 
                password: userPassword, 
                role: 'user' 
            },
            { upsert: true }
        );
        
        console.log('✅ Users created');
        console.log('📝 Admin: admin@kpop.com / admin123');
        console.log('📝 User: user@kpop.com / user123');
        
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Error:', err);
        process.exit(1);
    });