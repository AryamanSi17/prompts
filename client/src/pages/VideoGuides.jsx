import React, { useEffect, useState } from 'react';
import { videoGuides } from '../data/videoGuides';
import { Play, Copy, Check, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function VideoGuides() {
    const [selectedGuide, setSelectedGuide] = useState(videoGuides[0]);
    const [copiedId, setCopiedId] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        document.title = 'video guides | nano prompts.';
    }, []);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        addToast('prompt copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <main className="container fade-in" style={{ padding: '60px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="ndot" style={{ fontSize: 'min(56px, 12vw)', marginBottom: '16px', textTransform: 'lowercase' }}>
                    video <span style={{ color: 'var(--accent)' }}>guides</span>.
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '16px', textTransform: 'lowercase', maxWidth: '600px', margin: '0 auto' }}>
                    master cinematic AI video generation using veo 3.1 and kling 2.5 turbo architectures.
                </p>
            </div>

            {/* Model Info Banner */}
            <div className="glass" style={{
                padding: '24px',
                marginBottom: '60px',
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                flexWrap: 'wrap',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>standard images</p>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Nano Banana Pro on Gemini</p>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border)', display: 'none' }} className="mobile-hide" />
                <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>cinematic video</p>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Veo 3.1 or Kling 2.5 Turbo</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }} className="mobile-stack">
                {/* Sidebar - Guide Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {videoGuides.map(guide => (
                        <div
                            key={guide.id}
                            onClick={() => setSelectedGuide(guide)}
                            className="glass"
                            style={{
                                padding: '20px',
                                cursor: 'pointer',
                                border: selectedGuide.id === guide.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                                background: selectedGuide.id === guide.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <h3 style={{ fontSize: '14px', marginBottom: '4px', textTransform: 'lowercase' }}>{guide.title}</h3>
                            <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{guide.model}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content - Visual Storyboard */}
                <div className="fade-in" key={selectedGuide.id}>
                    <div className="glass" style={{ padding: 'min(40px, 6vw)', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                            {/* Concept & Main Prompt */}
                            <div style={{ flex: '1.2', minWidth: '300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Play size={20} fill="black" />
                                    </div>
                                    <h2 className="ndot" style={{ fontSize: '24px', textTransform: 'lowercase' }}>{selectedGuide.title}</h2>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>master architecture prompt:</p>
                                    <div className="glass" style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                                        <p style={{ fontSize: '14px', lineHeight: '1.8', fontStyle: 'italic', color: '#eee' }}>"{selectedGuide.mainPrompt}"</p>
                                        <button
                                            onClick={() => handleCopy('main', selectedGuide.mainPrompt)}
                                            style={{
                                                position: 'absolute',
                                                bottom: '-15px',
                                                right: '20px',
                                                background: copiedId === 'main' ? 'var(--accent)' : '#fff',
                                                color: '#000',
                                                padding: '8px 16px',
                                                fontSize: '11px',
                                                fontWeight: 800
                                            }}
                                        >
                                            {copiedId === 'main' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedId === 'main' ? 'copied' : 'copy main'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '12px' }}>
                                    <Info size={14} />
                                    <p>recommended model: {selectedGuide.model}</p>
                                </div>
                            </div>

                            {/* Shots Column - Taking inspiration from arrows in screenshot */}
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>shot variations / break-outs</p>
                                {selectedGuide.shots.map(shot => (
                                    <div key={shot.id} className="glass" style={{
                                        padding: '16px',
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <img src={shot.image} alt={shot.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '12px', marginBottom: '4px', textTransform: 'lowercase' }}>{shot.title}</h4>
                                            <p style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: '1.4' }}>{shot.prompt.substring(0, 60)}...</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(shot.id, shot.prompt)}
                                            style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px' }}
                                        >
                                            {copiedId === shot.id ? <Check size={14} style={{ color: 'var(--accent)' }} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .mobile-stack {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </main>
    );
}

export default VideoGuides;
