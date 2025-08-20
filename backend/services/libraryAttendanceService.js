/**
 * Library Attendance Service
 * 
 * This service provides functionality to interact with the SIES GST library attendance system.
 * It handles authentication, data scraping, and caching of responses.
 */

const axios = require('axios');
const cheerio = require('cheerio');

// URL configuration
const LOGIN_URL = 'http://siesgstattendance.ourlib.in/signin.php';
const INDEX_URL = 'http://siesgstattendance.ourlib.in/index.php';
const UPDATE_URL = 'http://siesgstattendance.ourlib.in/update_ajax.php';
const VERIFY_URL = "https://api.ethiccode.in/library/verify.php";

// Cache implementation
class SimpleCache {
  constructor() {
    this._cache = {};
    this._timestamps = {};
  }

  get(key, ttl = 60) {
    if (key in this._cache) {
      if (Date.now() - this._timestamps[key] < ttl * 1000) {
        return this._cache[key];
      } else {
        // Expired
        delete this._cache[key];
        delete this._timestamps[key];
      }
    }
    return null;
  }

  set(key, value) {
    this._cache[key] = value;
    this._timestamps[key] = Date.now();
  }

  clear() {
    this._cache = {};
    this._timestamps = {};
  }

  size() {
    return Object.keys(this._cache).length;
  }
}

// Global cache instance
const cache = new SimpleCache();

// Optimized session management
class OptimizedSession {
  constructor() {
    this.session = axios.create({
      timeout: 15000,
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': 'AUDACITY-API/1.0'
      }
    });
    
    // Add retry logic
    this.session.interceptors.response.use(undefined, async (err) => {
      const { config } = err;
      if (!config || !config.retry) return Promise.reject(err);
      
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= config.retry) return Promise.reject(err);
      
      config.__retryCount += 1;
      const backoff = config.retryDelay || 300;
      await new Promise(resolve => setTimeout(resolve, backoff));
      return this.session(config);
    });
    
    this.lastLoginCheck = 0;
    this.loginCheckInterval = 300000; // 5 minutes
    this.isLoggedIn = false;
  }

  async ensureLoggedIn() {
    const currentTime = Date.now();
    
    // Only check login status every 5 minutes
    if (currentTime - this.lastLoginCheck < this.loginCheckInterval && this.isLoggedIn) {
      return true;
    }
    
    try {
      await this._performLogin();
      this.isLoggedIn = true;
      this.lastLoginCheck = currentTime;
      return true;
    } catch (error) {
      console.error('Login error:', error.message);
      return false;
    }
  }

  async _performLogin() {
    const loginData = {
      'form_action': 'signin',
      'username': 'Libatt',
      'password': 'Libatt@123',
      'submit': 'submit'
    };
    
    const response = await this.session.post(LOGIN_URL, loginData, {
      retry: 3,
      retryDelay: 300
    });
    
    return response.status === 200;
  }
}

// Global session instance
const optimizedSession = new OptimizedSession();

// HTML parsing functions
function extractTableData(html) {
  try {
    const $ = cheerio.load(html);
    const table = $('#inMembersTable');
    if (!table.length) return [];
    
    const students = [];
    table.find('tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 4) {
        students.push({
          PRN: $(cells[1]).text().trim(),
          name: $(cells[2]).text().trim(),
          purpose: $(cells[3]).text().trim()
        });
      }
    });
    
    return students;
  } catch (error) {
    console.error('Error extracting table data:', error);
    return [];
  }
}

function extractFootfallData(html) {
  try {
    const $ = cheerio.load(html);
    const footfallData = {};
    
    $('div').each((i, div) => {
      const text = $(div).text().trim().toLowerCase();
      
      if (text.includes('total footfall count')) {
        const nextDiv = $(div).next('div');
        if (nextDiv.length) {
          const value = nextDiv.text().trim().replace('#', '').replace(',', '');
          if (/^\d+$/.test(value)) {
            footfallData.total = value;
          }
        }
      } else if (text.includes('footfall') && text.includes('today')) {
        const nextDiv = $(div).next('div');
        if (nextDiv.length) {
          const value = nextDiv.text().trim().replace('#', '').replace(',', '');
          if (/^\d+$/.test(value)) {
            footfallData.today = value;
          }
        }
      }
    });
    
    return footfallData;
  } catch (error) {
    console.error('Error extracting footfall data:', error);
    return {};
  }
}

// API functions
async function verifyApiKey(apiKey, endpoint) {
  if (!apiKey) return false;
  
  // Check cache first
  const cacheKey = `api_key_${apiKey}`;
  if (cache.get(cacheKey, 300)) return true;
  
  try {
    const response = await axios.get(VERIFY_URL, {
      params: { key: apiKey, endpoint },
      timeout: 5000
    });
    
    if (response.status === 200) {
      cache.set(cacheKey, true);
      return true;
    }
    return false;
  } catch (error) {
    console.error('API key verification error:', error.message);
    return false;
  }
}

// Service functions
async function getLastEntry(apiKey) {
  // Check cache first
  const cachedData = cache.get('last_entry', 30); // 30 second cache
  if (cachedData) return cachedData;
  
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL);
    if (response.status !== 200) {
      throw new Error('Failed to retrieve data');
    }
    
    const students = extractTableData(response.data);
    
    if (students.length > 0) {
      const result = students[0]; // First student is the latest
      cache.set('last_entry', result);
      return result;
    } else {
      throw new Error('No students currently in the library');
    }
  } catch (error) {
    throw new Error(`Error getting last entry: ${error.message}`);
  }
}

async function listAllStudents(apiKey) {
  // Check cache first
  const cachedData = cache.get('list_all', 60); // 1 minute cache
  if (cachedData) return cachedData;
  
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL);
    if (response.status !== 200) {
      throw new Error('Failed to retrieve data');
    }
    
    const students = extractTableData(response.data);
    const result = { students };
    
    cache.set('list_all', result);
    return result;
  } catch (error) {
    throw new Error(`Error listing all students: ${error.message}`);
  }
}

async function getTodaysFootfall(apiKey) {
  // Check cache first
  const cachedData = cache.get('todays_footfall', 120); // 2 minute cache
  if (cachedData) return cachedData;
  
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL);
    if (response.status !== 200) {
      throw new Error('Failed to retrieve data');
    }
    
    const footfallData = extractFootfallData(response.data);
    
    if ('today' in footfallData) {
      const result = { todays_footfall: footfallData.today };
      cache.set('todays_footfall', result);
      return result;
    } else {
      throw new Error('Could not find today\'s footfall count');
    }
  } catch (error) {
    throw new Error(`Error getting today's footfall: ${error.message}`);
  }
}

async function getTotalFootfall(apiKey) {
  // Check cache first
  const cachedData = cache.get('total_footfall', 300); // 5 minute cache
  if (cachedData) return cachedData;
  
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL);
    if (response.status !== 200) {
      throw new Error('Failed to retrieve data');
    }
    
    const footfallData = extractFootfallData(response.data);
    
    if ('total' in footfallData) {
      const result = { total_footfall: footfallData.total };
      cache.set('total_footfall', result);
      return result;
    } else {
      throw new Error('Could not find total footfall count');
    }
  } catch (error) {
    throw new Error(`Error getting total footfall: ${error.message}`);
  }
}

async function getDashboard(apiKey) {
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL);
    if (response.status !== 200) {
      throw new Error('Failed to retrieve data');
    }
    
    const students = extractTableData(response.data);
    const footfallData = extractFootfallData(response.data);
    
    return {
      last_entry: students[0] || null,
      total_students: students.length,
      all_students: students,
      todays_footfall: footfallData.today || 'N/A',
      total_footfall: footfallData.total || 'N/A',
      timestamp: Date.now()
    };
  } catch (error) {
    throw new Error(`Error getting dashboard data: ${error.message}`);
  }
}

async function inOutAction(apiKey, prn, purpose) {
  try {
    await optimizedSession.ensureLoggedIn();
    
    const formData = {
      purpose,
      cardnumber: prn,
      submit: 'IN/OUT'
    };
    
    const response = await optimizedSession.session.post(UPDATE_URL, formData);
    
    try {
      return response.data;
    } catch {
      return { raw_response: response.data };
    }
  } catch (error) {
    throw new Error(`Error performing IN/OUT action: ${error.message}`);
  }
}

// Health check function
function getHealth() {
  return {
    status: 'healthy',
    timestamp: Date.now(),
    cache_size: cache.size()
  };
}

// Cache management
function clearCache() {
  cache.clear();
  return { message: 'Cache cleared successfully' };
}

module.exports = {
  verifyApiKey,
  getLastEntry,
  listAllStudents,
  getTodaysFootfall,
  getTotalFootfall,
  getDashboard,
  inOutAction,
  getHealth,
  clearCache
};
