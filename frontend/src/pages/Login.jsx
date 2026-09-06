import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Lock, Mail, ShieldCheck, ArrowRight, User } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginRole, setLoginRole] = useState('admin'); // 'admin' or 'participant'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="page-header-section" style={{ paddingBottom: '1rem' }}>
        <div className="content-container">
          <span className="page-header-badge">Portal Authentication</span>
          <h1 className="page-header-title">Sign In to ICC-CNS</h1>
          <p className="page-header-subtitle">
            Access administrator dashboard, manage conference dates, speakers, registrations, and review paper submissions.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '480px' }}>
          <div className="form-wrapper">
            {/* Role Tab Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setEmail('');
                  setPassword('');
                }}
                className={`btn-card-action ${loginRole === 'admin' ? 'btn-primary-glow' : ''}`}
                style={{
                  justifyContent: 'center',
                  background: loginRole === 'admin' ? 'var(--accent-orange)' : 'rgba(0, 24, 28, 0.6)'
                }}
              >
                <ShieldCheck size={16} /> Admin Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRole('participant');
                  setEmail('');
                  setPassword('');
                }}
                className={`btn-card-action ${loginRole === 'participant' ? 'btn-primary-glow' : ''}`}
                style={{
                  justifyContent: 'center',
                  background: loginRole === 'participant' ? 'var(--accent-orange)' : 'rgba(0, 24, 28, 0.6)'
                }}
              >
                <User size={16} /> Author / Attendee
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <Mail size={15} color="var(--accent-orange)" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder={loginRole === 'admin' ? "admin@vignan.ac.in" : "author@university.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  autoComplete={loginRole === 'admin' ? "username" : "email"}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={15} color="var(--accent-orange)" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary-glow"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {submitting ? 'Authenticating...' : 'Sign In Now'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
