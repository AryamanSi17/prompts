import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User as UserIcon, Grid, Settings } from 'lucide-react';
import API, { getMediaUrl } from '../utils/api';

import { useToast } from '../context/ToastContext';
import Image from '../components/Image';

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const followTimeoutRef = useRef(null);

    useEffect(() => {
        loadProfile();
        loadPosts();
    }, [username]);

    const loadProfile = async () => {
        try {
            const data = await API.users.getProfile(username);
            setProfile(data.user);
            setFollowing(data.user.isFollowing);
            document.title = `@${username} | nano prompts.`;
        } catch (err) {
            addToast(err.message, 'error');
            navigate('/feed');
        }
    };

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await API.posts.getUserPosts(username);
            setPosts(data.posts);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = () => {
        if (!profile) return;

        // Toggle UI state immediately
        const newFollowingState = !following;
        setFollowing(newFollowingState);
        setProfile(prev => ({
            ...prev,
            followersCount: newFollowingState ? (prev.followersCount + 1) : (prev.followersCount - 1)
        }));

        // Clear existing sync timeout
        if (followTimeoutRef.current) {
            clearTimeout(followTimeoutRef.current);
        }

        // Queue the update (5 seconds delay)
        followTimeoutRef.current = setTimeout(async () => {
            try {
                if (newFollowingState) {
                    await API.users.follow(profile._id);
                    addToast('Followed', 'success');
                } else {
                    await API.users.unfollow(profile._id);
                    addToast('Unfollowed', 'success');
                }
            } catch (err) {
                addToast('Sync failed: ' + err.message, 'error');
                // Optional: Revert UI state on error
            }
        }, 5000);
    };

    if (!profile) {
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

    const isOwnProfile = profile.isOwnProfile;

    return (
        <main className="container" style={{ padding: '80px 20px', maxWidth: '1000px' }}>
            <div className="glass" style={{ padding: '40px 20px', marginBottom: '40px' }}>
                <div style={{
                    display: 'flex',
                    gap: '32px',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: profile.avatar ? 'none' : 'var(--surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        {profile.avatar ? (
                            <img
                                src={getMediaUrl(profile.avatar)}
                                alt={profile.username}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <UserIcon size={48} style={{ opacity: 0.3 }} />
                        )}
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <h1 style={{ fontSize: '28px', fontWeight: '600' }}>
                                {profile.displayName || profile.username}
                            </h1>
                            {isOwnProfile ? (
                                <button
                                    onClick={() => navigate('/settings')}
                                    style={{
                                        padding: '8px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Settings size={16} />
                                    edit
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className={following ? '' : 'primary'}
                                    style={{ padding: '8px 24px' }}
                                >
                                    {following ? 'following' : 'follow'}
                                </button>
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '32px',
                            marginBottom: '16px'
                        }}>
                            <div>
                                <span style={{ fontWeight: '600', marginRight: '4px' }}>
                                    {profile.postsCount || 0}
                                </span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>posts</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: '600', marginRight: '4px' }}>
                                    {profile.followersCount || 0}
                                </span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>followers</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: '600', marginRight: '4px' }}>
                                    {profile.followingCount || 0}
                                </span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>following</span>
                            </div>
                        </div>

                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-dim)',
                            marginBottom: '8px'
                        }}>
                            @{profile.username}
                        </p>

                        {profile.bio && (
                            <p style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '12px' }}>
                                {profile.bio}
                            </p>
                        )}

                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '14px',
                                    color: 'var(--accent)',
                                    marginTop: '8px',
                                    display: 'block'
                                }}
                            >
                                {profile.website}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div style={{
                borderBottom: '1px solid var(--border)',
                marginBottom: '20px',
                display: 'flex',
                gap: '40px',
                justifyContent: 'center'
            }}>
                <button style={{
                    background: 'none',
                    border: 'none',
                    padding: '16px 0',
                    borderBottom: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600'
                }}>
                    <Grid size={16} />
                    posts
                </button>
            </div>

            {loading ? (
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
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Grid size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-dim)' }}>No posts yet</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '4px'
                }}>
                    {posts.map(post => (
                        <div
                            key={post._id}
                            style={{
                                position: 'relative',
                                paddingBottom: '100%',
                                background: '#000',
                                cursor: 'pointer',
                                overflow: 'hidden'
                            }}
                        >
                            {post.type === 'photo' ? (
                                <Image
                                    src={getMediaUrl(post.mediaUrl)}
                                    alt={post.caption}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <video
                                    src={getMediaUrl(post.mediaUrl)}
                                    poster={post.thumbnail ? getMediaUrl(post.thumbnail) : undefined}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Profile;
