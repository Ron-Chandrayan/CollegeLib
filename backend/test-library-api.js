/**
 * Test script for the library attendance service
 * 
 * This script tests the library attendance service without modifying the main application.
 * It creates a separate Express server on port 5050 to test the functionality.
 */

const express = require('express');
const cors = require('cors');
const libraryAttendance = require('./services/libraryAttendanceService');

// Create a test server
const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  try {
    const isValid = await libraryAttendance.verifyApiKey(apiKey, req.path);
    if (isValid) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid API key' });
    }
  } catch (error) {
    res.status(503).json({ error: 'API verification failed' });
  }
};

// Test endpoint to check if the service is running
app.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Library attendance service test server is running',
    timestamp: new Date().toISOString()
  });
});

// Get the last entered person
app.get('/api/library/last_entry', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getLastEntry(apiKey);
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('No students') ? 404 : 500)
      .json({ error: error.message });
  }
});

// Get the list of all students
app.get('/api/library/list_all', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.listAllStudents(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's footfall count
app.get('/api/library/todays_footfall', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getTodaysFootfall(apiKey);
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('Could not find') ? 404 : 500)
      .json({ error: error.message });
  }
});

// Get total footfall count
app.get('/api/library/total_footfall', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getTotalFootfall(apiKey);
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('Could not find') ? 404 : 500)
      .json({ error: error.message });
  }
});

// Get all dashboard data in one request
app.get('/api/library/dashboard', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getDashboard(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/library/health', (req, res) => {
  const health = libraryAttendance.getHealth();
  res.json(health);
});

// Cache management endpoint
app.post('/api/library/cache/clear', verifyApiKey, (req, res) => {
  const result = libraryAttendance.clearCache();
  res.json(result);
});

// Endpoint for IN/OUT action
app.post('/api/library/in_out', verifyApiKey, async (req, res) => {
  const { purpose, PRN } = req.body;
  
  if (!purpose || !PRN) {
    return res.status(400).json({ error: 'Missing purpose or PRN' });
  }
  
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.inOutAction(apiKey, PRN, purpose);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.TEST_PORT || 5050;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/test`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api/library/...`);
});
