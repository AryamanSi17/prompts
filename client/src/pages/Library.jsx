import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Book, CheckCircle, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { libraryPrompts } from '../data/libraryData';
import Image from '../components/Image';


function Library() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(12);
    const [copiedId, setCopiedId] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        document.title = 'library | nano prompts.';
        if (selectedPrompt) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedPrompt]);

    const categories = useMemo(() => ['all', ...new Set(libraryPrompts.map(p => p.category))], []);

    const filteredPrompts = useMemo(() => {
        return libraryPrompts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        addToast('engine prompt copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    return (
        <main className="container fade-in" style={{ padding: '80px 0' }}>

            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 className="ndot" style={{ fontSize: 'min(56px, 12vw)', marginBottom: '16px', textTransform: 'lowercase' }}>
                    nano prompt <span style={{ color: 'var(--accent)' }}>library</span>.
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: 'min(18px, 4.5vw)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6', textTransform: 'lowercase', padding: '0 20px' }}>
                    a curated collection of the most powerful engines for google nano banana pro. find inspiration and start generating. —YouMind Repo
                </p>

                <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                    <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                        <Search size={20} style={{ opacity: 0.5, marginRight: '12px' }} />
                        <input
                            type="text"
                            placeholder="search by style, category, or effect..."
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

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setVisibleCount(12);
                            }}
                            style={{
                                padding: '8px 20px',
                                fontSize: '11px',
                                background: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.05)',
                                color: selectedCategory === cat ? '#000' : '#fff',
                                border: 'none',
                                textTransform: 'lowercase',
                                fontWeight: 700,
                                letterSpacing: '1px'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
                alignItems: 'start'
            }}>
                {filteredPrompts.slice(0, visibleCount).map(p => (
                    <div
                        key={p.id}
                        className="glass"
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onClick={() => setSelectedPrompt(p)}
                    >
                        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                            <Image src={p.image} alt={p.title} style={{ width: '100%', height: '100%' }} />

                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(10px)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'lowercase',
                                letterSpacing: '1px'
                            }}>
                                {p.category}
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: 700, textTransform: 'lowercase' }}>{p.title}</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', minHeight: '66px', textTransform: 'lowercase' }}>
                                {p.description}
                            </p>

                            <div className="glass" style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', marginBottom: '20px' }}>
                                <p style={{ fontSize: '12px', opacity: 0.4, marginBottom: '8px', textTransform: 'lowercase', letterSpacing: '1px' }}>engine prompt</p>
                                <p style={{ fontSize: '13px', lineHeight: '1.4', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    "{p.prompt}"
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                                    by <span style={{ color: '#fff' }}>@{p.author.toLowerCase().replace(/\s/g, '')}</span>
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(p.id, p.prompt);
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        width: '100px',
                                        fontSize: '10px',
                                        background: copiedId === p.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                        color: copiedId === p.id ? '#000' : '#fff',
                                        border: '1px solid var(--border)',
                                        textTransform: 'lowercase',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {copiedId === p.id ? 'copied' : 'copy prompt'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPrompts.length > visibleCount && (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button
                        onClick={loadMore}
                        className="glass"
                        style={{ padding: '16px 40px', textTransform: 'lowercase', fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}
                    >
                        load more prompts
                    </button>
                </div>
            )}

            {filteredPrompts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Sparkles size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
                    <p style={{ color: 'var(--text-dim)', textTransform: 'lowercase' }}>no engines found matching your search.</p>
                </div>
            )}

            {/* Modal */}
            {selectedPrompt && (
                <div
                    onClick={() => setSelectedPrompt(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.9)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="glass modal-content"
                        style={{
                            maxWidth: '1000px',
                            width: '100%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'hidden',
                            position: 'relative',
                            animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <button
                            onClick={() => setSelectedPrompt(null)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px',
                                borderRadius: '50%',
                                zIndex: 100,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div className="modal-image-container" style={{ flex: '1.2', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <Image
                                src={selectedPrompt.image}
                                alt={selectedPrompt.title}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>


                        <div className="modal-info-container" style={{ flex: '0.8', padding: '40px', overflowY: 'auto', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <span style={{
                                    background: 'var(--accent)',
                                    color: '#000',
                                    padding: '4px 12px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'lowercase',
                                    borderRadius: '2px',
                                    marginBottom: '16px',
                                    display: 'inline-block'
                                }}>
                                    {selectedPrompt.category}
                                </span>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', textTransform: 'lowercase' }}>{selectedPrompt.title}</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: '1.7', textTransform: 'lowercase' }}>
                                    {selectedPrompt.description}
                                </p>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '2px' }}>engine prompt</h4>
                                <div style={{
                                    padding: '24px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    position: 'relative'
                                }}>
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', color: '#eee' }}>
                                        "{selectedPrompt.prompt}"
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <button
                                    onClick={() => handleCopy(selectedPrompt.id, selectedPrompt.prompt)}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        fontSize: '12px',
                                        background: copiedId === selectedPrompt.id ? 'var(--accent)' : '#fff',
                                        color: '#000',
                                        border: 'none',
                                        fontWeight: 700,
                                        textTransform: 'lowercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {copiedId === selectedPrompt.id ? 'copied successfully' : 'copy engine prompt'}
                                </button>
                            </div>

                            <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                                author: <span style={{ color: '#fff' }}>@{selectedPrompt.author.toLowerCase().replace(/\s/g, '')}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 20px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @media (max-width: 900px) {
                    .modal-content { 
                        flex-direction: column !important; 
                        max-height: 95vh !important;
                        width: 95% !important;
                    }
                    .modal-image-container { 
                        height: 300px !important; 
                        flex: none !important; 
                    }
                    .modal-info-container { 
                        flex: 1 !important; 
                        padding: 24px !important;
                    }
                    .modal-content h2 {
                        font-size: 24px !important;
                    }
                }
            `}</style>
        </main>
    );
}

export default Library;
