/**
 * Library Attendance Routes
 * 
 * This file contains routes for the library attendance system.
 * Simplified to only include IN/OUT functionality.
 */

const express = require('express');
const router = express.Router();
const libraryAttendance = require('../services/libraryAttendanceService');

// Import the new authentication middleware
const { authenticateLibraryAccess, optionalAuth, devAuth } = require('../middleware/authMiddleware');

// Choose authentication middleware based on environment
const authMiddleware = process.env.NODE_ENV === 'development' ? optionalAuth : authenticateLibraryAccess;

// Get the last entered person (commented out - not needed for IN/OUT only)
/*
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
*/

// Get the list of all students (commented out - not needed for IN/OUT only)
/*
router.get('/list_all', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.listAllStudents(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// Get today's footfall count (commented out - not needed for IN/OUT only)
/*
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
*/

// Get total footfall count (commented out - not needed for IN/OUT only)
/*
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
*/

// Get all dashboard data in one request (commented out - not needed for IN/OUT only)
/*
router.get('/dashboard', verifyApiKey, async (req, res) => {
  try {
    const apiKey = req.headers['xapikey'] || req.headers['x-api-key'];
    const result = await libraryAttendance.getDashboard(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// Health check endpoint (commented out - not needed for IN/OUT only)
/*
router.get('/health', (req, res) => {
  const health = libraryAttendance.getHealth();
  res.json(health);
});
*/

// Cache management endpoint (commented out - not needed for IN/OUT only)
/*
router.post('/cache/clear', verifyApiKey, (req, res) => {
  const result = libraryAttendance.clearCache();
  res.json(result);
});
*/

// Endpoint for IN/OUT action
router.post('/in_out', authMiddleware, async (req, res) => {
  const { purpose, PRN } = req.body;
  
  if (!purpose || !PRN) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'Both purpose and PRN are required',
      code: 'MISSING_FIELDS'
    });
  }
  
  try {
    // Use the API key from the authentication middleware
    const apiKey = req.apiKey;
    const result = await libraryAttendance.inOutAction(apiKey, PRN, purpose);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
 
