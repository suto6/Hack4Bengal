// Simple test server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Test endpoint
app.post('/api/event/create', (req, res) => {
  console.log('Event create endpoint called');
  console.log('Request body:', JSON.stringify(req.body));
  
  res.status(201).json({
    success: true,
    message: 'Test server: Event created successfully',
    receivedData: req.body,
    link: '/event/test-123',
    event: {
      id: 'test-123',
      name: req.body.name || 'Test Event',
      organizer: req.body.organizer || 'Test Organizer',
      details: req.body.details || 'Test details',
      time: 'Test time',
      contactNumber: req.body.contactNumber || '0000000000',
      chatLink: '/event/test-123',
      whatsappNumber: req.body.contactNumber || '0000000000',
      whatsappMessage: '/event/test-123',
      context: 'Test context',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint available at: http://localhost:${PORT}/api/event/create`);
});
