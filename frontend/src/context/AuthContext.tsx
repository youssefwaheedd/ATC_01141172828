/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface DecodedUser {
  id: number;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

type AuthContextType = {
  user: DecodedUser | null;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err: any) {
      setUser(null);
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
