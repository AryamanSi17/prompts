import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api';

function Auth({ setUser }) {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.mode !== 'register');
    const [step, setStep] = useState('auth');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'auth | nano prompts.';
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const data = await API.auth.login(email, password);

                if (data.requiresVerification) {
                    setUserId(data.userId);
                    setStep('otp');
                    addToast('Please verify your email first', 'info');
                } else {
                    API.setToken(data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUser(data.user);
                    addToast('welcome back!', 'success');
                    navigate('/feed');
                }
            } else {
                const data = await API.auth.register(email, password, username);
                setUserId(data.userId);
                setStep('otp');
                addToast('Check your email for OTP', 'success');
            }
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await API.auth.verifyOTP(userId, otp);
            API.setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            addToast('Email verified! Welcome to nano prompts', 'success');
            navigate('/feed');
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await API.auth.resendOTP(userId);
            addToast('OTP resent to your email', 'success');
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            const data = await API.auth.login('demo@nanoprompts.space', 'demo123');
            API.setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            addToast('Logged in as demo user', 'success');
            navigate('/feed');
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'otp') {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
            }}>
                <div className="glass fade-in" style={{
                    padding: '40px 20px',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 20px',
                    textAlign: 'center'
                }}>
                    <h1 className="ndot" style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'lowercase' }}>verify email</h1>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '32px', fontSize: '14px', textTransform: 'lowercase' }}>
                        enter the 6-digit code sent to {email}
                    </p>

                    <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            maxLength={6}
                            style={{
                                textAlign: 'center',
                                fontSize: '24px',
                                letterSpacing: '8px',
                                fontWeight: '700'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            style={{ marginTop: '8px', width: '100%', background: '#fff', color: '#000' }}
                        >
                            {loading ? 'verifying...' : 'verify'}
                        </button>
                    </form>

                    <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                        didn't receive code?{' '}
                        <span
                            onClick={handleResendOTP}
                            style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            resend
                        </span>
                    </p>
                    <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                        <span
                            onClick={() => setStep('auth')}
                            style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            back to login
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
        }}>
            <div className="glass fade-in" style={{
                padding: '40px 20px',
                width: '100%',
                maxWidth: '400px',
                margin: '0 20px',
                textAlign: 'center'
            }}>
                <h1 className="ndot" style={{ fontSize: '32px', marginBottom: '32px', textTransform: 'lowercase' }}>
                    {isLogin ? 'sign in' : 'register'}
                </h1>


                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                            required
                            minLength={3}
                            style={{ textTransform: 'lowercase' }}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        required
                        style={{ textTransform: 'lowercase' }}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '8px', width: '100%', background: '#fff', color: '#000' }}
                    >
                        {loading ? '...' : (isLogin ? 'sign in' : 'sign up')}
                    </button>
                </form>

                <div style={{ margin: '24px 0', height: '1px', background: 'var(--border)' }}></div>

                <button
                    onClick={handleDemoLogin}
                    disabled={loading}
                    style={{ width: '100%', background: 'var(--accent)', color: '#000', border: 'none' }}
                >
                    try demo account
                </button>

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
