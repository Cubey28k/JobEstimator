import axios from 'axios';

// Ensure clean URL joining
const joinUrls = (base, path) => {
  // Remove trailing slash from base and leading slash from path, then join
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
};

// Create axios instance with base configuration
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Override the default axios post method to use our custom URL joining
authApi.post = async (url, data, config) => {
    const fullUrl = url.startsWith('/') ? url.substring(1) : url;
    return axios.post(joinUrls(authApi.defaults.baseURL, fullUrl), data, {
        ...authApi.defaults,
        ...config
    });
};

export const loginUser = async (credentials) => {
    try {
        const response = await authApi.post('/login', credentials);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Login failed');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Login failed: ' + error.message);
        }
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await authApi.post('/register', credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.error || 'Registration failed';
            console.error('Registration error:', error.response.data);
            throw new Error(errorMessage);
        } else if (error.request) {
            console.error('Network error:', error.request);
            throw new Error('Unable to reach the server');
        } else {
            console.error('Error:', error.message);
            throw new Error('Registration failed: ' + error.message);
        }
    }
};

// Existing utility functions remain the same
export const isAuthenticated = () => !!localStorage.getItem('token');
export const logoutUser = () => localStorage.removeItem('token');
export const getAuthToken = () => localStorage.getItem('token');