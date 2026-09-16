const Incident = require('../models/Incident');
const { classifyIncident } = require('../services/groqService');
const { getCoordinates } = require('../services/geocodingService');
const { sendWhatsAppReply } = require('../services/twilioService');

// This will be initialized from server.js
let io = null;
const setIo = (socketIoInstance) => {
  io = socketIoInstance;
};

// Handle incoming WhatsApp message
const handleWebhook = async (req, res) => {
  try {
    const { Body, From } = req.body; // Twilio sends form-urlencoded data, we'll parse it with express.urlencoded

    if (!Body || !From) {
      return res.status(400).send('Missing Body or From');
    }

    // 1. Send to Groq for classification
    const classification = await classifyIncident(Body);

    // 2. Geocode the location
    const coords = getCoordinates(classification.location);

    // 3. Save to MongoDB
    const newIncident = new Incident({
      crimeType: classification.crimeType || 'Unknown',
      location: classification.location || 'Unknown',
      lat: coords.lat,
      lng: coords.lng,
      severity: classification.severity || 'Medium',
      summary: classification.englishSummary || 'No summary available',
      teluguSummary: classification.teluguSummary || 'సారాంశం అందుబాటులో లేదు',
      suggestedAction: classification.suggestedAction || 'Review required'
    });

    const savedIncident = await newIncident.save();

    // 4. Emit socket event
    if (io) {
      io.emit('newIncident', savedIncident);
    }

    // 5. Send WhatsApp reply
    await sendWhatsAppReply(From, savedIncident);

    // Respond to Twilio webhook to acknowledge receipt
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Webhook error:', error);
    // Even on error, we must return 200 to Twilio so it doesn't retry infinitely
    res.status(200).send('<Response></Response>');
  }
};

// Get all incidents
const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

// Update incident status
const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionReason } = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { status, resolutionReason },
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Emit socket event
    if (io) {
      io.emit('incidentUpdated', updatedIncident);
    }

    res.json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

module.exports = {
  setIo,
  handleWebhook,
  getIncidents,
  updateIncident
};
