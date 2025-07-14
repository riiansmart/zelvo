/**
 * Pre-configured Axios instance used by all Zelvo front-end service modules.
 * Automatically injects `Authorization` header when a JWT is present in `localStorage`.
 */

import axios, { InternalAxiosRequestConfig } from 'axios';

// Create Axios instance with base config
const api = axios.create({
  // Ensure this matches your Vite proxy or backend URL
  baseURL: 'http://localhost:8081/api/v1', // Use full backend URL for clarity
  // timeout: 5000, // Optional: Add a timeout
});

// --- Axios Request Interceptor --- 
// Runs before every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('token'); 
    
    // Define endpoints that should NOT receive the auth header
    const publicEndpoints = ['/auth/login', '/auth/register'];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (token && !isPublicEndpoint) {
      // If token exists and the request is not to a public endpoint, add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor added Auth header'); // Optional: for debugging
    } else {
      console.log('Interceptor: Public endpoint or no token, skipping Auth header'); // Optional: for debugging
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error (e.g., network error)
    console.error('Axios request interceptor error:', error); 
    return Promise.reject(error);
  }
);

// Remove the setAuthToken function as the interceptor handles it dynamically
/*
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
*/

// Optional: Add response interceptor for handling errors (e.g., 401 for expired token)
/*
api.interceptors.response.use(
  response => response, // Pass through successful responses
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      console.error('Axios response interceptor: Unauthorized (401)');
      localStorage.removeItem('token');
      // Redirect to login or refresh token logic
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);
*/

export default api;