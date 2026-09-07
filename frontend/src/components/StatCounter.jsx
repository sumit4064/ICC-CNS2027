import React from 'react';

export const StatCounter = ({ value, label, icon }) => {
  return (
    <div className="hero-stat-item">
      {icon && <div className="stat-icon-wrap">{icon}</div>}
      <div className="stat-text-wrap">
        <span className="stat-number">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};
