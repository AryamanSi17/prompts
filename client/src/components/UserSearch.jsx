import React, { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API, { API_BASE } from '../utils/api';

function UserSearch({ isMobileModal = false, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-focus on mobile modal
    useEffect(() => {
        if (isMobileModal && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isMobileModal]);

    const handleSearch = async () => {
        if (query.trim().length === 0) {
            setResults([]);
            setShowResults(false);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setShowResults(true);
        setHasSearched(true);

        try {
            const data = await API.users.search(query, 10);
            console.log('Search results:', data);
            setResults(data.users || []);
        } catch (err) {
            console.error('Search error:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (username) => {
        navigate(`/profile/${username}`);
        setQuery('');
        setShowResults(false);
        setHasSearched(false);
        if (onClose) onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const handleClear = () => {
        setQuery('');
        setShowResults(false);
        setHasSearched(false);
        setResults([]);
        if (inputRef.current) inputRef.current.focus();
    };

    // Mobile full-screen modal
    if (isMobileModal) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.97)',
                backdropFilter: 'blur(20px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.2s ease-out'
            }}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}>
                    <form onSubmit={handleSubmit} style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-dim)',
                            pointerEvents: 'none'
                        }} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="search users..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            style={{
                                paddingLeft: '40px',
                                paddingRight: '40px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                fontSize: '14px',
                                width: '100%',
                                height: '42px',
                                color: '#fff'
                            }}
                        />
                        {query && (
                            <X
                                size={16}
                                onClick={handleClear}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: 'var(--text-dim)'
                                }}
                            />
                        )}
                    </form>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '14px',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        Cancel
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {loading ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px' }}>
                            <div className="spin" style={{
                                width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 12px'
                            }}></div>
                            searching...
                        </div>
                    ) : hasSearched && results.length > 0 ? (
                        <>
                            <p style={{ padding: '0 0 16px', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>
                            {results.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => handleSelectUser(user.username)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginBottom: '8px',
                                        background: 'rgba(255,255,255,0.03)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                >
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        background: 'var(--surface-alt)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '1px solid var(--border)'
                                    }}>
                                        {user.avatar ? (
                                            <img src={`${API_BASE}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <UserIcon size={18} style={{ opacity: 0.5 }} />
                                        )}
                                    </div>
                                    <div style={{ overflow: 'hidden', flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                                            {user.displayName || user.username}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : hasSearched ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px' }}>
                            <UserIcon size={48} style={{ marginBottom: '16px', opacity: 0.2, margin: '0 auto 16px' }} />
                            <p>No users found for "{query}"</p>
                        </div>
                    ) : (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px' }}>
                            <Search size={48} style={{ marginBottom: '16px', opacity: 0.2, margin: '0 auto 16px' }} />
                            <p>Search for users by name or username</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Desktop inline search
    return (
        <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: 'min(400px, 60vw)' }} className="desktop-search">
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={14} style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-dim)',
                        pointerEvents: 'none'
                    }} />
                    <input
                        type="text"
                        placeholder="search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            paddingLeft: '32px',
                            paddingRight: '32px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            width: '100%',
                            transition: 'all 0.2s',
                            height: '34px'
                        }}
                    />
                    {query && (
                        <X
                            size={12}
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: 'var(--text-dim)'
                            }}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '0 12px',
                        height: '34px',
                        fontSize: '11px',
                        background: '#fff',
                        color: '#000',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px',
                        flexShrink: 0
                    }}
                >
                    <span>search</span>
                </button>
            </form>

            {showResults && (
                <div className="glass shadow-lg" style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: 0,
                    width: 'min(300px, 85vw)',
                    zIndex: 2005,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '8px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    animation: 'fadeIn 0.2s ease-out',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(10, 10, 10, 0.95)',
                }}>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                            <div className="spin" style={{
                                width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 8px'
                            }}></div>
                            searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <p style={{ padding: '4px 10px 10px', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'lowercase', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                                matching creators
                            </p>
                            {results.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => handleSelectUser(user.username)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginBottom: '4px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'var(--surface-alt)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '1px solid var(--border)'
                                    }}>
                                        {user.avatar ? (
                                            <img src={`${API_BASE}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <UserIcon size={14} style={{ opacity: 0.5 }} />
                                        )}
                                    </div>
                                    <div style={{ overflow: 'hidden', flex: 1 }}>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                                            {user.displayName || user.username}
                                        </p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : hasSearched ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                            <UserIcon size={24} style={{ marginBottom: '8px', opacity: 0.2 }} />
                            <p>no users found</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default UserSearch;
