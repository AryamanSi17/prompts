import React, { useEffect } from 'react';
import { Shield, Lock, EyeOff, Key } from 'lucide-react';

function Privacy() {
    useEffect(() => {
        document.title = 'privacy | nano prompts.';
    }, []);

    return (
        <main className="container fade-in" style={{ padding: '80px 0', maxWidth: '800px' }}>
            <h1 className="ndot" style={{ fontSize: '40px', marginBottom: '40px', textTransform: 'lowercase' }}>
                privacy <span style={{ color: 'var(--accent)' }}>policy</span>.
            </h1>

            <div className="glass" style={{ padding: '40px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'flex-start' }}>
                    <Shield size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'lowercase' }}>your data is yours</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                            at nano prompts., we prioritize your security. we do not sell, trade, or share your personal information with third parties.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'flex-start' }}>
                    <Key size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'lowercase' }}>api key security</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                            your gemini api keys are stored locally in your browser's indexedDB/localStorage. we never upload your keys to our servers.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'flex-start' }}>
                    <Lock size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'lowercase' }}>account information</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                            we store minimal account data (email and hashed passwords) only to provide you access to the library and personalized features.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <EyeOff size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'lowercase' }}>zero tracking</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>
                            we do not use invasive tracking pixels or third-party behavioral analytics. your browsing history within the app is private.
                        </p>
                    </div>
                </div>
            </div>

            <p style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center', textTransform: 'lowercase' }}>
                last updated: january 2026. for any questions, contact us through the official channels.
            </p>
        </main>
    );
}

export default Privacy;
