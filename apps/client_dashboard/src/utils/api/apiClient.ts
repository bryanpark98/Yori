import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Define your API base URL
const baseURL = 'http://localhost:3000' + '/api';

// Create an Axios instance with your base URL
const apiClient: AxiosInstance = axios.create({
  baseURL
});

// Set up request interceptors for adding authentication headers, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add the authorization header if the authToken is available
    const authToken = cookies.get('authToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up response interceptors for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
