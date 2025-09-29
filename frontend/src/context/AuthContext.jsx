import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // optional: fetch profile if needed
      api.get('/auth/me').then(res => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }).catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, [token]); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      // assume backend returns { token, user }
      const { token: t, user: u } = res.data;
      setToken(t);
      setUser(u);
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      const { token: t, user: u } = res.data;
      setToken(t);
      setUser(u);
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((u) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
