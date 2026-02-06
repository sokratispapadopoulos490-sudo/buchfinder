import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export default function TranslatedText({ children, className }) {
  const { translate, language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language === 'de') {
      setTranslatedText(children);
      return;
    }

    const translateText = async () => {
      setIsTranslating(true);
      const result = await translate(children);
      setTranslatedText(result);
      setIsTranslating(false);
    };

    translateText();
  }, [children, language]);

  return (
    <span className={className}>
      {isTranslating ? children : translatedText}
    </span>
  );
}