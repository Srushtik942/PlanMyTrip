import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  const persistAuth = (savedUser, savedToken) => {
    setUser(savedUser);
    setToken(savedToken);
    localStorage.setItem("auth_user", JSON.stringify(savedUser));
    localStorage.setItem("auth_token", savedToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const getAuthToken = (authData) => {
    return (
      authData.token ||
      authData.accessToken ||
      authData.access_token ||
      authData.jwt ||
      authData.jwtToken ||
      authData.data?.token ||
      ""
    );
  };

  const getAuthUser = (authData) => {
    return authData.user || authData.data?.user || authData;
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post("https://ai-explore.onrender.com/api/login", credentials);
      const authData = response.data;
      const authUser = getAuthUser(authData);
      const authToken = getAuthToken(authData);
      if (authToken) {
        persistAuth(authUser, authToken);
      }
      return authData;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Unable to login. Please check your credentials.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("https://ai-explore.onrender.com/api/signup", values);
      const authData = response.data;
      const authUser = getAuthUser(authData);
      const authToken = getAuthToken(authData);
      if (authToken) {
        persistAuth(authUser, authToken);
      }
      return authData;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Unable to create account. Please try again.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, token, login, signup, logout: clearAuth, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
