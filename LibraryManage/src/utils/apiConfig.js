// API Configuration Utility
export const getApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    const url = `/api/api/index.php?${endpoint}`;
    console.log('Development API URL:', url);
    return url;
  } else {
    // Use environment variable in production
    let baseUrl = import.meta.env.VITE_API_URL || 'https://libman.ethiccode.in';
    
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const url = `${baseUrl}/api/index.php?${endpoint}`;
    console.log('Production API URL:', url);
    return url;
  }
};

export const getApiHeaders = () => {
  return {
    'x-api-key': import.meta.env.VITE_SECRET_KEY2,
    'Content-Type': 'application/json',
  };
};

// Debug function to help troubleshoot API issues
export const debugApiConfig = () => {
  console.log('=== API Configuration Debug ===');
  console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_SECRET_KEY2:', import.meta.env.VITE_SECRET_KEY2 ? 'Set' : 'Not Set');
  
  const testUrl = getApiUrl('endpoint=book_all&page=1&limit=5');
  console.log('Test API URL:', testUrl);
  console.log('==============================');
}; 