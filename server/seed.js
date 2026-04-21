require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

const products = [
    // ========== BTS ==========
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
        title: "Proof (3CD)",
        artist: "BTS",
        category: "album",
        price: 45.00,
        image: "https://upload.wikimedia.org/wikipedia/en/f/f3/BTS_-_Proof.png",
        isPreorder: false,
        stock: 30
    },
    {
        title: "BOMB (Lightstick Ver.3)",
        artist: "BTS",
        category: "lightstick",
        price: 55.00,
        image: "https://image.kpopmart.com/upload/shop/202308/20230810_163333_64d4c7c1e2f7e.jpg",
        isPreorder: false,
        stock: 25
    },
    {
        title: "BTS Membership Kit 2024",
        artist: "BTS",
        category: "photocard",
        price: 35.00,
        image: "https://i.pinimg.com/736x/8f/3d/9c/8f3d9c8f5e5f5e5f5e5f5e5f5e5f5e5f.jpg",
        isPreorder: true,
        stock: 100
    },
    {
        title: "BTS Hoodie Purple",
        artist: "BTS",
        category: "apparel",
        price: 65.00,
        image: "https://i.pinimg.com/564x/bts-hoodie.jpg",
        isPreorder: false,
        stock: 40
    },
    
    // ========== BLACKPINK ==========
    {
        title: "BORN PINK",
        artist: "BLACKPINK",
        category: "album",
        price: 22.00,
        image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Blackpink_-_Born_Pink.png",
        isPreorder: false,
        stock: 45
    },
    {
        title: "BLACKPINK Lightstick Ver.2",
        artist: "BLACKPINK",
        category: "lightstick",
        price: 58.00,
        image: "https://image.kpopmart.com/upload/shop/blackpink-lightstick.jpg",
        isPreorder: false,
        stock: 20
    },
    {
        title: "BLACKPINK T-Shirt",
        artist: "BLACKPINK",
        category: "apparel",
        price: 35.00,
        image: "https://i.pinimg.com/564x/bp-tshirt.jpg",
        isPreorder: false,
        stock: 60
    },
    
    // ========== NewJeans ==========
    {
        title: "Get Up (2nd EP)",
        artist: "NewJeans",
        category: "album",
        price: 18.50,
        image: "https://upload.wikimedia.org/wikipedia/en/c/c9/NewJeans_Get_Up.png",
        isPreorder: false,
        stock: 70
    },
    {
        title: "OMG (1st EP)",
        artist: "NewJeans",
        category: "album",
        price: 18.50,
        image: "https://upload.wikimedia.org/wikipedia/en/newjeans-omg.jpg",
        isPreorder: false,
        stock: 50
    },
    {
        title: "NewJeans Bunny Bag",
        artist: "NewJeans",
        category: "photocard",
        price: 28.00,
        image: "https://i.pinimg.com/564x/nj-bag.jpg",
        isPreorder: true,
        stock: 80
    },
    
    // ========== TWICE ==========
    {
        title: "READY TO BE",
        artist: "TWICE",
        category: "album",
        price: 20.00,
        image: "https://upload.wikimedia.org/wikipedia/en/twice-ready-to-be.jpg",
        isPreorder: false,
        stock: 55
    },
    {
        title: "TWICE Lightstick Ver.2",
        artist: "TWICE",
        category: "lightstick",
        price: 52.00,
        image: "https://image.kpopmart.com/upload/shop/twice-lightstick.jpg",
        isPreorder: false,
        stock: 30
    },
    {
        title: "TWICE Candy Pop Hoodie",
        artist: "TWICE",
        category: "apparel",
        price: 60.00,
        image: "https://i.pinimg.com/564x/twice-hoodie.jpg",
        isPreorder: false,
        stock: 35
    },
    
    // ========== TXT ==========
    {
        title: "The Name Chapter: TEMPTATION",
        artist: "TXT",
        category: "album",
        price: 23.00,
        image: "https://upload.wikimedia.org/wikipedia/en/txt-temptation.jpg",
        isPreorder: false,
        stock: 40
    },
    {
        title: "TXT Lightstick Ver.2",
        artist: "TXT",
        category: "lightstick",
        price: 55.00,
        image: "https://image.kpopmart.com/upload/shop/txt-lightstick.jpg",
        isPreorder: false,
        stock: 25
    },
    
    // ========== Stray Kids ==========
    {
        title: "5-STAR",
        artist: "Stray Kids",
        category: "album",
        price: 24.00,
        image: "https://upload.wikimedia.org/wikipedia/en/straykids-5star.jpg",
        isPreorder: false,
        stock: 50
    },
    {
        title: "Stray Kids Lightstick",
        artist: "Stray Kids",
        category: "lightstick",
        price: 54.00,
        image: "https://image.kpopmart.com/upload/shop/skz-lightstick.jpg",
        isPreorder: false,
        stock: 30
    },
    {
        title: "Stray Kids Hoodie",
        artist: "Stray Kids",
        category: "apparel",
        price: 62.00,
        image: "https://i.pinimg.com/564x/skz-hoodie.jpg",
        isPreorder: false,
        stock: 40
    },
    
    // ========== IU ==========
    {
        title: "The Winning",
        artist: "IU",
        category: "album",
        price: 26.00,
        image: "https://upload.wikimedia.org/wikipedia/en/iu-winning.jpg",
        isPreorder: false,
        stock: 45
    },
    {
        title: "IU Love Poem T-Shirt",
        artist: "IU",
        category: "apparel",
        price: 32.00,
        image: "https://i.pinimg.com/564x/iu-tshirt.jpg",
        isPreorder: false,
        stock: 55
    },
    
    // ========== SEVENTEEN ==========
    {
        title: "FML",
        artist: "SEVENTEEN",
        category: "album",
        price: 24.00,
        image: "https://upload.wikimedia.org/wikipedia/en/seventeen-fml.jpg",
        isPreorder: false,
        stock: 60
    },
    {
        title: "SEVENTEEN Lightstick Ver.3",
        artist: "SEVENTEEN",
        category: "lightstick",
        price: 56.00,
        image: "https://image.kpopmart.com/upload/shop/svt-lightstick.jpg",
        isPreorder: false,
        stock: 35
    },
    
    // ========== LE SSERAFIM ==========
    {
        title: "UNFORGIVEN",
        artist: "LE SSERAFIM",
        category: "album",
        price: 21.00,
        image: "https://upload.wikimedia.org/wikipedia/en/lesserafim-unforgiven.jpg",
        isPreorder: false,
        stock: 50
    },
    {
        title: "LE SSERAFIM Tote Bag",
        artist: "LE SSERAFIM",
        category: "photocard",
        price: 25.00,
        image: "https://i.pinimg.com/564x/lsf-bag.jpg",
        isPreorder: true,
        stock: 70
    },
    
    // ========== IVE ==========
    {
        title: "I'VE IVE",
        artist: "IVE",
        category: "album",
        price: 20.00,
        image: "https://upload.wikimedia.org/wikipedia/en/ive-ive.jpg",
        isPreorder: false,
        stock: 55
    },
    {
        title: "IVE Lightstick",
        artist: "IVE",
        category: "lightstick",
        price: 53.00,
        image: "https://image.kpopmart.com/upload/shop/ive-lightstick.jpg",
        isPreorder: true,
        stock: 40
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
        console.log('📦 Total products:', products.length);
        console.log(' Admin: admin@kpop.com / admin123');
        console.log('📝 User: user@kpop.com / user123');
        
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Error:', err);
        process.exit(1);
    });