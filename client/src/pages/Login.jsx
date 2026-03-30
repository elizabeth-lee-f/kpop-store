import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '30px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ marginBottom: '20px', color: '#9b59b6' }}>Вход 💜</h2>
            
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
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        placeholder="example@kpop.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Пароль</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                
                <button
                    type="submit"
                    style={{
                        background: '#9b59b6',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Войти
                </button>
            </form>
            
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Нет аккаунта?{' '}
                <Link to="/register" style={{ color: '#9b59b6', fontWeight: 'bold' }}>
                    Зарегистрироваться
                </Link>
            </p>
        </div>
    );
};

export default Login;