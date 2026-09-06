import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'rgba(0, 36, 41, 0.7)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg, 16px)',
          backdropFilter: 'blur(12px)',
          margin: '1.5rem 0',
          color: '#FFF'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FFF' }}>
            {this.props.title || 'Committee Management could not be loaded.'}
          </h3>
          <p style={{ color: 'var(--text-muted, #94A3B8)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            {this.props.message || 'An unexpected rendering error occurred. You can retry loading this section.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="btn-primary-glow"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
