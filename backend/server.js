require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const { setIo, handleWebhook, getIncidents, updateIncident } = require('./controllers/incidentController');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend
app.use(cors({ origin: '*' }));

// Middleware to parse URL-encoded bodies (for Twilio webhook) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setIo(io);

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.post('/api/webhook', handleWebhook);
app.get('/api/incidents', getIncidents);
app.patch('/api/incidents/:id', updateIncident);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizenshield';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB');
    if (err.name === 'MongoNetworkError' || (err.message && err.message.includes('IP'))) {
      console.error('CRITICAL: MongoDB Atlas IP Whitelist issue. Please add your IP address to the Network Access list in MongoDB Atlas.');
    } else {
      console.error(err);
    }
  });
