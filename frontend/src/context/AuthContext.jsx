import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getUserInfo,
  setUserInfo,
  clearUserInfo,
  login,
  register,
} from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUserInfo();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    const res = await login(email, password);
    setUserInfo(res);
    setUser(res);
    return res;
  };

  const handleRegister = async (name, email, password) => {
    const res = await register(name, email, password);
    setUserInfo(res);
    setUser(res);
    return res;
  };

  const handleLogout = () => {
    clearUserInfo();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};