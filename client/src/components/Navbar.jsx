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

                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Settings size={18} />
                        <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'lowercase' }}>settings</span>
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
        <>
            <nav style={{
                padding: '15px 20px',
                borderBottom: '1px solid var(--border)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(15px)',
                zIndex: 1000
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                            <h2 className="ndot" style={{ fontSize: '18px', margin: 0, whiteSpace: 'nowrap' }}>
                                nano prompts<span style={{ color: 'var(--accent)' }}>.</span>
                            </h2>
                        </Link>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <UserSearch />
                    </div>


                    <div className="mobile-hide" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <NavLinks />
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-show" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--border)',
                display: 'none',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '12px 10px',
                zIndex: 1000,
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'
            }}>
                <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Home size={22} />
                </Link>

                <Link to="/library" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Book size={22} />
                </Link>

                {user ? (
                    <>
                        <Link to="/feed" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <Rss size={22} />
                        </Link>

                        <Link to={`/profile/${user.username}`} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: user.avatar ? 'none' : 'var(--surface-alt)',
                                border: '1px solid var(--border)',
                                overflow: 'hidden'
                            }}>
                                {user.avatar ? (
                                    <img src={`http://localhost:5000${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UserIcon size={12} style={{ opacity: 0.5 }} />
                                )}
                            </div>
                        </Link>

                        <Link to="/settings" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <Settings size={22} />
                        </Link>
                    </>
                ) : (
                    <Link to="/auth" style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <UserIcon size={22} />
                    </Link>
                )}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-hide { display: none !important; }
                    .mobile-show { display: flex !important; }
                }
            `}</style>
        </>
    );
}

export default Navbar;
