import React, { useEffect } from 'react';
import { Mail, Linkedin, Globe, MessageSquare } from 'lucide-react';

function Contact() {
    useEffect(() => {
        document.title = 'contact | nano prompts.';
    }, []);

    return (
        <main className="container fade-in" style={{ padding: '80px 0', maxWidth: '800px' }}>
            <h1 className="ndot" style={{ fontSize: '40px', marginBottom: '40px', textTransform: 'lowercase' }}>
                get in <span style={{ color: 'var(--accent)' }}>touch</span>.
            </h1>

            <div className="glass" style={{ padding: '40px', marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-dim)', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                    have questions, feedback, or want to collaborate on the future of prompt engineering? reach out through any of the channels below.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <a href="mailto:aryaman@vanco.ai" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass" style={{ padding: '24px', textAlign: 'center', transition: 'all 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <Mail size={24} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                            <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>email</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>aryaman@vanco.ai</p>
                        </div>
                    </a>

                    <a href="https://www.linkedin.com/in/aryamansi1712/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass" style={{ padding: '24px', textAlign: 'center', transition: 'all 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <Linkedin size={24} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                            <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>linkedin</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>connect with aryaman</p>
                        </div>
                    </a>

                    <a href="https://vanco.ai" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass" style={{ padding: '24px', textAlign: 'center', transition: 'all 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <Globe size={24} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                            <h4 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'lowercase' }}>website</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>vanco.ai</p>
                        </div>
                    </a>
                </div>
            </div>

            <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
                <MessageSquare size={20} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                    for urgent support or business inquiries, email is the fastest way to reach the development team.
                </p>
            </div>
        </main>
    );
}

export default Contact;
