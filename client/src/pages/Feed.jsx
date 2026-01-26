import React, { useState, useEffect } from 'react';
import { Upload, Heart, MessageCircle, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import Image from '../components/Image';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        document.title = 'feed | nano prompts.';
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const data = await API.posts.getFeed(page, 20);
            setPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
            setHasMore(data.hasMore);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const data = await API.posts.like(postId);
            setPosts(posts.map(p =>
                p._id === postId
                    ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount }
                    : p
            ));
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
        setTimeout(loadFeed, 100);
    };

    return (
        <main className="container" style={{ padding: '80px 20px', maxWidth: '700px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <h1 className="ndot" style={{ fontSize: '32px', textTransform: 'lowercase' }}>feed</h1>
                <button
                    onClick={() => setShowUpload(true)}
                    className="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                >
                    <Upload size={18} />
                    create
                </button>
            </div>

            {loading && page === 1 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spin" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid var(--border)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        margin: '0 auto'
                    }}></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="glass" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <UserIcon size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                        no posts yet. follow users or create your first post!
                    </p>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="primary"
                        style={{ marginTop: '20px' }}
                    >
                        create post
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {posts.map(post => (
                        <div key={post._id} className="glass" style={{ overflow: 'hidden' }}>
                            <Link
                                to={`/profile/${post.userId.username}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: post.userId.avatar ? 'none' : 'var(--surface-alt)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {post.userId.avatar ? (
                                        <img
                                            src={`http://localhost:5000${post.userId.avatar}`}
                                            alt={post.userId.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <UserIcon size={20} style={{ opacity: 0.5 }} />
                                    )}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {post.userId.displayName || post.userId.username}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                        @{post.userId.username}
                                    </p>
                                </div>
                            </Link>

                            {post.type === 'photo' ? (
                                <Image
                                    src={`http://localhost:5000${post.mediaUrl}`}
                                    alt={post.caption}
                                    style={{ width: '100%', height: 'auto', maxHeight: '600px' }}
                                />
                            ) : (
                                <video
                                    src={`http://localhost:5000${post.mediaUrl}`}
                                    controls
                                    style={{ width: '100%', maxHeight: '600px', background: '#000' }}
                                    poster={post.thumbnail ? `http://localhost:5000${post.thumbnail}` : undefined}
                                />
                            )}

                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: post.isLiked ? '#ff0000' : 'inherit',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Heart
                                            size={20}
                                            fill={post.isLiked ? '#ff0000' : 'none'}
                                        />
                                        <span style={{ fontSize: '14px' }}>{post.likesCount || 0}</span>
                                    </button>
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <MessageCircle size={20} />
                                        <span style={{ fontSize: '14px' }}>{post.commentsCount || 0}</span>
                                    </button>
                                </div>

                                {post.caption && (
                                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                        <Link
                                            to={`/profile/${post.userId.username}`}
                                            style={{ fontWeight: '600', textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {post.userId.username}
                                        </Link>{' '}
                                        {post.caption}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="glass"
                            style={{ padding: '16px', width: '100%' }}
                        >
                            {loading ? 'loading...' : 'load more'}
                        </button>
                    )}
                </div>
            )}

            {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => {
                setShowUpload(false);
                setPage(1);
                loadFeed();
            }} />}
        </main>
    );
}

function UploadModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const { addToast } = useToast();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const maxSize = 100 * 1024 * 1024;
        if (selected.size > maxSize) {
            addToast('File too large. Max 100MB', 'error');
            return;
        }

        setFile(selected);
        const url = URL.createObjectURL(selected);
        setPreview(url);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('media', file);
        formData.append('caption', caption);

        try {
            await API.posts.create(formData);
            addToast('Post created successfully!', 'success');
            onSuccess();
        } catch (err) {
            addToast(err.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div className="glass" style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '40px'
            }} onClick={(e) => e.stopPropagation()}>
                <h2 className="ndot" style={{ fontSize: '24px', marginBottom: '24px' }}>create post</h2>

                {!file ? (
                    <label style={{
                        display: 'block',
                        padding: '60px 20px',
                        border: '2px dashed var(--border)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}>
                        <Upload size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                            click to upload photo or video
                        </p>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                ) : (
                    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {file.type.startsWith('image/') ? (
                            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '12px' }} />
                        ) : (
                            <video src={preview} controls style={{ width: '100%', borderRadius: '12px' }} />
                        )}

                        <textarea
                            placeholder="write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            style={{ minHeight: '80px', resize: 'vertical' }}
                        />

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setPreview('');
                                }}
                                style={{ flex: 1 }}
                            >
                                change
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="primary"
                                style={{ flex: 1 }}
                            >
                                {uploading ? 'uploading...' : 'post'}
                            </button>
                        </div>
                    </form>
                )}

                <button
                    onClick={onClose}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    cancel
                </button>
            </div>
        </div>
    );
}

export default Feed;
