import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

// Cache helpers – survive orientation changes AND page reloads
const LS_KEY = 'authCtx_v1';
function getCache() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; } }
function setCache(v) { try { if (v === null) { localStorage.removeItem(LS_KEY); } else { localStorage.setItem(LS_KEY, JSON.stringify(v)); } } catch {} }

export const AuthProvider = ({ children }) => {
  const _cache = getCache();
  const [user, setUser] = useState(_cache?.user ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(_cache?.isAuthenticated ?? false);
  // If we have a cached result, skip loading states entirely
  const [isLoadingAuth, setIsLoadingAuth] = useState(false); // Never show loading – Layout handles this
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false); // Never block render
  const [appPublicSettings, setAppPublicSettings] = useState(_cache?.appPublicSettings ?? null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // AuthContext intentionally does NOT trigger navigation or loading states.
    // The Layout component owns auth-based navigation (with module-level guards
    // that survive orientation changes). Here we only populate user data for
    // components that need it via useAuth().
    if (getCache()) return; // Already have data – nothing to do
    // Silently fetch user in background
    base44.auth.me().then(currentUser => {
      setUser(currentUser);
      setIsAuthenticated(true);
      setCache({ user: currentUser, isAuthenticated: true, appPublicSettings: null });
    }).catch(() => {
      // Silently ignore – Layout handles auth errors
    });
  }, []);

  // Kept for compatibility but no longer used internally
  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth(publicSettings);
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async (publicSettings) => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      // Cache result so orientation changes don't re-trigger loading
      setCache({ user: currentUser, isAuthenticated: true, appPublicSettings: publicSettings ?? null });
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setCache(null);
    setCache(null);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};