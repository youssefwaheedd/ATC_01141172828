/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import type { DecodedUser } from "@/constants/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

type AuthContextType = {
  user: DecodedUser | null;
  isLoading: boolean;
  login: (token: string, userData?: DecodedUser) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserOnLoad: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  fetchUserOnLoad: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(
    async (tokenToVerify?: string) => {
      try {
        const currentToken = tokenToVerify || localStorage.getItem("authToken");
        if (!currentToken) {
          clearAuthData();
          return null;
        }
        const res = await api.get<{ user: DecodedUser }>(`/auth/me`);
        setUser(res.data.user);
        return res.data.user;
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        clearAuthData();
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/register"
        ) {
          navigate("/login", { replace: true });
        }
        return null;
      }
    },
    [navigate, clearAuthData, location.pathname]
  );

  const fetchUserOnLoad = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    if (token) {
      await fetchCurrentUser(token);
    }
    setIsLoading(false);
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  const login = useCallback(
    async (token: string, userData?: DecodedUser) => {
      localStorage.setItem("authToken", token);
      if (userData) {
        setUser(userData);
        navigate("/", { replace: true });
      } else {
        const fetchedUser = await fetchCurrentUser(token);
        if (fetchedUser) {
          navigate("/", { replace: true });
        } else {
          clearAuthData();
          navigate("/login", { replace: true });
        }
      }
    },
    [navigate, fetchCurrentUser, clearAuthData]
  );

  const logout = useCallback(async () => {
    try {
      await api.post(`/auth/logout`);
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuthData();
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuthData]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      fetchUserOnLoad,
    }),
    [user, isLoading, login, logout, fetchUserOnLoad]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
