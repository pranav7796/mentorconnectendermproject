const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'MentorConnect',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Connect students with mentors',

  // Feature Flags
  enableAuth: import.meta.env.VITE_ENABLE_AUTH !== 'false',
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',

  // Upload Configuration
  maxFileUploadSize: parseInt(import.meta.env.VITE_MAX_FILE_UPLOAD_SIZE || '5242880'),
  allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['.pdf', '.doc', '.docx', '.txt'],

  // Pagination
  defaultPaginationLimit: parseInt(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT || '10'),

  // Environment Detection
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export default config;