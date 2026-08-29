import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const StatCards = ({ incidents }) => {
  const total = incidents.length;
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
  const pending = incidents.filter(i => i.status === 'REPORTED').length;

  return (
    <div className="stat-cards-container">
      <div className="stat-card glass-panel">
        <div className="stat-card-title">
          <AlertCircle size={16} color="var(--accent-color)" />
          Total Reports
        </div>
        <div className="stat-card-value" style={{ color: 'var(--text-primary)' }}>
          {total}
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-card-title">
          <AlertTriangle size={16} color="var(--severity-critical)" />
          Critical Incidents
        </div>
        <div className="stat-card-value" style={{ color: 'var(--severity-critical)' }}>
          {critical}
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-card-title">
          <Clock size={16} color="var(--status-reported)" />
          Pending Action
        </div>
        <div className="stat-card-value" style={{ color: 'var(--status-reported)' }}>
          {pending}
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-card-title">
          <CheckCircle size={16} color="var(--status-resolved)" />
          Resolved
        </div>
        <div className="stat-card-value" style={{ color: 'var(--status-resolved)' }}>
          {resolved}
        </div>
      </div>
    </div>
  );
};

export default StatCards;
