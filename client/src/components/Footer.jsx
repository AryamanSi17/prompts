import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '60px 0',
            marginTop: '80px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px'
                }}>
                    <div>
                        <h2 className="ndot" style={{ fontSize: '24px', marginBottom: '16px', textTransform: 'lowercase' }}>nano prompts</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px', textTransform: 'lowercase' }}>
                            curating the finest prompt collections for creators, builders, and teams.
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '16px', textTransform: 'lowercase' }}>
                            developed by <a href="https://www.linkedin.com/in/aryamansi1712/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>aryaman</a>
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px', textTransform: 'lowercase' }}>
                            part of the youmind repo ecosystem
                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/" className="footer-link" style={{ textTransform: 'lowercase' }}>landing</Link>
                            <Link to="/library" className="footer-link" style={{ textTransform: 'lowercase' }}>library</Link>
                            <Link to="/feed" className="footer-link" style={{ textTransform: 'lowercase' }}>playground</Link>
                            <Link to="/builder" className="footer-link" style={{ textTransform: 'lowercase' }}>drafter</Link>
                            <Link to="/dashboard" className="footer-link" style={{ textTransform: 'lowercase' }}>dashboard</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/privacy" className="footer-link" style={{ textTransform: 'lowercase' }}>privacy policy</Link>
                            <Link to="/contact" className="footer-link" style={{ textTransform: 'lowercase' }}>legal & contact</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>contact</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '12px', textTransform: 'lowercase' }}>
                            <a href="mailto:aryaman@vanco.ai" style={{ color: 'var(--text)', textDecoration: 'none' }}>aryaman@vanco.ai</a>
                        </p>
                    </div>
                </div>
                <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '11px', textTransform: 'lowercase', marginBottom: '8px' }}>
                        powered by youmind repo
                    </p>
                    <p style={{ color: 'var(--text-dim)', fontSize: '12px', textTransform: 'lowercase' }}>
                        &copy; {new Date().getFullYear()} nano prompts. all rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
