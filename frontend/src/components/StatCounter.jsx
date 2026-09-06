import React from 'react';

export const StatCounter = ({ value, label }) => {
  return (
    <div className="hero-stat-item">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};
