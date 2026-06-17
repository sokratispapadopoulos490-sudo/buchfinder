import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';

export default function ReportModal({ post, onClose, onReported }) {
  const [reason, setReason] = useState('spam');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const reasons = [
    { value: 'spam', label: t('report.reason.spam') },
    { value: 'inappropriate', label: t('report.reason.inappropriate') },
    { value: 'harassment', label: t('report.reason.harassment') },
    { value: 'misinformation', label: t('report.reason.misinformation') },
    { value: 'other', label: t('report.reason.other') },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Report.create({
        post_id: post.id,
        reason,
        description: description.trim()
      });
      onReported();
      onClose();
    } catch (error) {
      console.error('Error reporting post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-md w-full"
      >
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-light text-stone-800">{t('report.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {t('report.reasonLabel')}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {t('report.descLabel')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('report.descPlaceholder')}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            />
          </div>
        </div>

        <div className="p-6 border-t border-stone-200 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            {t('report.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? t('report.submitting') : t('report.submit')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}