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
                        <h2 className="ndot" style={{ fontSize: '24px', marginBottom: '16px' }}>nano prompts.</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                            Curating the finest prompt collections for creators.

                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/" className="footer-link" style={{ textTransform: 'lowercase' }}>landing</Link>
                            <Link to="/builder" className="footer-link" style={{ textTransform: 'lowercase' }}>drafter</Link>
                            <Link to="/video-guides" className="footer-link" style={{ textTransform: 'lowercase' }}>video guides</Link>
                            <Link to="/dashboard" className="footer-link" style={{ textTransform: 'lowercase' }}>dashboard</Link>
                            <Link to="/settings" className="footer-link" style={{ textTransform: 'lowercase' }}>api config</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/privacy" className="footer-link" style={{ textTransform: 'lowercase' }}>privacy policy</Link>
                            <Link to="/contact" className="footer-link" style={{ textTransform: 'lowercase' }}>contact</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', textTransform: 'lowercase', letterSpacing: '2px', marginBottom: '20px' }}>legal & contact</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '12px', textTransform: 'lowercase' }}>
                            we do not store your gemini api key. we recommend deleting your api key after use for maximum security.
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '12px', textTransform: 'lowercase' }}>
                            contact: <a href="mailto:aryaman@vanco.ai" style={{ color: 'var(--text)', textDecoration: 'none' }}>aryaman@vanco.ai</a>
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', textTransform: 'lowercase' }}>
                            powered by youmind repo
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '8px', textTransform: 'lowercase' }}>
                            developed by <a href="https://www.linkedin.com/in/aryamansi1712/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>aryaman</a>
                        </p>
                    </div>
                </div>
                <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                        &copy; {new Date().getFullYear()} nano prompts. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
