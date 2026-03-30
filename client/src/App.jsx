import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const Navbar = () => {
    const { user, logout } = useAuth();
    
    return (
        <nav style={{
            padding: '15px 20px',
            background: '#9b59b6',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                🇰🇷 K-Pop Store
            </Link>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/">🏠 Магазин</Link>
                
                {user ? (
                    <>
                        <Link to="/dashboard">👤 Профиль</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin">⚙️ Админка</Link>
                        )}
                        <button 
                            onClick={logout}
                            style={{
                                background: 'white',
                                color: '#9b59b6',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                fontWeight: 'bold'
                            }}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <Link to="/login">🔐 Вход</Link>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{ minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ padding: '20px' }}>
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
