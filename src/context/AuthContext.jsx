import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the user object
  const [loading, setLoading] = useState(true); // For initial auth check

  // On mount: check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("paymanni_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await axios.post(
      `https://${import.meta.env.VITE_BACKEND}/api/login`,
      { email, password }
    );
    setUser(res.data.user);
    localStorage.setItem("paymanni_user", JSON.stringify(res.data.user));
    localStorage.setItem("paymanni_token", res.data.token); // ✅ Add this
    return res.data;
  };
  
  const register = async (formData) => {
    const res = await axios.post(
      `https://${import.meta.env.VITE_BACKEND}/api/register`,
      formData
    );
    setUser(res.data.user);
    localStorage.setItem("paymanni_user", JSON.stringify(res.data.user));
    localStorage.setItem("paymanni_token", res.data.token); // ✅ Add this
    return res.data;
  };
  
  

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("paymanni_user");
    localStorage.removeItem("paymanni_token"); // ✅ Add this
    localStorage.removeItem("userId"); // optional
  };
  
  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, register, isAuthenticated: !!user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
