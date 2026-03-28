import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/components/language/LanguageContext';

// ─── Module-level: überlebt Orientation Changes (JS-Modul bleibt in Memory) ──
let _initialized = false;          // wurde init() bereits ausgeführt?
let _isAuthenticated = null;       // null = unbekannt, true/false = geprüft

// Dark Mode sofort beim Modulload anwenden – vor dem ersten React-Render
(function applyDark() {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();

const PAGES_WITHOUT_NAV = ['Onboarding', 'Legal'];

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Sofort aus module-cache oder localStorage – KEIN Flackern
    () => _isAuthenticated !== null
      ? _isAuthenticated
      : localStorage.getItem('isAuthenticated') === 'true'
  );
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    // ── NUR EINMAL pro JS-Session ausführen ─────────────────────────────────
    // Bei Orientation Change: JS-Kontext bleibt, _initialized = true → SKIP
    if (_initialized) return;
    _initialized = true;

    const cachedAuth = localStorage.getItem('isAuthenticated') === 'true';

    // Erste Navigation (nur wenn noch auf Root)
    if (locationRef.current.pathname === '/') {
      navigate(cachedAuth ? '/Compass' : '/Onboarding', { replace: true });
    }

    // Auth still im Hintergrund prüfen – KEIN Spinner, KEINE Unterbrechung
    base44.auth.me()
      .then(user => {
        _isAuthenticated = true;
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');

        // Dark Mode aus Profil
        if (user?.dark_mode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else if (user?.dark_mode === false) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }

        // Sprache aus Profil
        if (user?.language) {
          localStorage.setItem('appLanguage', user.language);
        }

        // Consent prüfen
        if (!user?.terms_accepted || !user?.privacy_accepted) {
          setShowConsent(true);
        }

        // Nur navigieren wenn wir noch auf Root stehen und kein Cache
        if (!cachedAuth && locationRef.current.pathname === '/') {
          navigate('/Compass', { replace: true });
        }
      })
      .catch(() => {
        // Netzwerkfehler: Cache behalten wenn vorhanden (Orientation, kurzes Offline)
        if (!cachedAuth) {
          _isAuthenticated = false;
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          if (locationRef.current.pathname === '/') {
            navigate('/Onboarding', { replace: true });
          }
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showNavigation = isAuthenticated && !PAGES_WITHOUT_NAV.includes(currentPageName);

  return (
    <LanguageProvider>
      <div style={{
        paddingBottom: showNavigation ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : '0',
        minHeight: '100dvh',
      }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>
      {createPortal(
        <BottomNav isAuthenticated={isAuthenticated} />,
        document.body
      )}
    </LanguageProvider>
  );
}