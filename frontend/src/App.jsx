import React, { useState, useEffect } from 'react';
import { socket } from './services/socket';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import StatCards from './components/StatCards';
import IncidentModal from './components/IncidentModal';
import { ShieldAlert, Activity } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetch(`${API_URL}/incidents`)
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Error fetching incidents:", err));

    // Socket listeners
    socket.on('newIncident', (incident) => {
      setIncidents(prev => [incident, ...prev]);
    });

    socket.on('incidentUpdated', (updatedIncident) => {
      console.log('incidentUpdated received:', updatedIncident); setIncidents(prev => prev.map(inc => 
        inc._id === updatedIncident._id ? updatedIncident : inc
      ));
      
      // Update modal if currently viewing it
      setSelectedIncident(prev => 
        prev && prev._id === updatedIncident._id ? updatedIncident : prev
      );
    });

    return () => {
      socket.off('newIncident');
      socket.off('incidentUpdated');
    };
  }, []);

  const handleStatusUpdate = async (id, status, resolutionReason = null) => {
    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionReason })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
      
      const updatedIncident = await response.json();
      
      // Update local state immediately without waiting for websocket
      setIncidents(prev => prev.map(inc => 
        inc._id === updatedIncident._id ? updatedIncident : inc
      ));
      
      // Update selected incident if we're currently viewing it
      setSelectedIncident(prev => 
        prev && prev._id === updatedIncident._id ? updatedIncident : prev
      );
    } catch (err) {
      console.error("Error updating incident:", err);
      alert("Failed to update incident status. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <ShieldAlert color="#3b82f6" size={28} />
          Citizen<span>Shield</span>
        </div>
        <div className="live-badge">
          <Activity size={16} />
          <div className="pulse-dot"></div>
          LIVE SYSTEM
        </div>
      </header>

      <div className="main-content">
        <Sidebar 
          incidents={incidents} 
          onSelectIncident={setSelectedIncident}
          selectedId={selectedIncident?._id}
        />
        
        <div className="dashboard-content">
          <StatCards incidents={incidents} />
          
          <div className="map-container">
            <Map 
              incidents={incidents} 
              onMarkerClick={setSelectedIncident}
              selectedIncident={selectedIncident}
            />
          </div>
        </div>
      </div>

      {selectedIncident && (
        <IncidentModal 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default App;
