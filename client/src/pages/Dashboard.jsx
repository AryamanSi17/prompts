import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';

function Dashboard() {
    React.useEffect(() => {
        document.title = 'playground | prompts.';
    }, []);
    return (
        <main className="container fade-in" style={{ padding: '100px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{
                maxWidth: '800px',
                width: '100%',
                padding: 'min(80px, 12vw) min(40px, 8vw)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'var(--accent)',
                    filter: 'blur(100px)',
                    opacity: 0.1
                }} />

                <div style={{ marginBottom: '40px' }}>
                    <div className="glass" style={{
                        display: 'inline-flex',
                        padding: '8px 20px',
                        borderRadius: '40px',
                        marginBottom: '32px',
                        border: '1px solid var(--accent)',
                        background: 'rgba(255,255,255,0.05)'
                    }}>
                        <p style={{
                            fontSize: '12px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            color: 'var(--accent)'
                        }}>under progress</p>
                    </div>

                    <h1 className="ndot" style={{ fontSize: 'min(72px, 14vw)', marginBottom: '24px', lineHeight: 1 }}>
                        the <span style={{ color: 'var(--accent)' }}>playground</span>.
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-dim)',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto 48px',
                        textTransform: 'lowercase'
                    }}>
                        we're rebuilding the prompt engine from the ground up. soon, you'll be able to generate, iterate, and master nano banana pro directly in your browser with zero latency.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '64px',
                    textAlign: 'left'
                }}>
                    <div className="glass" style={{ padding: '24px' }}>
                        <Zap size={24} style={{ marginBottom: '16px', color: 'var(--accent)' }} />
                        <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>real-time gen</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>instant visual feedback as you type your engine prompts.</p>
                    </div>
                    <div className="glass" style={{ padding: '24px' }}>
                        <Cpu size={24} style={{ marginBottom: '16px', color: 'var(--accent)' }} />
                        <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>native integration</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>direct connection to google nano banana pro api clusters.</p>
                    </div>
                    <div className="glass" style={{ padding: '24px' }}>
                        <Globe size={24} style={{ marginBottom: '16px', color: 'var(--accent)' }} />
                        <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>cloud library</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>save and sync your custom prompt engines across devices.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/library">
                        <button className="primary" style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'lowercase' }}>
                            explore the library <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
