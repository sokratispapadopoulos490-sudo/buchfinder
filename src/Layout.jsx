import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/components/language/LanguageContext';

// ─── Dark Mode sofort anwenden – vor dem ersten React-Render ─────────────────
try {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#0a0a0a';
    document.body.style.backgroundColor = '#0a0a0a';
  }
} catch (e) {}

// ─── Module-level Guards ─────────────────────────────────────────────────────
// Diese Variablen überleben Orientation Changes (JS-Modul bleibt im Speicher).
// Nur ein echter Browser-Page-Reload setzt sie zurück.
let _initDone = false;
let _redirectDone = false;

const PAGES_WITHOUT_NAV = ['Onboarding', 'Legal'];

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);

  // isAuthenticated sofort aus localStorage – kein Flackern, kein Warten
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth_ok') === '1'
  );

  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const alreadyAuth = localStorage.getItem('auth_ok') === '1';

    // ── 1. Initial-Redirect (nur einmal pro Session) ──────────────────────────
    if (!_redirectDone) {
      _redirectDone = true;
      if (location.pathname === '/') {
        navigate(alreadyAuth ? '/Compass' : '/Onboarding', { replace: true });
      }
    }

    // ── 2. Auth-Check (nur einmal pro Modul-Leben) ────────────────────────────
    if (_initDone) return;
    _initDone = true;

    // Hintergrund-Check – blockiert nie den Render
    base44.auth.me()
      .then(user => {
        if (!isMounted.current) return;

        setIsAuthenticated(true);
        localStorage.setItem('auth_ok', '1');

        // Dark Mode aus Profil synchronisieren
        if (user?.dark_mode) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.backgroundColor = '#0a0a0a';
          document.body.style.backgroundColor = '#0a0a0a';
          localStorage.setItem('darkMode', 'true');
        }

        // Sprache aus Profil
        if (user?.language && user.language !== localStorage.getItem('appLanguage')) {
          localStorage.setItem('appLanguage', user.language);
        }

        // Consent prüfen
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
        }
      })
      .catch(() => {
        // Netzwerkfehler: Cache erhalten – nicht ausloggen
        // Nur wenn definitiv kein Cache → Onboarding
        if (!alreadyAuth && isMounted.current) {
          setIsAuthenticated(false);
          localStorage.removeItem('auth_ok');
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showNavigation = isAuthenticated && !PAGES_WITHOUT_NAV.includes(currentPageName);
  const showLogo = currentPageName === 'Onboarding';

  return (
    <LanguageProvider>
      {showLogo && (
        <div style={{ position: 'fixed', top: '12px', left: '12px', zIndex: 2147483647 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '20px', color: 'white' }}>📖</span>
            </div>
          </div>
        </div>
      )}

      <div style={{
        paddingBottom: showNavigation ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : '0',
        minHeight: '100dvh',
      }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>

      {/* createPortal auf document.body verhindert, dass CSS-Transforms die Nav kaputt machen */}
      {createPortal(
        <BottomNav isAuthenticated={isAuthenticated} />,
        document.body
      )}
    </LanguageProvider>
  );
}