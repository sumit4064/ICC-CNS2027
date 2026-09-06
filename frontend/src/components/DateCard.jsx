import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const DateCard = ({ dateItem }) => {
  return (
    <div className={`glass-panel ${dateItem.highlight ? 'glass-panel-glow' : ''}`} style={{
      padding: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      borderLeft: dateItem.highlight ? '4px solid var(--accent-orange)' : '1px solid var(--glass-border)'
    }}>
      <div style={{
        background: dateItem.highlight ? 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)' : 'rgba(0, 50, 56, 0.7)',
        padding: '0.8rem 1.1rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        minWidth: '110px',
        boxShadow: dateItem.highlight ? '0 0 15px var(--accent-orange-glow)' : 'none'
      }}>
        <Calendar size={18} color="#FFF" style={{ marginBottom: '0.2rem' }} />
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
          {dateItem.displayDate || dateItem.date}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '1.2rem', color: '#FFF' }}>{dateItem.title}</h4>
          {dateItem.status && (
            <span className={`badge ${dateItem.status === 'Open' ? 'badge-emerald' : dateItem.status === 'Major Event' ? 'badge-orange' : 'badge-outline'}`}>
              {dateItem.status}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {dateItem.description || 'Important conference deadline and event schedule.'}
        </p>
      </div>
    </div>
  );
};
