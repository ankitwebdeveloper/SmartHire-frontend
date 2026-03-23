import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Our backend URL on port 5001 to dodge AirPlay 403
});

// Interceptor to inject the JWT token into every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor to handle token expiration globally and log users out automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
      // Only clear storage and redirect if the user isn't already on an auth page trying to login
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
