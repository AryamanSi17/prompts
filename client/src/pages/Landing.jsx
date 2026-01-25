import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Key, Zap, Grid, Layers, ArrowRight } from 'lucide-react';
import { examplePrompts } from '../data/examples';

function Landing() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <div className="grid-container">
                <div
                    className="grid-3d"
                    style={{
                        transform: `rotateX(${60 + mousePos.y}deg) rotateZ(${mousePos.x}deg) translateY(0)`
                    }}
                ></div>
            </div>

            <section style={{ height: 'auto', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px' }}>
                <div className="container fade-in">
                    <h1 className="ndot" style={{ fontSize: 'min(80px, 12vw)', lineHeight: '1.1', marginBottom: '24px', textTransform: 'lowercase' }}>
                        a library<br />of prompts<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>
                    <p style={{ fontSize: 'min(20px, 5vw)', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 40px', textTransform: 'lowercase' }}>
                        it's tough to find prompt collections and create apps, so we curated for you.
                        scale your creativity with our modular prompt engine.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/library">
                            <button className="primary" style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'lowercase' }}>
                                go to library <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 className="ndot" style={{ fontSize: '40px', marginBottom: '60px', textAlign: 'center', textTransform: 'lowercase' }}>features.</h2>
                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Key size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>byoak(coming in playground)</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                bring your own api key. plug in your google gemini key and start generating immediately. your key stays with you.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Grid size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>curated library</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                thousands of prompts from nano banana pro and more, filtered and categorized for maximum efficiency.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Zap size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>photo & video</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                diverse options to generate both stunning high-res photos and cinematic video sequences in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <h2 className="ndot" style={{ fontSize: '40px', marginBottom: '20px', textAlign: 'center', textTransform: 'lowercase' }}>showcase.</h2>
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '60px', textTransform: 'lowercase' }}></p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        {examplePrompts.slice(0, 3).map((ex) => (
                            <div key={ex.id} className="glass" style={{ overflow: 'hidden' }}>
                                <img src={ex.image} alt={ex.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                <div style={{ padding: '20px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>{ex.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 className="ndot" style={{ fontSize: '32px', marginBottom: '24px', textTransform: 'lowercase' }}>
                        developed by <a href="https://www.linkedin.com/in/aryamansi1712/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>aryaman</a>
                    </h2>
                    <p style={{ color: 'var(--text-dim)', textTransform: 'lowercase' }}>part of the youmind repo ecosystem.</p>
                </div>
            </section>
        </div>
    );
}

export default Landing;
