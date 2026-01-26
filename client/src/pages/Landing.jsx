import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Key, Zap, Grid, Layers, ArrowRight, Wand2 } from 'lucide-react';
import { examplePrompts } from '../data/examples';
import Image from '../components/Image';


function Landing() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        document.title = 'nano prompts. | Premium Prompt Presets & AI Engine Library';
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

            <section style={{
                height: 'auto',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 20px',
                paddingTop: '60px' // Spacer for navbar
            }}>

                <div className="container fade-in">
                    <h1 className="ndot" style={{ fontSize: 'min(80px, 12vw)', lineHeight: '1.1', marginBottom: '24px', textTransform: 'lowercase' }}>
                        the world's<br />best <span style={{ color: 'var(--accent)' }}>prompt library</span>.
                    </h1>
                    <p style={{ fontSize: 'min(20px, 5vw)', color: 'var(--text-dim)', maxWidth: '750px', margin: '0 auto 40px', textTransform: 'lowercase' }}>
                        unleash the full power of nano banana with our professional prompt presets.
                        the ultimate engine library for high-performance AI generation.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/library">
                            <button className="primary" style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'lowercase' }}>
                                explore presets <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 className="ndot" style={{ fontSize: '40px', marginBottom: '60px', textAlign: 'center', textTransform: 'lowercase' }}>advanced features.</h2>
                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Key size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>nano prompt presets</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                pre-architected prompt presets for fast, consistent, and high-quality results in any ai environment.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Grid size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>engine architectures</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                thousands of curated engine prompts specifically for nano banana pro and google dev clusters.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '40px' }}>
                            <Zap size={32} style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '16px', textTransform: 'lowercase' }}>pro generation</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                                the most diverse prompt collection for generating high-definition assets and cinematic visual prompts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <h2 className="ndot" style={{ fontSize: '40px', marginBottom: '20px', textAlign: 'center', textTransform: 'lowercase' }}>preset showcase.</h2>
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '60px', textTransform: 'lowercase' }}>trending architecture models</p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        {examplePrompts.slice(0, 3).map((ex) => (
                            <div key={ex.id} className="glass" style={{ overflow: 'hidden' }}>
                                <Image src={ex.image} alt={ex.title} style={{ width: '100%', height: '300px' }} />
                                <div style={{ padding: '20px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>{ex.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Footnote Section */}
            <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.5)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', maxWidth: '800px', margin: '0 auto', lineHeight: '2' }}>
                        popular keywords: prompt presets, nano prompts library, best ai prompts for creators,
                        google gemini nano templates, banana pro prompt engineering, architectural prompts for development,
                        high performance ai generation presets, 10k prompt database, free pro prompts, character prompt presets.
                    </p>
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
