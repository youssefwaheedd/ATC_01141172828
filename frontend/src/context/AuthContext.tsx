/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  id: number;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

type AuthContextType = {
  token: string | null;
  user: DecodedUser | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoading: true,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const processNewToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
      try {
        const decodedUser = jwtDecode<DecodedUser>(newToken);
        setUser(decodedUser);
        setTokenState(newToken);
      } catch {
        localStorage.removeItem("authToken");
        setUser(null);
        setTokenState(null);
      }
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
      setTokenState(null);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const attemptAutoLogin = () => {
      let currentToken: string | null = null;
      const cookieToken = Cookies.get("token");

      if (cookieToken) {
        currentToken = cookieToken;
        localStorage.setItem("authToken", cookieToken);
        Cookies.remove("token");
      } else {
        currentToken = localStorage.getItem("authToken");
      }

      if (currentToken) {
        processNewToken(currentToken);
      } else {
        setTokenState(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    attemptAutoLogin();
  }, []);

  const logout = () => {
    console.log("[AuthContext] Logout called.");
    Cookies.remove("token");
    processNewToken(null);
  };

  const contextValue = {
    token,
    user,
    isLoading,
    setToken: processNewToken,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
