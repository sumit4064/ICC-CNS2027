import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  CheckCircle2,
  UserCheck,
  CreditCard,
  Building,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Printer,
  ArrowRight
} from 'lucide-react';

export const Registration = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'India',
    institution: '',
    participantType: 'Faculty / Academician',
    mode: 'Offline (In-person)',
    paperId: '',
    paperTitle: '',
    accompanyingPersons: 0,
    dietaryRequirement: 'Standard Veg',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getRegistrationCategories();
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, participantType: res.data[0].type }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const defaultTiers = [
    {
      type: 'Student / Research Scholar',
      inr: 'INR 4,000',
      usd: 'USD 150',
      desc: 'Valid student/scholar institutional identity proof required at registration.'
    },
    {
      type: 'Faculty / Academician',
      inr: 'INR 6,500',
      usd: 'USD 220',
      desc: 'Full access to all technical sessions, conference kit, lunch & banquet.'
    },
    {
      type: 'Industry Professional',
      inr: 'INR 9,000',
      usd: 'USD 300',
      desc: 'Access to conference tracks, industry panels, exhibition & networking.'
    },
    {
      type: 'International Participant',
      inr: 'USD 250',
      usd: 'USD 250',
      desc: 'International author/attendee registration for in-person or virtual presentation.'
    },
    {
      type: 'Attendee / Listener Only',
      inr: 'INR 3,000',
      usd: 'USD 100',
      desc: 'Session participation & official digital certificate of conference attendance.'
    }
  ];

  const activeTiers = categories.length > 0 ? categories : defaultTiers;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getEstimatedFee = () => {
    const isIndia = formData.country.trim().toLowerCase() === 'india';
    const tier = activeTiers.find((t) => t.type === formData.participantType);
    return isIndia ? tier?.inr || 'INR 6,500' : tier?.usd || 'USD 220';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.institution || !formData.country) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitRegistration(formData);
      if (res.success) {
        setConfirmedReg(res.data);
        showToast('Registration confirmed successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to process registration', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Join ICC-CNS 2027</span>
          <h1 className="page-header-title">Conference Registration</h1>
          <p className="page-header-subtitle">
            Hosted by Department of Computer Science & Engineering, Vignan's Foundation for Science, Technology and Research (VFSTR).
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '1000px' }}>
          {confirmedReg ? (
            /* Registration Pass / Confirmation Receipt */
            <div className="form-wrapper" style={{ textAlign: 'center', padding: '3.5rem 2.5rem' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <CheckCircle2 size={40} />
              </div>

              <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>
                Registration Confirmed
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginBottom: '0.4rem' }}>
                Welcome to ICC-CNS 2027!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your registration pass has been generated. Confirmation has been sent to <strong>{confirmedReg.email}</strong>.
              </p>

              {/* Conference Pass Card */}
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-navy) 0%, #154699 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid rgba(0, 163, 199, 0.4)',
                maxWidth: '650px',
                margin: '0 auto 2.5rem',
                textAlign: 'left',
                boxShadow: 'var(--shadow-lg), 0 0 25px rgba(11, 45, 107, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ background: '#FFF', padding: '3px 6px', borderRadius: '4px' }}>
                      <img src="/logos/vignan_official_logo.svg" alt="Vignan Logo" style={{ height: '24px', maxWidth: '100px' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#FFF', fontSize: '1.2rem' }}>
                      ICC-<span style={{ color: 'var(--primary-cyan)' }}>CNS</span> 2027 PASS
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-cyan)', fontWeight: 800, fontSize: '1.2rem' }}>
                    {confirmedReg.id}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>Participant Name</span>
                    <div style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 700 }}>{confirmedReg.fullName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>Category</span>
                    <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>{confirmedReg.participantType}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.2rem', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>Institution</span>
                    <div style={{ color: '#FFF' }}>{confirmedReg.institution} ({confirmedReg.country})</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>Mode</span>
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{confirmedReg.mode}</div>
                  </div>
                </div>

                {confirmedReg.paperId && confirmedReg.paperId !== 'N/A (Attendee Only)' && (
                  <div style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 163, 199, 0.15)', border: '1px solid rgba(0, 163, 199, 0.3)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 700 }}>LINKED RESEARCH PAPER</div>
                    <div style={{ fontSize: '0.92rem', color: '#FFF', fontWeight: 600 }}>[{confirmedReg.paperId}] {confirmedReg.paperTitle}</div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Amount:</span>
                    <span style={{ marginLeft: '0.5rem', color: 'var(--primary-cyan)', fontWeight: 800, fontSize: '1.1rem' }}>{confirmedReg.amountPaid}</span>
                  </div>
                  <span className="badge badge-emerald">Status: Confirmed</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary-glass"
                >
                  <Printer size={16} /> Print Confirmation Pass
                </button>
                <button
                  onClick={() => setConfirmedReg(null)}
                  className="btn-primary-glow"
                >
                  <span>New Registration</span>
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                {/* 1. Category Selection */}
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
                  1. Select Participant Category
                </h3>

                <div className="tier-selector-grid">
                  {activeTiers.map((tier) => (
                    <div
                      key={tier.type}
                      className={`tier-card ${formData.participantType === tier.type ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, participantType: tier.type })}
                    >
                      <div className="tier-name">{tier.type}</div>
                      <div className="tier-price">
                        {formData.country.trim().toLowerCase() === 'india' ? tier.inr : tier.usd}
                      </div>
                      <div className="tier-desc">{tier.desc}</div>
                    </div>
                  ))}
                </div>

                {/* 2. Personal Information */}
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '2rem 0 1rem' }}>
                  2. Personal & Institutional Information
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name (with Title) <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Prof. / Dr. / Mr. / Ms. John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="author@university.edu"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Country <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      placeholder="India / USA / Germany..."
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Participation Mode <span className="required-star">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Offline (In-person)">Offline (In-person Vadlamudi Campus)</option>
                      <option value="Online (Virtual)">Online (Virtual Live Stream)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Institution / University / Organization <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    placeholder="e.g. Department of CSE, University..."
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                {/* 3. Paper Details (If presenting) */}
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', margin: '2rem 0 1rem' }}>
                  3. Research Paper Information (Optional for non-authors)
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Accepted Paper ID</label>
                    <input
                      type="text"
                      name="paperId"
                      placeholder="e.g. ICC-CNS-2027-001 (Leave blank if attendee)"
                      value={formData.paperId}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Paper Title</label>
                    <input
                      type="text"
                      name="paperTitle"
                      placeholder="Title of your accepted research manuscript"
                      value={formData.paperTitle}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Pricing Summary Banner */}
                <div style={{
                  margin: '2rem 0',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--background-light)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Registration Fee:</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                      {getEstimatedFee()}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px' }}>
                    Includes technical session passes, conference kit, certificate, and publishing fee indexation.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-glow"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                >
                  {submitting ? 'Processing Registration...' : 'Complete Conference Registration'}
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
