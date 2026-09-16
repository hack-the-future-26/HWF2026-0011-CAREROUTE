// Predefined list of major cities/towns in Andhra Pradesh with their approximate coordinates
const apCities = {
  'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'vizag': { lat: 17.6868, lng: 83.2185 },
  'vijayawada': { lat: 16.5062, lng: 80.6480 },
  'guntur': { lat: 16.3067, lng: 80.4365 },
  'nellore': { lat: 14.4426, lng: 79.9865 },
  'kurnool': { lat: 15.8281, lng: 78.0373 },
  'rajahmundry': { lat: 17.0005, lng: 81.8040 },
  'tirupati': { lat: 13.6288, lng: 79.4192 },
  'kakinada': { lat: 16.9891, lng: 82.2475 },
  'kadapa': { lat: 14.4673, lng: 78.8242 },
  'anantapur': { lat: 14.6819, lng: 77.6006 },
  'eluru': { lat: 16.7107, lng: 81.1031 },
  'vizianagaram': { lat: 18.1155, lng: 83.3980 },
  'ongole': { lat: 15.5057, lng: 80.0499 },
  'nandyal': { lat: 15.4785, lng: 78.4842 },
  'machilipatnam': { lat: 16.1770, lng: 81.1340 },
  'adoni': { lat: 15.6322, lng: 77.2728 },
  'tenali': { lat: 16.2377, lng: 80.6471 },
  'proddatur': { lat: 14.7478, lng: 78.5529 },
  'chittoor': { lat: 13.2172, lng: 79.1003 },
  'hindupur': { lat: 13.8290, lng: 77.4912 },
  'srikakulam': { lat: 18.2954, lng: 83.8967 },
  'bhimavaram': { lat: 16.5449, lng: 81.5212 },
  'madanapalle': { lat: 13.5516, lng: 78.5036 },
  'guntakal': { lat: 15.1666, lng: 77.3820 },
  'srikalahasti': { lat: 13.7547, lng: 79.7042 },
  // Default fallback if not found
  'default': { lat: 15.9129, lng: 79.7400 } // Center of AP roughly
};

const getCoordinates = (locationName) => {
  if (!locationName) return apCities['default'];
  
  const normalized = locationName.toLowerCase().trim();
  
  // Exact match
  if (apCities[normalized]) {
    return apCities[normalized];
  }

  // Substring match
  for (const city in apCities) {
    if (normalized.includes(city)) {
      return apCities[city];
    }
  }

  // Not found, return center of AP
  return apCities['default'];
};

module.exports = {
  getCoordinates
};
