/**
 * Authentication Middleware
 * 
 * This middleware handles API key verification for library attendance endpoints.
 * Uses a static API key for simple authentication.
 */

// Configuration
const STATIC_API_KEY = process.env.LIBRARY_API_KEY || 'TereIshqDaJaamHaseen';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Simple in-memory cache for API keys
const apiKeyCache = new Map();

/**
 * Verify API key against the static key
 * @param {string} apiKey - The API key to verify
 * @returns {boolean} - Whether the API key is valid
 */
function verifyApiKey(apiKey) {
  if (!apiKey) return false;
  
  // Check cache first
  const cacheKey = `static_${apiKey}`;
  const cached = apiKeyCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isValid;
  }
  
  // Simple string comparison
  const isValid = apiKey === STATIC_API_KEY;
  
  // Cache the result
  apiKeyCache.set(cacheKey, {
    isValid,
    timestamp: Date.now()
  });
  
  return isValid;
}

/**
 * Authentication middleware for library attendance routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticateLibraryAccess(req, res, next) {
  try {
    // Extract API key from headers
    const apiKey = req.headers['xapikey'] || 
                   req.headers['x-api-key'] || 
                   req.headers['authorization']?.replace('Bearer ', '');
    
    // Check if API key is provided
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide a valid API key in the xapikey, x-api-key, or Authorization header',
        code: 'MISSING_API_KEY'
      });
    }
    
    // Verify the API key
    const isValid = verifyApiKey(apiKey);
    
    if (!isValid) {
      return res.status(401).json({
        error: 'API Key Invalid',
        message: 'The provided API key is invalid',
        code: 'INVALID_API_KEY'
      });
    }
    
    // Store the API key in the request for later use
    req.apiKey = apiKey;
    
    // Continue to the next middleware/route handler
    next();
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    return res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * Optional authentication middleware (for development/testing)
 * Allows requests to proceed even without valid API keys
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function optionalAuth(req, res, next) {
  const apiKey = req.headers['xapikey'] || 
                 req.headers['x-api-key'] || 
                 req.headers['authorization']?.replace('Bearer ', '');
  
  if (apiKey) {
    // If API key is provided, verify it
    return authenticateLibraryAccess(req, res, next);
  } else {
    // If no API key, proceed with a warning
    console.warn('⚠️  Request without API key:', req.method, req.path);
    req.apiKey = null;
    next();
  }
}

/**
 * Development-only middleware that bypasses authentication
 * WARNING: Only use in development environment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function devAuth(req, res, next) {
  console.warn('⚠️  DEVELOPMENT MODE: Bypassing authentication');
  req.apiKey = 'dev-mode';
  next();
}

/**
 * Clear the API key cache
 * Useful for testing or when you need to force re-verification
 */
function clearApiKeyCache() {
  apiKeyCache.clear();
  console.log('✅ API key cache cleared');
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  return {
    size: apiKeyCache.size,
    entries: Array.from(apiKeyCache.entries()).map(([key, value]) => ({
      key: key.split('_')[1] ? key.split('_')[1].substring(0, 8) + '***' : '***',
      isValid: value.isValid,
      age: Date.now() - value.timestamp
    }))
  };
}

/**
 * Get the current API key (for reference only)
 * @returns {string} The current API key
 */
function getCurrentApiKey() {
  return STATIC_API_KEY;
}

module.exports = {
  authenticateLibraryAccess,
  optionalAuth,
  devAuth,
  clearApiKeyCache,
  getCacheStats,
  verifyApiKey,
  getCurrentApiKey
};
 
