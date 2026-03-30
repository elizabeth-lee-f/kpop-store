import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ChatWidget from './components/ChatWidget';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    return (
        <nav style={{
            padding: '15px 20px',
            background: '#9b59b6',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
                    🇰🇷 K-Pop Store
                </Link>
                
                {/* Кнопка чата поддержки - ЛЕВЕЕ МАГАЗИНА */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    style={{
                        background: 'white',
                        color: '#9b59b6',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#f0f0f0';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    💬 Поддержка
                </button>
                
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Магазин</Link>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>👤 Профиль</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>⚙️ Админка</Link>
                        )}
                        <button 
                            onClick={logout}
                            style={{
                                background: 'white',
                                color: '#9b59b6',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>🔐 Вход</Link>
                )}
            </div>
            
            {/* Чат виджет внутри Navbar для правильного позиционирования */}
            <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
                    <Navbar />
                    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <Routes>
                            <Route path="/" element={<Shop />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <AdminPanel />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
