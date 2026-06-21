import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';

export default function ConsentModal({ onAccept }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const { t } = useLanguage();

  const handleAccept = async () => {
    if (!acceptedTerms || !acceptedPrivacy) return;
    setAccepting(true);
    try {
      await base44.auth.updateMe({
        terms_accepted: true,
        privacy_accepted: true,
        terms_accepted_date: new Date().toISOString()
      });
      onAccept();
    } catch (error) {
      console.error('Error accepting terms:', error);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - 8px)' }}
      >
        {/* Header – nicht scrollbar */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 sm:p-8 text-white rounded-t-2xl flex-shrink-0">
          <Shield className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-light mb-2">{t('consent.title')}</h2>
          <p className="text-amber-100 text-sm sm:text-base">
            {t('consent.subtitle')}
          </p>
        </div>

        {/* Scrollbarer Bereich */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Dokument-Links */}
          <div className="bg-stone-50 rounded-xl p-5 space-y-4">
            <h3 className="font-medium text-stone-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              {t('consent.docsHeading')}
            </h3>
            <div className="space-y-3">
              {[
                { section: 'terms',     label: t('consent.terms') },
                { section: 'privacy',   label: t('consent.privacy') },
                { section: 'community', label: t('consent.community') },
                { section: 'imprint',   label: t('consent.imprint') },
              ].map(({ section, label }) => (
                <a
                  key={section}
                  href={`/Legal?section=${section}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-500 transition-colors"
                >
                  <span className="text-sm text-stone-700">{label}</span>
                  <ExternalLink className="w-4 h-4 text-stone-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Checkboxen */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-stone-700 leading-relaxed group-hover:text-stone-900">
                {t('consent.checkTerms')}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-stone-700 leading-relaxed group-hover:text-stone-900">
                {t('consent.checkPrivacy')}
              </span>
            </label>
          </div>

          {/* Hinweis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>{t('consent.noteHeading')}</strong> {t('consent.noteText')}
            </p>
          </div>
        </div>

        {/* Button – fixiert am unteren Rand, Safe-Area-bewusst */}
        <div
          className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 rounded-b-2xl flex-shrink-0"
          style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))' }}
        >
          <Button
            onClick={handleAccept}
            disabled={!acceptedTerms || !acceptedPrivacy || accepting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepting ? t('consent.saving') : t('consent.acceptBtn')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}