import React from 'react';
import { MapPin } from 'lucide-react';

const Sidebar = ({ incidents, onSelectIncident, selectedId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Live Incidents</h2>
      </div>
      <div className="incident-list">
        {incidents.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            No incidents reported yet.
          </div>
        ) : (
          incidents.map((incident) => {
            const date = new Date(incident.createdAt);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const isSelected = selectedId === incident._id;
            
            return (
              <div 
                key={incident._id} 
                className={`incident-item ${isSelected ? 'glass-panel' : ''}`}
                style={isSelected ? { borderColor: 'var(--accent-color)', background: 'rgba(59, 130, 246, 0.1)' } : {}}
                onClick={() => onSelectIncident(incident)}
              >
                <div className="incident-header">
                  <span className="incident-type">{incident.crimeType}</span>
                  <span className="incident-time">{timeString}</span>
                </div>
                
                <div className="incident-summary">
                  {incident.summary}
                </div>
                
                <div className="incident-footer">
                  <div className="location">
                    <MapPin size={12} />
                    {incident.location}
                  </div>
                  <div className={`status-badge status-${incident.status}`}>
                    {incident.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
