import axios from 'axios';
const API_BASE_DEVELOPMENT = 'https://localhost:7096/api';

export async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await axios({
      url: `${API_BASE_DEVELOPMENT}${endpoint}`,
      method: options.method || 'GET',
      data: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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