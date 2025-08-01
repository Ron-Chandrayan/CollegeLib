// API Configuration Utility
export const getApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    const url = `/api/api/index.php?${endpoint}`;
    console.log('Development Books API URL:', url);
    return url;
  } else {
    // Use environment variable for production
    let baseUrl = import.meta.env.VITE_BOOKS_API_URL || 'https://libman.ethiccode.in';
    
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const url = `${baseUrl}/api/index.php?${endpoint}`;
    console.log('Production Books API URL:', url);
    return url;
  }
};

// Library Management API (separate server)
export const getLibraryApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    const url = `/altapi/${endpoint}`;
    console.log('Development Library API URL:', url);
    return url;
  } else {
    // Use environment variable for production
    let baseUrl = import.meta.env.VITE_API_URL || 'https://libman.ethiccode.in.net';
    
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const url = `${baseUrl}/api/${endpoint}`;
    console.log('Production Library API URL:', url);
    return url;
  }
};

export const getApiHeaders = () => {
  return {
    'x-api-key': import.meta.env.VITE_SECRET_KEY2,
    'Content-Type': 'application/json',
  };
};

export const getLibraryApiHeaders = () => {
  return {
    'XApiKey': import.meta.env.VITE_SECRET_KEY,
    'Content-Type': 'application/json',
  };
};

// Debug function to help troubleshoot API issues
export const debugApiConfig = () => {
  console.log('=== API Configuration Debug ===');
  console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
  console.log('VITE_API_URL (Library):', import.meta.env.VITE_API_URL);
  console.log('VITE_BOOKS_API_URL (Books):', import.meta.env.VITE_BOOKS_API_URL);
  console.log('VITE_SECRET_KEY (Library):', import.meta.env.VITE_SECRET_KEY ? 'Set' : 'Not Set');
  console.log('VITE_SECRET_KEY2 (Books):', import.meta.env.VITE_SECRET_KEY2 ? 'Set' : 'Not Set');
  
  const testBooksUrl = getApiUrl('endpoint=book_all&page=1&limit=5');
  const testLibraryUrl = getLibraryApiUrl('list_all');
  console.log('Test Books API URL:', testBooksUrl);
  console.log('Test Library API URL:', testLibraryUrl);
  console.log('==============================');
}; 