import { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        artist: '',
        category: 'album',
        price: '',
        image: '',
        stock: '',
        isPreorder: false,
        releaseDate: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await productService.create({
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock) || 0
            });
            setSuccess('Товар успешно добавлен!');
            setForm({
                title: '',
                artist: '',
                category: 'album',
                price: '',
                image: '',
                stock: '',
                isPreorder: false,
                releaseDate: ''
            });
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка создания товара');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Удалить этот товар?')) {
            try {
                await productService.delete(id);
                fetchProducts();
            } catch (err) {
                alert('Ошибка при удалении');
            }
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h1>⚙️ Панель Администратора</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: '#9b59b6',
                        color: 'white',
                        border: 'none',
                        padding: '12px 25px',
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}
                >
                    {showForm ? 'Скрыть форму' : '+ Добавить товар'}
                </button>
            </div>

            {showForm && (
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#9b59b6' }}>Новый товар</h2>

                    {error && (
                        <div style={{
                            background: '#ffe6e6',
                            color: '#cc0000',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            background: '#e6ffe6',
                            color: '#00cc00',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px'
                        }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <input
                            placeholder="Название товара"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Группа/Артист"
                            value={form.artist}
                            onChange={e => setForm({ ...form, artist: e.target.value })}
                            required
                        />
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                        >
                            <option value="album">Альбом</option>
                            <option value="lightstick">Лайтстик</option>
                            <option value="photocard">Фотокнига</option>
                            <option value="apparel">Одежда</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Цена ($)"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            required
                            step="0.01"
                        />
                        <input
                            placeholder="URL изображения"
                            value={form.image}
                            onChange={e => setForm({ ...form, image: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Количество на складе"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={form.isPreorder}
                                onChange={e => setForm({ ...form, isPreorder: e.target.checked })}
                            />
                            Предзаказ
                        </label>
                        {form.isPreorder && (
                            <input
                                type="date"
                                value={form.releaseDate}
                                onChange={e => setForm({ ...form, releaseDate: e.target.value })}
                            />
                        )}
                        <button
                            type="submit"
                            style={{
                                gridColumn: '1 / -1',
                                background: '#9b59b6',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Создать товар
                        </button>
                    </form>
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    Все товары ({products.length})
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Товар</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Артист</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Категория</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Цена</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Статус</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{product.title}</td>
                                <td style={{ padding: '15px' }}>{product.artist}</td>
                                <td style={{ padding: '15px' }}>{product.category}</td>
                                <td style={{ padding: '15px' }}>${product.price}</td>
                                <td style={{ padding: '15px' }}>
                                    {product.isPreorder ? (
                                        <span style={{
                                            background: '#ffeb3b',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            PRE-ORDER
                                        </span>
                                    ) : (
                                        <span style={{ color: 'green' }}>✓ В наличии</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;