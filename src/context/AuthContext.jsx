import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State on Mount (Handle Page Refresh)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await import('../utils/api').then(m => m.default).then(API => 
            API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          );
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch authenticated user:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      // NOTE: We assume the backend route is /api/auth/login.
      // Since API baseURL is /api, we call /auth/login
      // We will need to import API into this file.
      const { data } = await import('../utils/api').then(m => m.default).then(API => API.post('/auth/login', { email, password }));

      localStorage.setItem('token', data.token);

      // Fetch fresh user data after login
      const userRes = await import('../utils/api').then(m => m.default).then(API => API.get('/auth/me', { headers: { Authorization: `Bearer ${data.token}` } }));
      
      setUser(userRes.data);
      localStorage.setItem('user', JSON.stringify(userRes.data));
      
      toast.success('Successfully logged in!');
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return {
        success: false,
        message: msg
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const { data } = await import('../utils/api').then(m => m.default).then(API => API.post('/auth/register', { name, email, password, role }));

      localStorage.setItem('token', data.token);

      // Fetch fresh user data
      const userRes = await import('../utils/api').then(m => m.default).then(API => API.get('/auth/me', { headers: { Authorization: `Bearer ${data.token}` } }));

      setUser(userRes.data);
      localStorage.setItem('user', JSON.stringify(userRes.data));

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return {
        success: false,
        message: msg
      };
    } finally {
      setLoading(false);
    }
  };

  // Google Login Success handler (used when redirected back from backend)
  const googleLoginSuccess = async (token) => {
    try {
      setLoading(true);
      localStorage.setItem('token', token);
      
      // Fetch the actual user from DB after OAuth redirect
      const userRes = await import('../utils/api').then(m => m.default).then(API => API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }));
      
      setUser(userRes.data);
      localStorage.setItem('user', JSON.stringify(userRes.data));
      
      toast.success('Successfully authenticated via Google');
      return userRes.data.role;
    } catch (error) {
      console.error("OAuth flow failed:", error);
      toast.error('Authentication flow encountered an error. Please try logging in again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole: (user?.role === 'user' ? 'jobseeker' : user?.role) || 'jobseeker',
      isAuthenticated: !!user,
      loading,
      login,
      register,
      googleLoginSuccess,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
