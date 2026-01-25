import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Copy, Check, Loader2 } from 'lucide-react';

function TextPrompts() {
    const [prompts, setPrompts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const apiBase = 'https://prompts-server-drab.vercel.app';

    useEffect(() => {
        document.title = 'text engines | prompts.';
    }, []);

    const fetchPrompts = useCallback(async (pageNum, query = '') => {
        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/api/prompts?page=${pageNum}&limit=10&search=${query}&type=photo`);
            const data = await response.json();

            if (pageNum === 1) {
                setPrompts(data);
            } else {
                setPrompts(prev => [...prev, ...data]);
            }

            setHasMore(data.length === 10);
        } catch (error) {
            console.error('Failed to fetch prompts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchPrompts(1, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPrompts]);


    useEffect(() => {
        if (page > 1) {
            fetchPrompts(page, searchQuery);
        }
    }, [page, searchQuery, fetchPrompts]);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);

    };

    return (
        <main className="container fade-in" style={{ padding: '60px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="ndot" style={{ fontSize: 'min(56px, 12vw)', marginBottom: '16px', textTransform: 'lowercase' }}>
                    text <span style={{ color: 'var(--accent)' }}>engines</span>.
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: 'min(18px, 4.5vw)', maxWidth: '600px', margin: '0 auto 40px', textTransform: 'lowercase', padding: '0 20px' }}>
                    access the complete raw database of 10,000+ nano banana pro engines. paginated and optimized.
                </p>

                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                        <Search size={20} style={{ opacity: 0.5, marginRight: '12px' }} />
                        <input
                            type="text"
                            placeholder="search 10,000+ prompts ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '20px 0',
                                width: '100%',
                                textTransform: 'lowercase'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="prompts-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {prompts.map((p) => (
                    <div
                        key={p._id}
                        className="glass prompt-card"
                        style={{
                            padding: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '24px',
                            transition: 'all 0.2s ease',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, textTransform: 'lowercase', letterSpacing: '1px' }}>
                                    {p.category || 'general'}
                                </span>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'lowercase', margin: 0 }}>{p.title}</h3>
                            </div>
                            <p style={{
                                fontSize: '13px',
                                color: 'var(--text-dim)',
                                fontStyle: 'italic',
                                margin: 0,
                                lineHeight: '1.5',
                                opacity: 0.8,
                                wordBreak: 'break-word'
                            }}>
                                "{p.content}"
                            </p>
                        </div>
                        <button
                            onClick={() => handleCopy(p._id, p.content)}
                            style={{
                                padding: '10px',
                                borderRadius: '4px',
                                background: copiedId === p._id ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                color: copiedId === p._id ? '#000' : '#fff',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            {copiedId === p._id ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                @media (max-width: 600px) {
                    .prompt-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                    }
                    .prompt-card button {
                        align-self: flex-end;
                    }
                }
            `}</style>

            {loading && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
                </div>
            )}

            {!loading && hasMore && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="glass"
                        style={{
                            padding: '16px 40px',
                            textTransform: 'lowercase',
                            fontSize: '12px',
                            letterSpacing: '2px',
                            fontWeight: 700,
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    >
                        load more prompts
                    </button>
                </div>
            )}

            {!hasMore && prompts.length > 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '40px', fontSize: '12px' }}>
                    you've reached the end of the engine database.
                </p>
            )}

            {prompts.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <p style={{ color: 'var(--text-dim)', textTransform: 'lowercase' }}>no engines found matching your search.</p>
                </div>
            )}
        </main>
    );
}

export default TextPrompts;
