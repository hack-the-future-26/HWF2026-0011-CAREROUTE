const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  crimeType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  teluguSummary: {
    type: String,
    required: true
  },
  suggestedAction: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['REPORTED', 'DISPATCHED', 'RESOLVED'],
    default: 'REPORTED'
  },
  resolutionReason: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Incident', incidentSchema);
