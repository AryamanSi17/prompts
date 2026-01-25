import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Grid, Home, Book, AlignLeft } from 'lucide-react';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav style={{
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 100
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                <h2 className="ndot" style={{ fontSize: '24px' }}>
                    prompts<span style={{ color: 'var(--accent)' }}>.</span>
                </h2>
            </Link>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={18} />
                    <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>home</span>
                </Link>

                <Link to="/library" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Book size={18} />
                    <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>library</span>
                </Link>

                <Link to="/text-prompts" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlignLeft size={18} />
                    <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>text prompts</span>
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Grid size={18} />
                            <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>playground (coming soon)</span>
                        </Link>
                        <Link to="/settings" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings size={18} />
                            <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>api config</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 16px',
                                fontSize: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                textTransform: 'lowercase'
                            }}
                        >
                            <LogOut size={14} />
                        </button>
                    </>
                ) : (
                    <Link to="/auth">
                        <button className="primary" style={{ padding: '8px 20px', fontSize: '12px', textTransform: 'lowercase' }}>sign in</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
