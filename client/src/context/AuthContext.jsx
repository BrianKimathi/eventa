import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('client_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getMyProfile()
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('client_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const data = await api.loginUser(credentials);
    const authToken = data.data?.token || data.token;
    if (authToken) {
      localStorage.setItem('client_token', authToken);
      setToken(authToken);
      const profile = await api.getMyProfile();
      setUser(profile);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.registerUser(userData);
    const authToken = data.data?.token || data.token;
    if (authToken) {
      localStorage.setItem('client_token', authToken);
      setToken(authToken);
      const profile = await api.getMyProfile();
      setUser(profile);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('client_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
