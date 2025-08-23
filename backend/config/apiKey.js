/**
 * API Key Configuration
 * 
 * This file contains the API key configuration for the library attendance system.
 * You can set the API key via environment variable or use the default.
 */

// Default API key (change this in production)
//const DEFAULT_API_KEY = '.';

// Get API key from environment variable or use default
const LIBRARY_API_KEY = process.env.LIBRARY_API_KEY;

// API key configuration
const apiKeyConfig = {
  // The API key that your frontend should use
  key: LIBRARY_API_KEY,
  
  // Header names that the middleware will check
  headerNames: ['xapikey', 'x-api-key', 'authorization'],
  
  // Cache duration for API key verification (5 minutes)
  cacheDuration: 5 * 60 * 1000,
  
  // Error messages
  errors: {
    missing: {
      error: 'API key required',
      message: 'Please provide a valid API key in the xapikey, x-api-key, or Authorization header',
      code: 'MISSING_API_KEY'
    },
    invalid: {
      error: 'API Key Invalid',
      message: 'The provided API key is invalid',
      code: 'INVALID_API_KEY'
    }
  }
};

// Helper function to get the API key
function getApiKey() {
  return apiKeyConfig.key;
}

// Helper function to check if an API key is valid
function isValidApiKey(apiKey) {
  return apiKey === apiKeyConfig.key;
}

// Helper function to get error response for missing API key
function getMissingApiKeyError() {
  return {
    status: 401,
    body: apiKeyConfig.errors.missing
  };
}

// Helper function to get error response for invalid API key
function getInvalidApiKeyError() {
  return {
    status: 401,
    body: apiKeyConfig.errors.invalid
  };
}

module.exports = {
  apiKeyConfig,
  getApiKey,
  isValidApiKey,
  getMissingApiKeyError,
  getInvalidApiKeyError
};
