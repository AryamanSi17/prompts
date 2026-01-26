import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Grid, Home, Book, AlignLeft, Menu, X, Wand2, User as UserIcon, Rss } from 'lucide-react';

import UserSearch from './UserSearch';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
                <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>text</span>
            </Link>

            {user ? (
                <>
                    <Link to="/feed" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Rss size={18} />
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>feed</span>
                    </Link>

                    <Link to={`/profile/${user.username}`} onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: user.avatar ? 'none' : 'var(--surface-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {user.avatar ? (
                                <img
                                    src={`http://localhost:5000${user.avatar}`}
                                    alt={user.username}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <UserIcon size={12} style={{ opacity: 0.5 }} />
                            )}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>profile</span>
                    </Link>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                        <h2 className="ndot" style={{ fontSize: '24px', margin: 0 }}>
                            nano prompts<span style={{ color: 'var(--accent)' }}>.</span>
                        </h2>
                    </Link>
                    <UserSearch />
                </div>

                <div className="mobile-hide" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <NavLinks />
                </div>


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
