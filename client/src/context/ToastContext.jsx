import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                pointerEvents: 'none'
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="glass fade-in"
                        style={{
                            padding: '12px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: `1px solid ${toast.type === 'error' ? '#ff4444' : toast.type === 'info' ? '#3b82f6' : 'var(--accent)'}`,
                            background: 'rgba(0,0,0,0.9)',
                            backdropFilter: 'blur(20px)',
                            pointerEvents: 'auto',
                            minWidth: '300px',
                            justifyContent: 'space-between',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {toast.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--accent)' }} />}
                            {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#ff4444' }} />}
                            {toast.type === 'info' && <Info size={18} style={{ color: '#3b82f6' }} />}
                            <span style={{ fontSize: '14px', textTransform: 'lowercase', fontWeight: 500 }}>{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', padding: '4px', cursor: 'pointer', display: 'flex' }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
