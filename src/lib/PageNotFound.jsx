import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { t } from '@/lib/i18n';

function currentLanguage() {
  try {
    return localStorage.getItem('appLanguage') || 'de';
  } catch {
    return 'de';
  }
}

/**
 * PageNotFound – wird für unbekannte Routen gerendert (letzte Route in App.jsx).
 * Liegt außerhalb des Layouts, daher kein useLanguage()-Hook (kein Provider).
 */
export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const lang = currentLanguage();

  useDocumentTitle(t('notfound.title', lang));

  // Crawler bekommen einen echten 404-Status statt der Startseite
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'prerender-status-code';
    meta.content = '404';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a] px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-light text-stone-300 dark:text-stone-700">404</div>
        <div className="h-0.5 w-16 bg-amber-500 mx-auto my-6" />

        <h1 className="text-2xl font-medium text-stone-800 dark:text-stone-100 mb-3">
          {t('notfound.title', lang)}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
          {t('notfound.text', lang)}
        </p>
        {pageName && (
          <p className="mt-2 text-sm font-mono text-stone-400 dark:text-stone-500 break-all">
            /{pageName}
          </p>
        )}

        <Button asChild className="mt-8 bg-amber-600 hover:bg-amber-700 text-white gap-2">
          <Link to="/Compass">
            <Compass className="w-4 h-4" />
            {t('notfound.back', lang)}
          </Link>
        </Button>
      </div>
    </div>
  );
}