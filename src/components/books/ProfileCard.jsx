import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Clock, Target } from 'lucide-react';

const topicLabels = {
  persoenliche_entwicklung: "Persönliche Entwicklung",
  stress_ruhe: "Ruhe & Entspannung",
  fokus_produktivitaet: "Fokus & Produktivität",
  beziehung_kommunikation: "Beziehungen",
  sinn_philosophie: "Sinn & Philosophie",
  koerper_gesundheit: "Körper & Gesundheit",
  lernen_wissen: "Lernen & Wissen",
  kreativitaet: "Kreativität",
  finanzen_organisation: "Organisation"
};

const styleLabels = {
  praktisch: "Praktisch umsetzbar",
  wissenschaftlich: "Wissenschaftlich fundiert",
  story: "Erzählerisch",
  reflektierend: "Zum Nachdenken",
  kurz: "Kompakt",
  anspruchsvoll: "Tiefgehend"
};

const difficultyLabels = {
  einsteiger: "Einsteiger",
  fortgeschritten: "Fortgeschritten",
  erfahren: "Sehr erfahren"
};

export default function ProfileCard({ profile }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-stone-200 p-8 max-w-xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-stone-600" />
        </div>
        <h3 className="text-xl font-light text-stone-800">Dein Leseprofil</h3>
      </div>

      <div className="space-y-6">
        {/* Hauptthemen */}
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
            <Target className="w-4 h-4" />
            <span>Deine Hauptthemen</span>
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
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Bevorzugter Stil</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.style.map(s => (
              <span 
                key={s}
                className="px-4 py-2 bg-stone-100 text-stone-700 text-sm rounded-full"
              >
                {styleLabels[s] || s}
              </span>
            ))}
          </div>
        </div>

        {/* Schwierigkeit */}
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
            <Clock className="w-4 h-4" />
            <span>Empfohlene Tiefe</span>
          </div>
          <span className="px-4 py-2 bg-stone-50 text-stone-600 text-sm rounded-full border border-stone-200">
            {difficultyLabels[profile.difficulty] || profile.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
}