import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRole,
  getToken,
  removeRole,
  removeToken,
  setRole,
  setToken,
} from "../utils/authStorage";
import { getProfile } from "../api/user/users.api";
import { adminRoutes, Router } from "../constants/router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const navigate = useNavigate();
  
  const fetchUser = async () => {
    const role = getRole();
    setLoading(true);
    try {
      const userData = await getProfile(role === "admin" ? "admin" : "user");
      setUser(userData?.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        // Only logout if unauthorized
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = "/login";
      } else {
        // Network error → do NOT logout
        console.error("Network error while fetching user");
      }
    } finally {
      setLoading(false);
      setIsAuthReady(true);
    }
  };

  // 🔁 Check auth on app load
  useEffect(() => {
    const token = getToken();

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
      setIsAuthReady(true);
    }
  }, []);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  // ✅ Login
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setRole(userData?.role);
    setIsAuthenticated(true);
  };

  // ❌ Logout
  const logout = async () => {
    const isImpersonating = sessionStorage.getItem("isImpersonating");
    if (isImpersonating) {
      setToken(sessionStorage.getItem("adminToken"));
      setRole(sessionStorage.getItem("adminRole"));
      sessionStorage.removeItem("isImpersonating");
      // 🔥 IMPORTANT: reset user first
    setUser(null);
    setIsAuthenticated(false);

    // 🔥 Fetch admin again
    await fetchUser();

    // 🔥 Navigate after state updated
    navigate(adminRoutes.ADMIN_DASHBOARD, { replace: true });
    } else {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      removeRole();
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminRole");

      // Reset translation back to default (English) on logout
      try {
        localStorage.setItem("google_trans_lang", "en");
        
        // Clear existing googtrans cookies first across all paths and domains to prevent conflicts
        const paths = ["/", "/dashboard", ""];
        const domains = [
          window.location.hostname,
          `.${window.location.hostname}`,
          ""
        ];
        const hostParts = window.location.hostname.split('.');
        if (hostParts.length > 2) {
          domains.push(`.${hostParts.slice(-2).join('.')}`);
          domains.push(hostParts.slice(-2).join('.'));
        }
        paths.forEach(path => {
          domains.forEach(domain => {
            try {
              document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;${path ? ` path=${path};` : ""}${domain ? ` domain=${domain};` : ""}`;
            } catch (e) {}
          });
        });

        // Explicitly set cookie to English to force-reset widget
        document.cookie = "googtrans=/en/en; path=/;";
      } catch (err) {
        console.error("Error resetting translation on logout:", err);
      }

      window.location.href = Router.HOME || "/";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthContext.Provider
      value={{
        showLoader,
        hideLoader,
        loading,
        isAuthReady,
        login,
        logout,
        isAuthenticated,
        refreshUser: fetchUser,
        user,
        handlePrint
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}