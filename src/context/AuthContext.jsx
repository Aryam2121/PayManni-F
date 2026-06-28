import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl, setAuthSession, clearAuthStorage, getStoredUser } from "../utils/authStorage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(apiUrl("/api/login"), { email, password });
    const { token, user: userData } = res.data;
    setAuthSession({ token, user: userData });
    setUser({ ...userData, id: userData.id || userData._id, _id: userData._id || userData.id });
    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post(apiUrl("/api/register"), formData);
    const { token, user: userData } = res.data;
    setAuthSession({ token, user: userData });
    setUser({ ...userData, id: userData.id || userData._id, _id: userData._id || userData.id });
    return res.data;
  };

  const logout = () => {
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, register, loading, isAuthenticated: !!user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
