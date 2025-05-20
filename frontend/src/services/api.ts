// Axios instance with auth header

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
    
    if (token) {
      // If token exists, add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor added Auth header'); // Optional: for debugging
    } else {
      // Optional: Handle requests that should fail if no token exists
       console.log('Interceptor: No token found'); // Optional: for debugging
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