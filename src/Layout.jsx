/**
 * Layout – Wrapper für alle Seiten.
 *
 * Verantwortlichkeiten:
 * - Liest Auth-State NUR aus AuthContext (kein eigener isAuthenticated-State)
 * - Kein sessionStorage-Init-Flag mehr (layout_init entfernt)
 * - Kein Vollbild-Spinner (isLoadingAuth/isLoadingPublicSettings sind immer false)
 * - Einmalige Navigation: Home → Compass wenn eingeloggt, → Onboarding wenn nicht
 * - Onboarding-Enforcement: Nutzer ohne onboarding_completed → /Onboarding
 * - ConsentModal für Nutzer ohne AGB-Akzeptanz
 * - BottomNav via createPortal – immer gemountet, nur per CSS sichtbar/versteckt
 * - Dark Mode wird in AuthContext gesetzt, hier nur beim Start aus localStorage gelesen
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/components/language/LanguageContext';

// Dark Mode sofort vor dem ersten React-Render anwenden – verhindert FOUC
(function applyDarkModeImmediately() {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    }
  } catch {}
})();

const PAGES_WITHOUT_NAV = ['onboarding', 'legal', 'booksearch'];

// Routen, die KEIN onboarding_completed benötigen
const ONBOARDING_FREE_ROUTES = ['onboarding', 'booksearch', 'bookdiscover', 'legal'];

export default function Layout({ children, currentPageName }) {
  const { isAuthenticated, user } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  // Einmalige initiale Navigation (nur beim allerersten Render auf '/')
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (locationRef.current.pathname !== '/') return;

    // Optimistisch aus Cache navigieren – Auth-Validierung läuft in AuthContext
    const cachedAuth = (() => {
      try { return JSON.parse(localStorage.getItem('bc_auth_v2') || 'null')?.isAuthenticated; } catch { return false; }
    })();
    navigate(cachedAuth ? '/Compass' : '/Onboarding', { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Onboarding-Enforcement: reagiert auf User-Änderungen aus AuthContext
  useEffect(() => {
    if (!user) return;
    if (user.onboarding_completed) return;
    const path = locationRef.current.pathname.toLowerCase();
    const isAllowed = ONBOARDING_FREE_ROUTES.some(r => path.includes(r));
    if (!isAllowed) {
      navigate('/Onboarding', { replace: true });
    }
  }, [user, navigate]);

  // Consent-Check: reagiert auf User-Änderungen
  useEffect(() => {
    if (!user) return;
    if (!user.terms_accepted || !user.privacy_accepted) {
      setShowConsent(true);
    } else {
      setShowConsent(false);
    }
  }, [user]);

  const pageLower = (currentPageName || '').toLowerCase();
  const showNavigation = isAuthenticated && !PAGES_WITHOUT_NAV.some(p => pageLower.includes(p));

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
        <BottomNav isAuthenticated={isAuthenticated} currentPageName={currentPageName} isFirstRun={!!(user && !user.onboarding_completed)} />,
        document.body
      )}
    </LanguageProvider>
  );
}