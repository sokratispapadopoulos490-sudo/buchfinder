/**
 * Layout – Wrapper für alle Seiten.
 *
 * Verantwortlichkeiten:
 * - Liest Auth-State NUR aus AuthContext (kein eigener isAuthenticated-State)
 * - Kein sessionStorage-Init-Flag mehr (layout_init entfernt)
 * - Login-Gate: Nicht eingeloggte Nutzer (authChecked && !isAuthenticated) werden IMMER
 *   zum Plattform-Login geschickt – nie zur internen Nickname-/Onboarding-Seite
 * - Einmalige Navigation: Home → Compass wenn eingeloggt
 * - Kein erzwungenes Onboarding-Gate mehr: onboarding_completed blockiert keine Navigation
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

const PAGES_WITHOUT_NAV = ['onboarding', 'legal'];

export default function Layout({ children, currentPageName }) {
  const { isAuthenticated, authChecked, user, navigateToLogin } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  // Login-Gate: sobald der Auth-Status feststeht und der Nutzer NICHT eingeloggt ist,
  // sofort zum Plattform-Login schicken (App verlangt Anmeldung).
  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigateToLogin();
    }
  }, [authChecked, isAuthenticated, navigateToLogin]);

  // Einmalige initiale Navigation (nur beim allerersten Render auf '/', nur wenn eingeloggt)
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    if (!isAuthenticated) return;
    didInitRef.current = true;

    if (locationRef.current.pathname !== '/') return;
    navigate('/Compass', { replace: true });
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Solange der Auth-Status nicht geklärt ist ODER der Nutzer nicht eingeloggt ist,
  // niemals App-Inhalte (inkl. Onboarding/Nickname) rendern – nur ein leichter Platzhalter,
  // während der Redirect zum Login läuft.
  if (!authChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

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