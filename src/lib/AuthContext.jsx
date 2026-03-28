import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

const LS_KEY = 'authCtx_v1';
function getCache() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; } }
function setCache(v) { try { if (v === null) { localStorage.removeItem(LS_KEY); } else { localStorage.setItem(LS_KEY, JSON.stringify(v)); } } catch {} }

// Module-level: überlebt Orientation Changes
let _fetchStarted = false;

export const AuthProvider = ({ children }) => {
  const _cache = getCache();
  const [user, setUser] = useState(_cache?.user ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(_cache?.isAuthenticated ?? false);

  // IMMER false – niemals Ladescreen anzeigen – Layout.jsx verwaltet Navigation
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);

  useEffect(() => {
    // Nur einmal fetchen (überlebt Orientation Change durch module-level flag)
    if (_fetchStarted) return;
    if (getCache()) return;
    _fetchStarted = true;

    base44.auth.me()
      .then(currentUser => {
        setUser(currentUser);
        setIsAuthenticated(true);
        setCache({ user: currentUser, isAuthenticated: true, appPublicSettings: null });
      })
      .catch(() => {
        // Layout.jsx kümmert sich um unauthentifizierte Nutzer
      });
  }, []);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setCache(null);
    _fetchStarted = false;
    localStorage.removeItem('isAuthenticated');
    if (shouldRedirect) {
      base44.auth.logout(window.location.href);
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  // checkAppState kept for API compatibility but is a no-op
  const checkAppState = () => {};

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings: null,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};