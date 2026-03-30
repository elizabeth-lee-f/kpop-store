import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }
        
        try {
            await register(email, password);
            alert('Регистрация успешна! Теперь войдите.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
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
            <h2 style={{ marginBottom: '20px', color: '#9b59b6' }}>Регистрация 💜</h2>
            
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
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Подтвердите пароль</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
                    Создать аккаунт
                </button>
            </form>
            
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Есть аккаунт?{' '}
                <Link to="/login" style={{ color: '#9b59b6', fontWeight: 'bold' }}>
                    Войти
                </Link>
            </p>
        </div>
    );
};

export default Register;