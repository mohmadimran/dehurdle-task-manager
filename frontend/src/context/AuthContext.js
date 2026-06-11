import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/Api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // You can add a /me endpoint to get user details
      setUser({ token });
    }
    setLoading(false);
  }, [token]);

  const handleRegister = async (userData) => {
    try {
      const response = await registerApi(userData);
      const { token: newToken, user: userData_from_server } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData_from_server);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};