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

export default API;
