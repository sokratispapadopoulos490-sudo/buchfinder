import React, { useState, useEffect } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
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