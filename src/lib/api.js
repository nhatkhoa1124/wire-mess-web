import axios from 'axios';
import https from 'https';

const API_BASE_DEVELOPMENT = 'https://localhost:7096/api';
const API_BASE_URL = 'https://localhost:7096';

// Create an HTTPS agent that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  httpsAgent: httpsAgent,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - optionally redirect to login
      if (typeof window !== 'undefined') {
        // Could trigger logout here
        console.error('Unauthorized - token may be expired');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export async function fetchAPI(endpoint, options = {}) {
  try {
    // Prepare headers - don't set Content-Type if body is FormData
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios({
      url: `${API_BASE_DEVELOPMENT}${endpoint}`,
      method: options.method || 'GET',
      data: options.body,
      headers: headers,
      httpsAgent: httpsAgent, // Use the agent for HTTPS requests
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'API request failed');
    } else {
      throw error;
    }
  }
}
