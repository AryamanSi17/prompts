import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Library from './pages/Library';
import TextPrompts from './pages/TextPrompts';
import PromptBuilder from './pages/PromptBuilder';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import { ToastProvider } from './context/ToastContext';
import API from './utils/api';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            API.setToken(token);
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <ToastProvider>
            <Router>
                <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar user={user} setUser={setUser} />
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/auth" element={!user ? <Auth setUser={setUser} /> : <Navigate to="/feed" />} />
                            <Route path="/feed" element={user ? <Feed /> : <Navigate to="/auth" />} />
                            <Route path="/profile/:username" element={<Profile />} />
                            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
                            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/text-prompts" element={<TextPrompts />} />
                            <Route path="/builder" element={<PromptBuilder />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </ToastProvider>
    );
}

export default App;
