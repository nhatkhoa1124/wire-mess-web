import axios from 'axios';
import https from 'https';

const API_BASE_DEVELOPMENT = 'https://localhost:7096/api';

// Create an HTTPS agent that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

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
