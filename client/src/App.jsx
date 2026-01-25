import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Library from './pages/Library';
import TextPrompts from './pages/TextPrompts';
import PromptBuilder from './pages/PromptBuilder';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const PagePlaceholder = ({ title }) => (
    <div className="container" style={{ padding: '100px 0', minHeight: '60vh' }}>
        <h1 className="ndot" style={{ fontSize: '48px', marginBottom: '24px' }}>{title.toUpperCase()}.</h1>
        <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
            This is a draft of the {title} page for the nano prompts. app. Modular design allows for quick expansion of content here.
        </p>
    </div>
);

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <Router>
            <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar user={user} setUser={setUser} />
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/auth" element={!user ? <Auth setUser={setUser} /> : <Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
                        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/text-prompts" element={<TextPrompts />} />
                        <Route path="/builder" element={<PromptBuilder />} />
                        <Route path="/privacy" element={<PagePlaceholder title="privacy" />} />
                        <Route path="/contact" element={<PagePlaceholder title="contact" />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
