import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../api/cartService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 👇 НОВОЕ: Состояние для модального окна
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    // 👇 НОВАЯ: Функция оформления заказа
    const handleCheckout = () => {
        if (window.confirm('Вы уверены, что хотите оформить заказ?')) {
            // Имитация отправки заказа на сервер
            setTimeout(() => {
                cartService.clearCart(); // Очищаем корзину
                setCart([]);             // Обновляем состояние
                setShowSuccessModal(true); // Показываем окно успеха
            }, 500);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.Product?.price || 0) * item.quantity;
        }, 0).toFixed(2);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '30px', color: '#333' }}>👤 Личный кабинет</h1>
            
            {/* Карточка информации */}
            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                marginBottom: '30px'
            }}>
                <h2 style={{ marginTop: 0, color: '#9b59b6' }}>Информация</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Роль:</strong> {user?.role === 'admin' ? '⚙️ Администратор' : '👤 Пользователь'}</p>
            </div>

            {/* Корзина */}
            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <h2 style={{ margin: 0, color: '#9b59b6' }}>🛒 Корзина</h2>
                    {cart.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Очистить
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Загрузка...</p>
                ) : cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <p style={{ fontSize: '18px' }}>🛒 Ваша корзина пуста</p>
                        <p>Перейдите в каталог, чтобы добавить товары!</p>
                    </div>
                ) : (
                    <>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {cart.map(item => (
                                <li
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '15px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <strong style={{ fontSize: '16px' }}>{item.Product?.title || 'Товар удалён'}</strong>
                                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                                            {item.quantity} шт. × ${item.Product?.price || 0}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        style={{
                                            background: '#ffebee',
                                            color: '#e74c3c',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        <div style={{
                            marginTop: '25px',
                            paddingTop: '20px',
                            borderTop: '2px solid #9b59b6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '15px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>
                                Итого: <span style={{ color: '#9b59b6' }}>${calculateTotal()}</span>
                            </h3>
                            
                            {/* 👇 НОВАЯ КНОПКА: Оформить заказ */}
                            <button
                                onClick={handleCheckout}
                                style={{
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(39, 174, 96, 0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                ✅ Оформить заказ
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* 👇 НОВОЕ: Модальное окно успеха */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        animation: 'popIn 0.3s ease-out'
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💜</div>
                        <h2 style={{ color: '#27ae60', marginTop: 0 }}>Заказ оформлен!</h2>
                        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                            Спасибо за покупку в <strong>K-Pop Store</strong>!<br/>
                            Менеджер скоро свяжется с вами.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            style={{
                                background: '#9b59b6',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '25px',
                                width: '100%'
                            }}
                        >
                            Отлично!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;