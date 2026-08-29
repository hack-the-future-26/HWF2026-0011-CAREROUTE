import React, { useState } from 'react';
import { X, MapPin, ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const RESOLUTION_REASONS = [
  "Suspect Arrested",
  "Unit Dispatched - Situation Controlled",
  "False Alarm",
  "Referred to Higher Authority"
];

const IncidentModal = ({ incident, onClose, onUpdateStatus }) => {
  const [showResolutionPrompt, setShowResolutionPrompt] = useState(false);
  const [resolutionReason, setResolutionReason] = useState(RESOLUTION_REASONS[0]);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!incident) return null;

  const date = new Date(incident.createdAt);
  const timeString = date.toLocaleString();

  const handleDispatch = async () => {
    setIsUpdating(true);
    await onUpdateStatus(incident._id, 'DISPATCHED');
    setIsUpdating(false);
  };

  const handleResolveSubmit = async () => {
    setIsUpdating(true);
    await onUpdateStatus(incident._id, 'RESOLVED', resolutionReason);
    setShowResolutionPrompt(false);
    setIsUpdating(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-title">
            <ShieldAlert color="var(--accent-color)" />
            {incident.crimeType}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className={`severity-badge severity-${incident.severity}`}>
              {incident.severity} Severity
            </span>
            <span className={`status-badge status-${incident.status}`}>
              {incident.status}
            </span>
          </div>
        </div>

        <div className="modal-body">
          <div className="info-group">
            <span className="info-label">Location & Time</span>
            <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--text-secondary)" /> {incident.location}
              <span style={{ color: 'var(--panel-border)', margin: '0 8px' }}>|</span>
              <Clock size={16} color="var(--text-secondary)" /> {timeString}
            </div>
          </div>

          <div className="info-group">
            <span className="info-label">Summary (English)</span>
            <div className="info-value">{incident.summary}</div>
          </div>

          <div className="info-group">
            <span className="info-label">Summary (Telugu)</span>
            <div className="info-value telugu-text">{incident.teluguSummary}</div>
          </div>

          <div className="info-group">
            <span className="info-label">Suggested Action</span>
            <div className="info-value" style={{ color: 'var(--accent-color)' }}>
              {incident.suggestedAction}
            </div>
          </div>
          
          {incident.resolutionReason && (
            <div className="info-group">
              <span className="info-label">Resolution Reason</span>
              <div className="info-value" style={{ color: 'var(--status-resolved)' }}>
                {incident.resolutionReason}
              </div>
            </div>
          )}
        </div>

        {!showResolutionPrompt ? (
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Acknowledge
            </button>
            
            {incident.status !== 'DISPATCHED' && incident.status !== 'RESOLVED' && (
              <button 
                className="btn btn-dispatch" 
                onClick={handleDispatch}
                disabled={isUpdating}
              >
                <AlertTriangle size={18} />
                Dispatch Unit
              </button>
            )}

            {incident.status !== 'RESOLVED' && (
              <button 
                className="btn btn-resolve" 
                onClick={() => setShowResolutionPrompt(true)}
                disabled={isUpdating}
              >
                <CheckCircle size={18} />
                Mark Resolved
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ marginTop: '24px', padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Select Resolution Reason</h3>
            <select 
              className="resolution-select"
              value={resolutionReason} 
              onChange={(e) => setResolutionReason(e.target.value)}
            >
              {RESOLUTION_REASONS.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowResolutionPrompt(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-resolve" 
                onClick={handleResolveSubmit}
                disabled={isUpdating}
              >
                Submit Resolution
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentModal;
