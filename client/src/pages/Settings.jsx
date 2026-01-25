import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle } from 'lucide-react';

function Settings() {
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.apiKey) setApiKey(user.apiKey);
    }, []);

    const handleSave = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        user.apiKey = apiKey;
        localStorage.setItem('user', JSON.stringify(user));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="container fade-in" style={{ padding: '80px 0' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 className="ndot" style={{ fontSize: '40px', marginBottom: '8px', textTransform: 'lowercase' }}>settings.</h1>
                <p style={{ color: 'var(--text-dim)', marginBottom: '40px', textTransform: 'lowercase' }}>configure your ai integration preferences.</p>

                <div className="glass" style={{ padding: 'min(40px, 8vw)', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: 600, textTransform: 'lowercase' }}>how to get your api key</h2>
                    <ul style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', textTransform: 'lowercase' }}>
                        <li>1. visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>google ai studio</a>.</li>
                        <li>2. sign in with your google account.</li>
                        <li>3. click on "create api key" and copy the generated key.</li>
                        <li>4. paste it into the field below to activate the prompt engine.</li>
                    </ul>
                </div>

                <div className="glass" style={{ padding: 'min(40px, 8vw)' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, textTransform: 'lowercase' }}>
                                <Key size={16} />
                                gemini api key
                            </label>
                            <button
                                onClick={async () => {
                                    const text = await navigator.clipboard.readText();
                                    setApiKey(text);
                                }}
                                style={{ padding: '4px 12px', fontSize: '10px', border: '1px solid var(--border)', textTransform: 'lowercase' }}
                            >
                                paste from clipboard
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="enter your google gemini api key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ padding: '16px', marginBottom: '12px' }}
                        />
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'lowercase', marginBottom: '24px' }}>
                            <AlertCircle size={12} />
                            we don't store your gemini api key on our servers. it is kept only in your local browser storage.
                        </p>
                    </div>

                    <div className="mobile-stack" style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleSave}
                            style={{
                                flex: 2,
                                background: '#fff',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                textTransform: 'lowercase'
                            }}
                        >
                            <Save size={18} />
                            {saved ? 'settings saved' : 'save configuration'}
                        </button>
                        <button
                            onClick={() => {
                                const user = JSON.parse(localStorage.getItem('user'));
                                delete user.apiKey;
                                localStorage.setItem('user', JSON.stringify(user));
                                setApiKey('');
                                alert('api key deleted from browser storage. this will not delete your actual google api key.');
                            }}
                            style={{
                                flex: 1,
                                border: '1px solid #ff4444',
                                color: '#ff4444',
                                background: 'transparent',
                                textTransform: 'lowercase'
                            }}
                        >
                            delete key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
