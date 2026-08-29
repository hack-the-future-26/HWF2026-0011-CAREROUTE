import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle dynamic map centering and zooming
const MapController = ({ selectedIncident }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedIncident && selectedIncident.lat && selectedIncident.lng) {
      map.flyTo([selectedIncident.lat, selectedIncident.lng], 12, {
        duration: 1.5
      });
    }
  }, [selectedIncident, map]);

  return null;
};

// Custom Marker Icons based on status
const getMarkerIcon = (status, severity) => {
  let color = '#3b82f6'; // default blue
  
  if (status === 'RESOLVED') {
    color = '#10b981'; // green
  } else if (status === 'DISPATCHED') {
    color = '#f59e0b'; // orange
  } else {
    // REPORTED status - color by severity
    if (severity === 'Critical') color = '#dc2626'; // red
    else if (severity === 'High') color = '#f97316'; // orange-red
    else if (severity === 'Medium') color = '#eab308'; // yellow
  }

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-icon',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const Map = ({ incidents, onMarkerClick, selectedIncident }) => {
  // Center of Andhra Pradesh
  const apCenter = [15.9129, 79.7400];

  return (
    <MapContainer 
      center={apCenter} 
      zoom={7} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapController selectedIncident={selectedIncident} />

      {incidents
        .filter((incident) => incident.status !== 'RESOLVED')
        .map((incident) => (
        <Marker 
          key={incident._id}
          position={[incident.lat, incident.lng]}
          icon={getMarkerIcon(incident.status, incident.severity)}
          eventHandlers={{
            click: () => onMarkerClick(incident),
          }}
        >
          <Popup>
            <div style={{ padding: '4px', minWidth: '150px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{incident.crimeType}</div>
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{incident.location}</div>
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999' }}>Click marker for details</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
