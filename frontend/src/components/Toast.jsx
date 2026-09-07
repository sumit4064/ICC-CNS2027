import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 3000,
          background: toast.type === 'error' ? 'rgba(185, 28, 28, 0.95)' : 'var(--surface-white)',
          border: `1px solid ${toast.type === 'error' ? '#EF4444' : 'var(--primary-cyan)'}`,
          boxShadow: '0 10px 30px rgba(11, 45, 107, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: toast.type === 'error' ? '#FFF' : 'var(--primary-navy)',
          backdropFilter: 'blur(16px)',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' ? (
            <AlertCircle size={20} color="#EF4444" />
          ) : (
            <CheckCircle size={20} color="var(--primary-cyan)" />
          )}
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
