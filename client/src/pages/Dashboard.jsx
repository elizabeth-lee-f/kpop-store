import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../api/cartService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            await cartService.removeFromCart(itemId);
            fetchCart();
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };

    const handleClearCart = async () => {
        if (confirm('Очистить всю корзину?')) {
            try {
                await cartService.clearCart();
                setCart([]);
            } catch (err) {
                alert('Ошибка при очистке');
            }
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.Product?.price || 0) * item.quantity;
        }, 0).toFixed(2);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>👤 Личный кабинет</h1>
            
            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#9b59b6' }}>Информация</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Роль:</strong> {user?.role === 'admin' ? '⚙️ Администратор' : '👤 Пользователь'}</p>
            </div>

            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ color: '#9b59b6' }}>🛒 Корзина</h2>
                    {cart.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Очистить
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Загрузка...</p>
                ) : cart.length === 0 ? (
                    <p style={{ color: '#666' }}>Корзина пуста</p>
                ) : (
                    <>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {cart.map(item => (
                                <li
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '15px 0',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    <div>
                                        <strong>{item.Product?.title || 'Товар удалён'}</strong>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            x{item.quantity} • ${item.Product?.price || 0}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '2px solid #9b59b6',
                            textAlign: 'right'
                        }}>
                            <h3>Итого: ${calculateTotal()}</h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;