import React, { useState, useEffect } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkConsentAndRedirect();
  }, []);

  const checkConsentAndRedirect = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        
        // Consent prüfen
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
        }

        // Redirect-Logik: Nur bei Landing auf Home oder Root
        if (location.pathname === '/' || currentPageName === 'Home') {
          // Prüfe ob Nutzer Bücher hat
          const savedBooks = await base44.entities.SavedBook.filter({ is_completed: false }, '-created_date', 1);
          
          if (savedBooks.length > 0) {
            // Hat Bücher → Compass
            if (currentPageName === 'Home') {
              navigate('/Compass');
            }
          }
          // Keine Bücher → bleibt auf Home für neue Empfehlung
        }
      } else {
        // Nicht eingeloggt → zum Onboarding
        if (location.pathname === '/' && currentPageName !== 'Onboarding') {
          navigate('/Onboarding');
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error);
    } finally {
      setCheckingConsent(false);
    }
  };

  if (checkingConsent) {
    return <div>{children}</div>;
  }

  return (
    <div>
      {children}
      {showConsent && (
        <ConsentModal onAccept={() => setShowConsent(false)} />
      )}
    </div>
  );
}