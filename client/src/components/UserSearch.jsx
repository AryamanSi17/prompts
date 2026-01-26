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
        <div ref={searchRef} style={{ position: 'relative', width: 'min(400px, 50vw)', minWidth: '220px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-dim)',
                        pointerEvents: 'none'
                    }} />
                    <input
                        type="text"
                        placeholder="search creators..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            paddingLeft: '36px',
                            paddingRight: '36px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            width: '100%',
                            transition: 'all 0.2s',
                            height: '38px'
                        }}
                    />
                    {query && (
                        <X
                            size={14}
                            onClick={() => {
                                setQuery('');
                                setShowResults(false);
                            }}
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
                </div>
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '0 16px',
                        height: '38px',
                        fontSize: '12px',
                        background: '#fff',
                        color: '#000',
                        fontWeight: '600'
                    }}
                >
                    search
                </button>
            </div>

            {showResults && (
                <div className="glass shadow-lg" style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: 0,
                    width: '100%',
                    zIndex: 2000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '6px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                    animation: 'fadeIn 0.2s ease-out',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                    {loading ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                            <div className="spin" style={{
                                width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 8px'
                            }}></div>
                            searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <p style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                                found {results.length} creators
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
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
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
                                            <img src={`http://localhost:5000${user.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <UserIcon size={16} style={{ opacity: 0.5 }} />
                                        )}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <p style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                                            {user.displayName || user.username}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                            <UserIcon size={24} style={{ marginBottom: '8px', opacity: 0.2 }} />
                            <p>no users found for "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserSearch;
