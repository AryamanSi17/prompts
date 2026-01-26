import React, { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

function UserSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async () => {
        if (query.trim().length === 0) return;

        setLoading(true);
        setShowResults(true);
        try {
            const data = await API.users.search(query, 10);
            setResults(data.users);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (username) => {
        navigate(`/profile/${username}`);
        setQuery('');
        setShowResults(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: 'min(400px, 60vw)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                        onKeyDown={handleKeyDown}
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
                            onClick={() => {
                                setQuery('');
                                setShowResults(false);
                            }}
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
                    onClick={handleSearch}
                    className="mobile-hide"
                    style={{
                        padding: '0 12px',
                        height: '34px',
                        fontSize: '11px',
                        background: '#fff',
                        color: '#000',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px'
                    }}
                >
                    search
                </button>
            </div>

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
                                            <img src={`http://localhost:5000${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    ) : (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                            <UserIcon size={24} style={{ marginBottom: '8px', opacity: 0.2 }} />
                            <p>user not found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserSearch;
