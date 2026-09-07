import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const DateCard = ({ dateItem }) => {
  return (
    <div className={`glass-panel ${dateItem.highlight ? 'glass-panel-glow' : ''}`} style={{
      padding: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      borderLeft: dateItem.highlight ? '4px solid var(--primary-cyan)' : '1px solid var(--border-subtle)'
    }}>
      <div style={{
        background: dateItem.highlight ? 'linear-gradient(135deg, var(--primary-navy) 0%, #154699 100%)' : 'rgba(0, 163, 199, 0.1)',
        padding: '0.8rem 1.1rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        minWidth: '110px',
        boxShadow: dateItem.highlight ? '0 4px 15px rgba(11, 45, 107, 0.2)' : 'none'
      }}>
        <Calendar size={18} color={dateItem.highlight ? "#FFF" : "var(--primary-cyan)"} style={{ marginBottom: '0.2rem' }} />
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: dateItem.highlight ? '#FFF' : 'var(--primary-navy)' }}>
          {dateItem.displayDate || dateItem.date}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>{dateItem.title}</h4>
          {dateItem.status && (
            <span className={`badge ${dateItem.status === 'Open' ? 'badge-emerald' : dateItem.status === 'Major Event' ? 'badge-cyan' : 'badge-outline'}`}>
              {dateItem.status}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {dateItem.description || 'Important conference deadline and event schedule.'}
        </p>
      </div>
    </div>
  );
};
