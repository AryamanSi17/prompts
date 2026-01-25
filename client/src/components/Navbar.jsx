import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Grid, Home, Book, AlignLeft, Menu, X, Wand2 } from 'lucide-react';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        setIsMenuOpen(false);
    };

    const NavLinks = () => (
        <>
            <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Home size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>home</span>
            </Link>

            <Link to="/library" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Book size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>library</span>
            </Link>

            <Link to="/text-prompts" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlignLeft size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>text prompts</span>
            </Link>

            <Link to="/builder" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Wand2 size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>drafter</span>
            </Link>

            {user ? (
                <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Grid size={18} />
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>playground</span>
                    </Link>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Settings size={18} />
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>config</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 20px',
                            fontSize: '12px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            textTransform: 'lowercase',
                            width: 'fit-content'
                        }}
                    >
                        logout
                    </button>
                </>
            ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <button className="primary" style={{ padding: '8px 24px', fontSize: '12px', textTransform: 'lowercase' }}>sign in</button>
                </Link>
            )}
        </>
    );

    return (
        <nav style={{
            padding: '20px',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                    <h2 className="ndot" style={{ fontSize: '24px', margin: 0 }}>
                        nano prompts<span style={{ color: 'var(--accent)' }}>.</span>
                    </h2>
                </Link>

                {/* Desktop Nav */}
                <div className="mobile-hide" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <NavLinks />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-show"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'transparent',
                        border: 'none',
                        padding: '8px',
                        color: '#fff'
                    }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '73px',
                    left: 0,
                    width: '100%',
                    height: 'calc(100vh - 73px)',
                    background: '#000',
                    padding: '40px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    zIndex: 999,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <NavLinks />
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-hide { display: none !important; }
                    .mobile-show { display: block !important; }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;
