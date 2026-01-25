import React, { useState } from 'react';

function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        try {
            const res = await fetch(`${apiBase}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
        }}>
            <div className="glass fade-in" style={{
                padding: '40px',
                width: '400px',
                textAlign: 'center'
            }}>
                <h1 className="ndot" style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'lowercase' }}>prompts.</h1>
                <p style={{ color: 'var(--text-dim)', marginBottom: '32px', fontSize: '14px', textTransform: 'lowercase' }}>
                    {isLogin ? 'sign in to your account' : 'create a new account'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ textTransform: 'lowercase' }}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={{ marginTop: '8px', width: '100%', background: '#fff', color: '#000' }}>
                        {isLogin ? 'sign in' : 'sign up'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                    {isLogin ? "don't have an account? " : "already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? 'register' : 'login'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;
