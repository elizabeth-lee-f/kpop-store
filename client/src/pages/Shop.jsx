import { useEffect, useState } from 'react';
import { productService } from '../api/productService';
import { cartService } from '../api/cartService';
import { useAuth } from '../context/AuthContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { category: filter } : {};
            const data = await productService.getAll(params);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            alert('Сначала войдите в аккаунт! 💜');
            return;
        }
        
        try {
            await cartService.addToCart(productId);
            alert('Добавлено в корзину! 💜');
        } catch (err) {
            alert('Ошибка при добавлении в корзину');
        }
    };

    const categories = [
        { value: 'all', label: 'Все товары' },
        { value: 'album', label: 'Альбомы' },
        { value: 'lightstick', label: 'Лайтстики' },
        { value: 'photocard', label: 'Фотокниги' },
        { value: 'apparel', label: 'Одежда' }
    ];

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h1>🇰🇷 K-Pop Merch Store</h1>
                
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{ padding: '10px', fontSize: '14px' }}
                >
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</p>
            ) : products.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '50px' }}>Товары не найдены</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '25px'
                }}>
                    {products.map(product => (
                        <div
                            key={product._id}
                            style={{
                                background: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}
                                onError={e => {
                                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                                }}
                            />
                            
                            {product.isPreorder && (
                                <span style={{
                                    background: '#ffeb3b',
                                    color: '#333',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                    marginBottom: '10px'
                                }}>
                                    📦 PRE-ORDER
                                </span>
                            )}
                            
                            <h3 style={{ marginBottom: '5px' }}>{product.title}</h3>
                            <p style={{ color: '#666', marginBottom: '10px' }}>
                                🎤 {product.artist}
                            </p>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '15px'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#9b59b6'
                                }}>
                                    ${product.price}
                                </span>
                                
                                <button
                                    onClick={() => handleAddToCart(product._id)}
                                    style={{
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    В корзину
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;