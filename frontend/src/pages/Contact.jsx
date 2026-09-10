import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, Building } from 'lucide-react';

export const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setSentSuccess(true);
        showToast('Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Get in Touch</span>
          <h1 className="page-header-title">Contact Secretariat</h1>
          <p className="page-header-subtitle">
            Department of Computer Science & Engineering, Vignan's Foundation for Science, Technology and Research (VFSTR), Vadlamudi, Guntur, AP, India.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container">
          <div className="contact-layout-grid">
            {/* Contact Form */}
            <div className="form-wrapper">
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} color="var(--primary-cyan)" /> Send a Direct Message
              </h3>

              {sentSuccess ? (
                <div style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--accent-emerald)'
                }}>
                  <CheckCircle2 size={42} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Message Dispatched</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    Thank you! The ICCCNS-2027 Organizing Secretariat at Vignan University will respond to your registered email shortly.
                  </p>
                  <button onClick={() => setSentSuccess(false)} className="btn-secondary-glass">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Your Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Dr. Jane Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Your Email <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="jane.doe@university.edu"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject / Inquiry Topic</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Query regarding ICCCNS-2027 Paper Submission"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Message Details <span className="required-star">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      placeholder="Please write your detailed inquiry or question here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={5}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-glow"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {submitting ? 'Sending Message...' : 'Send Message to Secretariat'}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Secretariat Information Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '1.2rem' }}>Official University Contacts</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 163, 199, 0.12)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Official Email</div>
                      <div style={{ color: 'var(--primary-navy)', fontWeight: 600, fontSize: '0.95rem' }}>info@icccns.in</div>
                      
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 163, 199, 0.12)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>CSE Department Phone</div>
                      <div style={{ color: 'var(--primary-navy)', fontWeight: 600, fontSize: '0.95rem' }}>+91-863-237 11 26</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 163, 199, 0.12)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Campus Address</div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Department of CSE, School of Computing and Informatics, Vignan's Foundation for Science, Technology and Research (VFSTR), Vadlamudi, Guntur-522213, Andhra Pradesh, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface-white)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Clock size={16} color="var(--primary-cyan)" />
                  <span style={{ color: 'var(--primary-navy)', fontWeight: 600, fontSize: '0.95rem' }}>Operating Hours</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Monday to Saturday: 09:00 AM – 05:00 PM IST<br />
                  Online submission and registration portals are available 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
