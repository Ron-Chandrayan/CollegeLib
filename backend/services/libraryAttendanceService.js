/**
 * Library Attendance Service
 * 
 * This service provides functionality to interact with the SIES GST library attendance system.
 * Simplified to focus on IN/OUT functionality.
 */

const axios = require('axios');
const cheerio = require('cheerio');

// URL configuration
const LOGIN_URL = 'http://siesgstattendance.ourlib.in/signin.php';
const INDEX_URL = 'http://siesgstattendance.ourlib.in/index.php';
const UPDATE_URL = 'http://siesgstattendance.ourlib.in/update_ajax.php';
// const VERIFY_URL = "https://api.ethiccode.in/library/verify.php";

// Cache implementation (commented out - not needed for IN/OUT only)
/*
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
*/

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
    
    // Store cookies manually
    this.cookies = [];
    
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
    try {
      // First, visit the main page to establish a session
      const mainPageResponse = await this.session.get(INDEX_URL);
      
      // Store any cookies from the main page
      const mainPageCookies = mainPageResponse.headers['set-cookie'];
      if (mainPageCookies) {
        this.cookies = mainPageCookies.map(cookie => cookie.split(';')[0]);
      }
      
      // Now attempt login
      const loginData = {
        'form_action': 'signin',
        'username': 'Libatt',
        'password': 'Libatt@123',
        'submit': 'submit'
      };
      
      const loginResponse = await this.session.post(LOGIN_URL, loginData, {
        retry: 3,
        retryDelay: 300,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': this.cookies.join('; ')
        }
      });
      
      // Store cookies from login response
      const setCookieHeaders = loginResponse.headers['set-cookie'];
      if (setCookieHeaders) {
        this.cookies = setCookieHeaders.map(cookie => cookie.split(';')[0]);
      }
      
      // Check if login was successful
      if (loginResponse.status === 200) {
        if (setCookieHeaders) {
          return true;
        } else {
          const responseText = loginResponse.data;
          if (responseText.includes('loginModel') || responseText.includes('signin')) {
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  }
}

// Global session instance
const optimizedSession = new OptimizedSession();

// HTML parsing functions (commented out - not needed for IN/OUT only)
/*
function extractTableData(html) {
  try {
    const $ = cheerio.load(html);
    const table = $('#inMembersTable');
    if (!table.length) {
      return [];
    }
    
    const tbody = table.find('tbody');
    const students = [];
    const rows = tbody.length ? tbody.find('tr') : table.find('tr');
    
    rows.each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 4) {
        const student = {
          PRN: $(cells[1]).text().trim(),
          name: $(cells[2]).text().trim(),
          purpose: $(cells[3]).text().trim()
        };
        students.push(student);
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
*/

// API functions (commented out - not needed for IN/OUT only)
/*
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
*/

// Service functions (commented out - not needed for IN/OUT only)
/*
async function getLastEntry(apiKey) {
  // Check cache first
  const cachedData = cache.get('last_entry', 30); // 30 second cache
  if (cachedData) return cachedData;
  
  try {
    await optimizedSession.ensureLoggedIn();
    
    const response = await optimizedSession.session.get(INDEX_URL, {
      headers: {
        'Cookie': optimizedSession.cookies.join('; ')
      }
    });
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
    
    const response = await optimizedSession.session.get(INDEX_URL, {
      headers: {
        'Cookie': optimizedSession.cookies.join('; ')
      }
    });
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
    
    const response = await optimizedSession.session.get(INDEX_URL, {
      headers: {
        'Cookie': optimizedSession.cookies.join('; ')
      }
    });
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
    
    const response = await optimizedSession.session.get(INDEX_URL, {
      headers: {
        'Cookie': optimizedSession.cookies.join('; ')
      }
    });
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
    
    const response = await optimizedSession.session.get(INDEX_URL, {
      headers: {
        'Cookie': optimizedSession.cookies.join('; ')
      }
    });
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
*/

// Main IN/OUT action function
async function inOutAction(apiKey, prn, purpose) {
  try {
    await optimizedSession.ensureLoggedIn();
    
    const formData = {
      purpose,
      cardnumber: prn,
      submit: 'IN/OUT'
    };
    
    const response = await optimizedSession.session.post(UPDATE_URL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': optimizedSession.cookies.join('; ')
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      const responseData = response.data;
      
      // Parse the response to determine IN/OUT status and extract name
      let name = 'Unknown';
      let status = 'unknown';
      
      if (typeof responseData === 'string') {
        // Parse HTML response to extract name and determine IN/OUT
        const $ = cheerio.load(responseData);
        
        // Extract name from the welcome message - look for the bold text
        const nameElement = $('b').first();
        if (nameElement.length) {
          name = nameElement.text().trim();
        }
        
        // Determine IN/OUT status based on content
        const responseText = responseData.toLowerCase();
        if (responseText.includes('welcome')) {
          status = 'IN';
        } else if (responseText.includes('thanks') || responseText.includes('thank')) {
          status = 'OUT';
        } else {
          // Fallback: check for specific patterns
          if (responseText.includes('check-in') || responseText.includes('signed in')) {
            status = 'IN';
          } else if (responseText.includes('check-out') || responseText.includes('signed out')) {
            status = 'OUT';
          }
        }
      } else if (typeof responseData === 'object') {
        // Handle JSON response
        if (responseData.checkZero === 0 || responseData.checkZero === 1) {
          // For JSON responses, we need to make another request to get the actual page content
          try {
            const pageResponse = await optimizedSession.session.get(INDEX_URL, {
              headers: {
                'Cookie': optimizedSession.cookies.join('; ')
              }
            });
            
            if (pageResponse.status === 200) {
              const $ = cheerio.load(pageResponse.data);
              
              // Look for the student in the current list
              const studentRow = $(`tr:contains("${prn}")`);
              if (studentRow.length) {
                const cells = studentRow.find('td');
                if (cells.length >= 3) {
                  name = $(cells[2]).text().trim();
                  status = 'IN'; // If found in current list, they're IN
                }
              } else {
                // Student not in current list, likely checked OUT
                status = 'OUT';
                // Try to get name from previous state or use PRN
                name = `(${prn})`;
              }
            }
          } catch (pageError) {
            name = `(${prn})`;
            status = 'unknown';
          }
        }
      }
      
      return {
        name: name,
        status: status
      };
    } else {
      return { 
        name: 'Error',
        status: 'failed'
      };
    }
  } catch (error) {
    throw new Error(`Error performing IN/OUT action: ${error.message}`);
  }
}

// Health check function (commented out - not needed for IN/OUT only)
/*
function getHealth() {
  return {
    status: 'healthy',
    timestamp: Date.now(),
    cache_size: cache.size()
  };
}
*/

// Cache management (commented out - not needed for IN/OUT only)
/*
function clearCache() {
  cache.clear();
  return { message: 'Cache cleared successfully' };
}
*/

module.exports = {
  // verifyApiKey,
  // getLastEntry,
  // listAllStudents,
  // getTodaysFootfall,
  // getTotalFootfall,
  // getDashboard,
  inOutAction,
  // getHealth,
  // clearCache
};
