require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
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
        stock: 100
    }
];

sequelize.sync({ force: true })
    .then(async () => {
        console.log('🔄 Database synced');
        
        // Создаем админа
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@kpop.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        // Создаем пользователя
        const userPassword = await bcrypt.hash('user123', 10);
        await User.create({
            email: 'user@kpop.com',
            password: userPassword,
            role: 'user'
        });
        
        // Добавляем товары
        await Product.bulkCreate(products);
        
        console.log('✅ Seeded successfully!');
        console.log(' Admin: admin@kpop.com / admin123');
        console.log('📝 User: user@kpop.com / user123');
        
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Error:', err);
        process.exit(1);
    });