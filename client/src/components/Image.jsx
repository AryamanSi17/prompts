import React, { useState } from 'react';

/**
 * Custom Image component that handles:
 * 1. Skeleton loading state with smooth transitions
 * 2. Error handling with fallback
 */
const Image = ({ src, alt, style, className, loading = "lazy" }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div
            className={`image-container ${className || ''}`}
            style={{
                ...style,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: style?.borderRadius || 'inherit'
            }}
        >
            {(!isLoaded || error) && (
                <div
                    className="skeleton"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                    }}
                />
            )}

            <img
                src={src}
                alt={alt}
                loading={loading}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setIsLoaded(true);
                }}
                style={{
                    width: '100%',
                    height: (style?.objectFit === 'contain' || style?.height === 'auto') ? 'auto' : '100%',
                    objectFit: style?.objectFit || 'cover',
                    opacity: isLoaded && !error ? 1 : 0,
                    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2
                }}
            />


            {error && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-dim)',
                    fontSize: '11px',
                    zIndex: 3,
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <span style={{ marginBottom: '8px', fontSize: '20px' }}>⚠️</span>
                    failed to load image
                </div>
            )}
        </div>
    );
};

export default Image;


