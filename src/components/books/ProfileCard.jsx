import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Clock, Target } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function ProfileCard({ profile }) {
  const { t } = useLanguage();

  const topicLabels = {
    persoenliche_entwicklung: t('q.topic.persoenliche_entwicklung'),
    stress_ruhe: t('q.topic.stress_ruhe'),
    fokus_produktivitaet: t('q.topic.fokus_produktivitaet'),
    beziehung_kommunikation: t('q.topic.beziehung_kommunikation'),
    sinn_philosophie: t('q.topic.sinn_philosophie'),
    koerper_gesundheit: t('q.topic.koerper_gesundheit'),
    lernen_wissen: t('q.topic.lernen_wissen'),
    kreativitaet: t('q.topic.kreativitaet'),
    fantasy_scifi: t('q.topic.fantasy_scifi'),
    thriller_krimi: t('q.topic.thriller_krimi'),
    romance: t('q.topic.romance'),
    historisch: t('q.topic.historisch'),
    literatur: t('q.topic.literatur'),
    humor: t('q.topic.humor'),
    abenteuer: t('q.topic.abenteuer.kids'),
    freundschaft: t('q.topic.freundschaft.kids'),
    magie: t('q.topic.magie'),
    lustiges: t('q.topic.lustiges'),
    tiere: t('q.topic.tiere'),
    selbstfindung: t('q.topic.selbstfindung'),
    gesellschaft: t('q.topic.gesellschaft'),
    liebe: t('q.topic.liebe'),
  };

  const styleLabels = {
    praktisch: t('profile.style.praktisch'),
    wissenschaftlich: t('profile.style.wissenschaftlich'),
    story: t('profile.style.story'),
    reflektierend: t('profile.style.reflektierend'),
    kurz: t('profile.style.kurz'),
    anspruchsvoll: t('profile.style.anspruchsvoll'),
  };

  const difficultyLabels = {
    einsteiger: t('profile.diff.einsteiger'),
    fortgeschritten: t('profile.diff.fortgeschritten'),
    erfahren: t('profile.diff.erfahren'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-8 max-w-xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </div>
        <h3 className="text-xl font-light text-stone-800 dark:text-stone-100">{t('profile.title')}</h3>
      </div>

      <div className="space-y-6">
        {/* Hauptthemen */}
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-3">
            <Target className="w-4 h-4" />
            <span>{t('profile.mainTopics')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.mainTopics.map(topic => (
              <span
                key={topic}
                className="px-4 py-2 bg-stone-800 text-white text-sm rounded-full"
              >
                {topicLabels[topic] || topic}
              </span>
            ))}
          </div>
        </div>

        {/* Stil */}
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>{t('profile.preferredStyle')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.style.map(s => (
              <span
                key={s}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm rounded-full"
              >
                {styleLabels[s] || s}
              </span>
            ))}
          </div>
        </div>

        {/* Schwierigkeit */}
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-3">
            <Clock className="w-4 h-4" />
            <span>{t('profile.depth')}</span>
          </div>
          <span className="px-4 py-2 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm rounded-full border border-stone-200 dark:border-stone-700">
            {difficultyLabels[profile.difficulty] || profile.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
}