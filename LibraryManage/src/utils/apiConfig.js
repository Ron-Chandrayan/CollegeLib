// API Configuration Utility
export const getApiUrl = (endpoint) => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    return `/api/api/index.php?${endpoint}`;
  } else {
    // Use environment variable in production
    const baseUrl = import.meta.env.VITE_API_URL || 'https://libman.ethiccode.in';
    return `${baseUrl}/api/index.php?${endpoint}`;
  }
};

export const getApiHeaders = () => {
  return {
    'x-api-key': import.meta.env.VITE_SECRET_KEY2,
    'Content-Type': 'application/json',
  };
}; 