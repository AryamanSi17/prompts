import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, MessageCircle, User as UserIcon, Terminal, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API, { API_BASE, getMediaUrl } from '../utils/api';

import { useToast } from '../context/ToastContext';
import Image from '../components/Image';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const { addToast } = useToast();
    const observerTarget = useRef(null);

    useEffect(() => {
        document.title = 'feed | nano prompts.';
        loadFeed(1);
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, loadingMore, page]);

    const loadFeed = async (pageNum = page) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const data = await API.posts.getFeed(pageNum, 10);
            setPosts(prev => pageNum === 1 ? data.posts : [...prev, ...data.posts]);
            setHasMore(data.hasMore);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };


    const loadMorePosts = useCallback(() => {

        if (!hasMore || loading || loadingMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadFeed(nextPage);
    }, [page, hasMore, loading, loadingMore]);


    return (
        <main className="container" style={{ padding: '80px 20px', maxWidth: '700px', paddingBottom: '100px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <div>
                    <h1 className="ndot" style={{ fontSize: '32px', textTransform: 'lowercase', marginBottom: '4px' }}>discover</h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-dim)', textTransform: 'lowercase' }}>
                        ai creations from the community
                    </p>
                </div>
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
                        no posts yet. be the first to share your ai creation!
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
                                            src={getMediaUrl(post.userId.avatar)}
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

                            <div className="media-wrapper" style={{ width: '100%', background: '#000' }}>
                                {post.type === 'photo' ? (
                                    <Image
                                        src={getMediaUrl(post.mediaUrl)}
                                        alt={post.caption}

                                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <video
                                        src={getMediaUrl(post.mediaUrl)}
                                        controls
                                        style={{ width: '100%', maxHeight: '500px', background: '#000' }}
                                        poster={post.thumbnail ? getMediaUrl(post.thumbnail) : undefined}
                                    />

                                )}
                            </div>

                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
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
                                    <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                                        <Link
                                            to={`/profile/${post.userId.username}`}
                                            style={{ fontWeight: '600', textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {post.userId.username}
                                        </Link>{' '}
                                        {post.caption}
                                    </p>
                                )}

                                {(post.prompt || post.guide) && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                        {post.prompt && (
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '11px', marginBottom: '6px', textTransform: 'lowercase' }}>
                                                    <Terminal size={12} />
                                                    prompt
                                                </div>
                                                <p style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>{post.prompt}</p>
                                            </div>
                                        )}
                                        {post.guide && (
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '11px', marginBottom: '6px', textTransform: 'lowercase' }}>
                                                    <BookOpen size={12} />
                                                    guide
                                                </div>
                                                <p style={{ fontSize: '13px', lineHeight: '1.5' }}>{post.guide}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Infinite scroll trigger */}
                    <div
                        ref={observerTarget}
                        style={{
                            height: '20px',
                            margin: '20px 0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {loadingMore && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)', fontSize: '13px' }}>
                                <div className="spin" style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '2px solid var(--border)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%'
                                }}></div>
                                loading more...
                            </div>
                        )}
                        {!hasMore && posts.length > 0 && (
                            <p style={{ color: 'var(--text-dim)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                                you're all caught up! 🎉
                            </p>
                        )}
                    </div>
                </div>
            )}


            {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => {
                setShowUpload(false);
                setPage(1);
                loadFeed();
            }} />}

            <style>{`
                @media (max-width: 768px) {
                    .media-wrapper img, .media-wrapper video {
                        max-height: 48vh !important;
                    }
                }
            `}</style>
        </main>
    );
}

function UploadModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [caption, setCaption] = useState('');
    const [prompt, setPrompt] = useState('');
    const [guide, setGuide] = useState('');
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
        formData.append('prompt', prompt);
        formData.append('guide', guide);

        try {
            await API.posts.create(formData);
            addToast('Creation shared successfully!', 'success');
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
                <h2 className="ndot" style={{ fontSize: '24px', marginBottom: '24px' }}>share creation</h2>

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
                            upload AI video or result
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
                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                            {file.type.startsWith('image/') ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                            ) : (
                                <video src={preview} controls style={{ width: '100%', maxHeight: '300px' }} />
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'lowercase' }}>caption</label>
                                <textarea
                                    placeholder="what is this creation about?"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    style={{ minHeight: '60px', resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'lowercase' }}>AI prompt</label>
                                <textarea
                                    placeholder="paste the prompt used to generate this..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    style={{ minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'lowercase' }}>creation guide</label>
                                <textarea
                                    placeholder="how did you make this? (tools, settings, tips)"
                                    value={guide}
                                    onChange={(e) => setGuide(e.target.value)}
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>
                        </div>

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
                                {uploading ? 'uploading...' : 'share'}
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
