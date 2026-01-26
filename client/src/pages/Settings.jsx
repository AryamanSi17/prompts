import React, { useState, useEffect } from 'react';
import { User as UserIcon, Camera, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../utils/api';


function Settings() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'settings | nano prompts.';
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            setDisplayName(userData.displayName || '');
            setBio(userData.bio || '');
            setWebsite(userData.website || '');
            setAvatar(userData.avatar || '');
        }
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await API.users.updateProfile({
                displayName,
                bio,
                website
            });

            const updatedUser = { ...user, ...data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            addToast('Profile updated successfully', 'success');
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            addToast('Image too large. Max 5MB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const data = await API.users.updateAvatar(formData);
            const updatedUser = { ...user, avatar: data.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setAvatar(data.avatar);
            addToast('Avatar updated successfully', 'success');
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        API.setToken(null);
        navigate('/auth');
        addToast('Logged out successfully', 'success');
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div className="spin" style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    margin: '0 auto'
                }}></div>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: '80px 20px', maxWidth: '700px' }}>
            <h1 className="ndot" style={{ fontSize: '40px', marginBottom: '8px', textTransform: 'lowercase' }}>settings</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '40px', textTransform: 'lowercase' }}>
                manage your profile and account settings
            </p>

            <div className="glass" style={{ padding: '40px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: avatar ? 'none' : 'var(--surface-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            margin: '0 auto'
                        }}>
                            {avatar ? (
                                <img
                                    src={getMediaUrl(avatar)}
                                    alt={user.username}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                            ) : (
                                <UserIcon size={48} style={{ opacity: 0.3 }} />
                            )}
                        </div>
                        <label style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '3px solid #000'
                        }}>
                            <Camera size={18} style={{ color: '#000' }} />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-dim)' }}>
                        @{user.username}
                    </p>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', textTransform: 'lowercase' }}>
                            display name
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', textTransform: 'lowercase' }}>
                            bio
                        </label>
                        <textarea
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={300}
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                            {bio.length}/300
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', textTransform: 'lowercase' }}>
                            website
                        </label>
                        <input
                            type="url"
                            placeholder="https://your-website.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary"
                        style={{
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Save size={18} />
                        {loading ? 'saving...' : 'save changes'}
                    </button>
                </form>
            </div>

            <div className="glass" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', textTransform: 'lowercase' }}>account</h3>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        background: 'transparent'
                    }}
                >
                    logout
                </button>
            </div>
        </div>
    );
}

export default Settings;
