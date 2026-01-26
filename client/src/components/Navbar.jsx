import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Home, Book, AlignLeft, User as UserIcon, Rss } from 'lucide-react';
import UserSearch from './UserSearch';
import { API_BASE } from '../utils/api';

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
            <Link to="/library" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', transition: 'all 0.3s' }} className="nav-item">
                <Book size={20} />
                <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'lowercase' }}>library</span>
            </Link>

            <Link to="/text-prompts" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', transition: 'all 0.3s' }} className="nav-item">
                <AlignLeft size={20} />
                <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'lowercase' }}>text</span>
            </Link>

            {user ? (
                <>
                    <Link to="/feed" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', transition: 'all 0.3s' }} className="nav-item">
                        <Rss size={20} />
                        <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'lowercase' }}>feed</span>
                    </Link>

                    <Link to={`/profile/${user.username}`} onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', transition: 'all 0.3s' }} className="nav-item">
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: user.avatar ? 'none' : 'var(--surface-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}>
                            {user.avatar ? (
                                <img
                                    src={`${API_BASE}${user.avatar}`}
                                    alt={user.username}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <UserIcon size={14} style={{ opacity: 0.5 }} />
                            )}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'lowercase' }}>profile</span>
                    </Link>

                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', transition: 'all 0.3s' }} className="nav-item">
                        <Settings size={20} />
                        <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'lowercase' }}>settings</span>
                    </Link>

                    <button onClick={handleLogout} style={{ border: 'none', color: 'var(--text-dim)', fontSize: '10px', marginTop: '10px', opacity: 0.5 }}>logout</button>
                </>
            ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} style={{ padding: '12px' }}>
                    <button className="primary" style={{ padding: '8px', width: '40px', height: '40px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserIcon size={16} />
                    </button>
                </Link>
            )}
        </>
    );

    return (
        <>
            <nav style={{
                padding: '12px 20px',
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
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: '500px' }}>
                        <UserSearch />
                    </div>
                    <div style={{ width: '100px' }} className="mobile-hide"></div>
                </div>
            </nav>

            {/* Vertical Sidebar - Right */}
            <div className="sidebar-right" style={{
                position: 'fixed',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 1001,
                padding: '12px 8px',
                background: 'rgba(15, 15, 15, 0.4)',
                backdropFilter: 'blur(25px)',
                borderRadius: '50px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <NavLinks />
            </div>

            <style>{`
                .nav-item:hover {
                    color: #fff !important;
                    transform: scale(1.1);
                }
                
                @media (max-width: 768px) {
                    .sidebar-right {
                        right: 8px;
                        padding: 8px 4px;
                    }
                    .nav-item {
                        padding: 10px 6px !important;
                    }
                    .nav-item span {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}

export default Navbar;
