/**
 * Library Attendance Routes
 * 
 * This file contains routes for the library attendance system.
 * These routes replace the Flask-based proxy service that was previously used.
 */

const express = require('express');
const router = express.Router();
const libraryAttendance = require('../services/libraryAttendanceService');

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

// Get the last entered person
router.get('/last_entry', verifyApiKey, async (req, res) => {
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
router.get('/list_all', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.listAllStudents(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's footfall count
router.get('/todays_footfall', verifyApiKey, async (req, res) => {
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
router.get('/total_footfall', verifyApiKey, async (req, res) => {
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
router.get('/dashboard', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getDashboard(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  const health = libraryAttendance.getHealth();
  res.json(health);
});

// Cache management endpoint
router.post('/cache/clear', verifyApiKey, (req, res) => {
  const result = libraryAttendance.clearCache();
  res.json(result);
});

// Endpoint for IN/OUT action
router.post('/in_out', verifyApiKey, async (req, res) => {
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

module.exports = router;
