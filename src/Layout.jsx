import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/components/language/LanguageContext';

// ─── Module-level flag ────────────────────────────────────────────────────────
// Überlebt iOS/Android Orientation Changes (JS-Kontext bleibt am Leben).
// Wird nur bei echtem Page-Reload oder Tab-Neustart auf false zurückgesetzt.
let _authInitialized = false;

// Dark Mode sofort anwenden – vor dem ersten React-Render
(function applyDark() {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.body.style.backgroundColor = '#0a0a0a';
    }
  } catch (e) {}
})();

function AppLogo() {
  return (
    <div style={{ position: 'fixed', top: '12px', left: '12px', zIndex: 2147483647, pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '20px', fontWeight: '300', color: 'white' }}>📖</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#292524', letterSpacing: '0.3px' }}>Book Compass</span>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);

  // Auth-Status sofort aus localStorage – keine Verzögerung, kein Flackern
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ── KRITISCH: Nur einmal pro JS-Session ausführen ──────────────────────
    // Bei Orientation Change bleibt der JS-Kontext erhalten → _authInitialized
    // bleibt true → dieser Block wird NICHT nochmal ausgeführt → kein Reload.
    if (_authInitialized) return;
    _authInitialized = true;

    const wasCached = localStorage.getItem('isAuthenticated') === 'true';

    // Root-Weiterleitung nur beim allerersten Besuch
    if (location.pathname === '/') {
      navigate(wasCached ? '/Compass' : '/Onboarding', { replace: true });
    }

    // Auth im Hintergrund prüfen (kein Spinner, kein Block)
    base44.auth.me()
      .then(user => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        window.dispatchEvent(new Event('authChanged'));

        // Dark Mode aus Profil übernehmen
        if (user?.dark_mode) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.backgroundColor = '#0a0a0a';
          document.body.style.backgroundColor = '#0a0a0a';
          localStorage.setItem('darkMode', 'true');
        } else if (localStorage.getItem('darkMode') !== 'true') {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.backgroundColor = '';
          document.body.style.backgroundColor = '';
          localStorage.setItem('darkMode', 'false');
        }

        // Sprache aus Profil
        if (user?.language && user.language !== localStorage.getItem('appLanguage')) {
          localStorage.setItem('appLanguage', user.language);
        }

        // Consent
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
        }

        // Nur navigieren wenn kein Cache vorhanden war (Erstbesuch ohne Cache)
        if (!wasCached && location.pathname === '/') {
          navigate('/Compass');
        }
      })
      .catch(() => {
        // Fehler: nur ausloggen wenn vorher kein gültiger Cache
        if (!wasCached) {
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          if (location.pathname === '/') {
            navigate('/Onboarding');
          }
        }
        // Mit Cache: Status behalten – könnte vorübergehender Netzwerkfehler sein
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pagesWithoutNav = ['Onboarding', 'Legal'];
  const showNavigation = isAuthenticated && !pagesWithoutNav.includes(currentPageName);
  const showLogo = currentPageName === 'Onboarding';

  return (
    <LanguageProvider>
      {showLogo && <AppLogo />}
      <div style={{
        paddingBottom: showNavigation ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : '0',
        minHeight: '100dvh',
      }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>
      {/* Portal direkt auf document.body – kein transform-Kontext kann position:fixed brechen */}
      {createPortal(
        <BottomNav isAuthenticated={isAuthenticated} />,
        document.body
      )}
    </LanguageProvider>
  );
}