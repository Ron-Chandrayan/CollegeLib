// API Configuration Utility
export const getApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    const url = `/api/api/index.php?${endpoint}&api_key=${import.meta.env.VITE_SECRET_KEY2}`;
    return url;
  } else {
    // Use environment variable for production
    let baseUrl = import.meta.env.VITE_BOOKS_API_URL || 'https://libman.ethiccode.in';
    
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const url = `${baseUrl}/api/index.php?${endpoint}&api_key=${import.meta.env.VITE_SECRET_KEY2}`;
    return url;
  }
};

// Library Management API (now integrated with main backend)
export const getLibraryApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    const url = `/altapi/${endpoint}`;
    return url;
  } else {
    // Use environment variable for production
    let baseUrl = import.meta.env.LIB_API_ENP || 'https://library-sies-92fbc1e81669.herokuapp.com';
    
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const url = `${baseUrl}/api/${endpoint}`;
    return url;
  }
};

export const getApiHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const getLibraryApiHeaders = () => {
  return {
    'x-api-key': import.meta.env.LIBRARY_API_KEY,
    'Content-Type': 'application/json',
  };
};

// Debug function to help troubleshoot API issues
export const debugApiConfig = () => {
  // Debug function kept for future troubleshooting if needed
}; 