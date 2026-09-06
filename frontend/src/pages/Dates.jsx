import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DateCard } from '../components/DateCard';
import { Calendar, Clock, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dates = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await api.getDates();
        if (res.success) setDates(res.data);
      } catch (err) {
        console.error('Failed to load dates:', err);
      }
    };
    fetchDates();
  }, []);

  return (
    <div className="dates-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Milestones & Deadlines</span>
          <h1 className="page-header-title">Important Dates</h1>
          <p className="page-header-subtitle">
            All deadlines are set for 23:59 IST (Indian Standard Time) on the respective calendar dates.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {dates.map((dateItem) => (
              <DateCard key={dateItem.id} dateItem={dateItem} />
            ))}
          </div>

          {/* Callout box */}
          <div className="glass-panel" style={{
            padding: '2.5rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 216, 0.12) 0%, rgba(0, 36, 41, 0.8) 70%)'
          }}>
            <Bell size={32} color="var(--accent-orange)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.8rem' }}>
              Don't Miss the Paper Submission Deadline!
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.8rem', maxWidth: '600px', margin: '0 auto 1.8rem' }}>
              Final manuscript submission portals are actively accepting full papers, short papers, and doctoral symposia submissions.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
              <Link to="/submission" className="btn-primary-glow">
                <span>Submit Paper Online</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/registration" className="btn-secondary-glass">
                <span>Register Attendance</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
