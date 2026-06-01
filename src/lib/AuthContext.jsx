/**
 * AuthContext – Zentraler, stabiler Auth-State für Book Compass.
 *
 * Designprinzipien:
 * - localStorage ist NUR optimistischer UI-Cache (sofortiges Render ohne Flackern)
 * - base44.auth.me() validiert immer still im Hintergrund – KEIN Vollbild-Spinner
 * - Kein sessionStorage-Flag mehr – Orientation Change darf niemals Auth blockieren
 * - Stale Cache: wenn me() 401/403 liefert, Cache leeren + Redirect zu Onboarding
 * - Multi-User-Sicherheit: Logout löscht alle Keys sauber
 */

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

const LS_AUTH_KEY = 'bc_auth_v2';

function readCache() {
  try { return JSON.parse(localStorage.getItem(LS_AUTH_KEY) || 'null'); } catch { return null; }
}
function writeCache(v) {
  try {
    if (v === null) localStorage.removeItem(LS_AUTH_KEY);
    else localStorage.setItem(LS_AUTH_KEY, JSON.stringify(v));
  } catch {}
}
function clearAllAuthStorage() {
  try {
    localStorage.removeItem(LS_AUTH_KEY);
    // Legacy keys aus früheren Versionen mitbereinigen
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authCtx_v1');
    sessionStorage.removeItem('auth_fetch');
    sessionStorage.removeItem('layout_init');
  } catch {}
}

export const AuthProvider = ({ children }) => {
  const cache = readCache();

  // Optimistischer Initialzustand aus Cache – kein Flackern, kein Spinner
  const [user, setUser] = useState(cache?.user ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(cache?.isAuthenticated ?? false);

  // isLoadingAuth ist IMMER false – kein Vollbild-Spinner durch Auth-Refresh
  const isLoadingAuth = false;
  const isLoadingPublicSettings = false;
  const authError = null;

  // Verhindert parallele me()-Calls (z.B. React StrictMode double-invoke)
  const fetchingRef = useRef(false);

  useEffect(() => {
    // Hintergrund-Validierung – läuft bei jedem Mount (inkl. Orientation Change)
    // aber nur ein paralleler Request gleichzeitig
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    base44.auth.me()
      .then(currentUser => {
        setUser(currentUser);
        setIsAuthenticated(true);
        writeCache({ user: currentUser, isAuthenticated: true });

        // Dark Mode aus Profil synchronisieren
        if (currentUser?.dark_mode === true) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else if (currentUser?.dark_mode === false) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }

        // Sprache aus Profil in localStorage schreiben (LanguageContext liest das)
        if (currentUser?.language) {
          localStorage.setItem('appLanguage', currentUser.language);
        }
      })
      .catch((err) => {
        const hadCachedAuth = !!readCache()?.isAuthenticated;

        // 401/403 = Session wirklich abgelaufen → Cache leeren
        const isAuthError = err?.status === 401 || err?.status === 403
          || err?.message?.includes('401') || err?.message?.includes('403')
          || err?.message?.includes('Unauthorized') || err?.message?.includes('Forbidden');

        if (isAuthError && hadCachedAuth) {
          // Stale cache: fremder Account oder abgelaufene Session
          clearAllAuthStorage();
          setUser(null);
          setIsAuthenticated(false);
          // Sanfter Redirect – nur wenn nicht schon auf Onboarding/Legal
          const path = window.location.pathname.toLowerCase();
          if (!path.includes('onboarding') && !path.includes('legal')) {
            window.location.replace('/Onboarding');
          }
          return;
        }

        // Netzwerkfehler (kein Internet, Timeout) → Cache behalten, State nicht ändern
        // User bleibt optimistisch eingeloggt
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    clearAllAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
    base44.auth.logout();
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

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
      checkAppState: () => {},
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