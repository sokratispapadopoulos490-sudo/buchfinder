import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export function useTranslatedText(textMap) {
  const { language, translateObject } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState(textMap);

  useEffect(() => {
    const translate = async () => {
      if (language === 'de') {
        setTranslatedTexts(textMap);
        return;
      }

      const translated = await translateObject(textMap, language);
      setTranslatedTexts(translated);
    };

    translate();
  }, [language]);

  return translatedTexts;
}