import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function ConsentModal({ onAccept }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const navigate = useNavigate();

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
      // Fehler still ignorieren – Nutzer kann es erneut versuchen
      console.error('Error accepting terms:', error);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white">
          <Shield className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-light mb-2">Willkommen bei Book Compass</h2>
          <p className="text-amber-100">
            Bevor du die App nutzen kannst, bitten wir dich, unseren rechtlichen Hinweisen zuzustimmen.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-stone-50 rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-stone-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Rechtliche Dokumente
            </h3>
            
            <div className="space-y-3">
              <a
                href="/Legal?section=terms"
                target="_blank"
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-500 transition-colors"
              >
                <span className="text-sm text-stone-700">Nutzungsbedingungen</span>
                <ExternalLink className="w-4 h-4 text-stone-400" />
              </a>

              <a
                href="/Legal?section=privacy"
                target="_blank"
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-500 transition-colors"
              >
                <span className="text-sm text-stone-700">Datenschutzerklärung</span>
                <ExternalLink className="w-4 h-4 text-stone-400" />
              </a>

              <a
                href="/Legal?section=community"
                target="_blank"
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-500 transition-colors"
              >
                <span className="text-sm text-stone-700">Community-Richtlinien</span>
                <ExternalLink className="w-4 h-4 text-stone-400" />
              </a>

              <a
                href="/Legal?section=imprint"
                target="_blank"
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-500 transition-colors"
              >
                <span className="text-sm text-stone-700">Impressum</span>
                <ExternalLink className="w-4 h-4 text-stone-400" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-sm text-stone-700 leading-relaxed group-hover:text-stone-900">
                Ich habe die <strong>Nutzungsbedingungen</strong> gelesen und akzeptiere sie. 
                Ich verstehe, dass ich durch die Nutzung der App diesen Bedingungen zustimme.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-sm text-stone-700 leading-relaxed group-hover:text-stone-900">
                Ich habe die <strong>Datenschutzerklärung</strong> gelesen und verstehe, wie meine Daten 
                verarbeitet werden. Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.
              </span>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Hinweis:</strong> Du kannst deine Zustimmung jederzeit widerrufen, indem du dein Konto löschst. 
              Die Dokumente sind jederzeit über die App einsehbar.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-stone-200 bg-stone-50">
          <Button
            onClick={handleAccept}
            disabled={!acceptedTerms || !acceptedPrivacy || accepting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepting ? 'Wird gespeichert...' : 'Zustimmen und fortfahren'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}