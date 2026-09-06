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
          background: toast.type === 'error' ? 'rgba(127, 29, 29, 0.95)' : 'rgba(0, 36, 41, 0.95)',
          border: `1px solid ${toast.type === 'error' ? '#EF4444' : 'var(--accent-orange)'}`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: '#FFF',
          backdropFilter: 'blur(16px)',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' ? (
            <AlertCircle size={20} color="#EF4444" />
          ) : (
            <CheckCircle size={20} color="var(--accent-orange)" />
          )}
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
