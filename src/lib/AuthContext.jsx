/**
 * AuthContext – Zentraler, stabiler Auth-State für Book Compass.
 *
 * Designprinzipien:
 * - localStorage ist NUR optimistischer UI-Cache (sofortiges Render ohne Flackern)
 * - base44.auth.me() validiert immer still im Hintergrund – KEIN Vollbild-Spinner
 * - Kein sessionStorage-Flag – Orientation Change blockiert Auth nicht mehr
 * - Stale Cache (401/403): Cache leeren + Redirect zu Onboarding
 * - Multi-User-Sicherheit: Logout löscht ALLE relevanten Keys inkl. appLanguage
 * - Modul-Variable _fetchStarted verhindert parallele me()-Calls über StrictMode-Remounts
 * - Sprach-Sync: nach me() wird appLanguage via CustomEvent an LanguageContext gemeldet
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

const LS_AUTH_KEY = 'bc_auth_v2';

// Modul-Variable: überlebt React StrictMode double-invoke sicher
// (nicht useRef – Ref-Instanz wird bei jedem Provider-Mount neu erstellt)
let _fetchStarted = false;

function readCache() {
  try { return JSON.parse(localStorage.getItem(LS_AUTH_KEY) || 'null'); } catch { return null; }
}
function writeCache(v) {
  try {
    if (v === null) localStorage.removeItem(LS_AUTH_KEY);
    else localStorage.setItem(LS_AUTH_KEY, JSON.stringify(v));
  } catch {}
}

export function clearAllAuthStorage() {
  try {
    localStorage.removeItem(LS_AUTH_KEY);
    localStorage.removeItem('appLanguage');
    localStorage.removeItem('bc_book_lang');
    localStorage.removeItem('bc_shop_region');
    // Legacy keys aus früheren Versionen
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authCtx_v1');
    sessionStorage.removeItem('auth_fetch');
    sessionStorage.removeItem('layout_init');
    // AI-Rate-Limit-Keys (Format: ai_limit_YYYY-MM-DD) bereinigen
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('ai_limit_')) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {}
  // In-Memory-Cache leeren (verhindert Cross-User-Cache)
  try { import('@/lib/clientCache').then(m => m.cacheClear()); } catch {}
}

/** Teilt LanguageContext im selben Tab mit, dass sich die Sprache geändert hat. */
function dispatchLanguageChange(lang) {
  try {
    window.dispatchEvent(new CustomEvent('bc:language', { detail: { language: lang } }));
  } catch {}
}

export const AuthProvider = ({ children }) => {
  const cache = readCache();

  // Optimistischer Initialzustand – sofortiges Render ohne Flackern
  const [user, setUser] = useState(cache?.user ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(cache?.isAuthenticated ?? false);

  // isLoadingAuth ist IMMER false – kein Vollbild-Spinner durch Auth-Refresh
  const isLoadingAuth = false;
  const isLoadingPublicSettings = false;
  const authError = null;

  useEffect(() => {
    // Nur einen parallelen me()-Call zulassen
    if (_fetchStarted) return;
    _fetchStarted = true;

    base44.auth.me()
      .then(currentUser => {
        setUser(currentUser);
        setIsAuthenticated(true);
        writeCache({ user: currentUser, isAuthenticated: true });

        // Dark Mode aus Profil
        if (currentUser?.dark_mode === true) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else if (currentUser?.dark_mode === false) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }

        // Sprache aus Profil – in localStorage UND via CustomEvent an LanguageContext
        if (currentUser?.language) {
          localStorage.setItem('appLanguage', currentUser.language);
          dispatchLanguageChange(currentUser.language);
        }
      })
      .catch((err) => {
        const hadCachedAuth = !!readCache()?.isAuthenticated;

        // 401/403 = Session abgelaufen oder fremder Account
        const isAuthError =
          err?.status === 401 || err?.status === 403 ||
          String(err?.message).includes('401') ||
          String(err?.message).includes('403') ||
          String(err?.message).toLowerCase().includes('unauthorized') ||
          String(err?.message).toLowerCase().includes('forbidden');

        if (isAuthError && hadCachedAuth) {
          clearAllAuthStorage();
          setUser(null);
          setIsAuthenticated(false);
          _fetchStarted = false; // Reset damit nach erneutem Login frisch geladen wird
          const path = window.location.pathname.toLowerCase();
          if (!path.includes('onboarding') && !path.includes('legal')) {
            window.location.replace('/Onboarding');
          }
          return;
        }
        // Netzwerkfehler → Cache behalten, User bleibt optimistisch eingeloggt
      })
      .finally(() => {
        _fetchStarted = false;
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    _fetchStarted = false; // Reset für nächsten Login
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