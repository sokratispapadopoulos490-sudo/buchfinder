import React from 'react';
import { LanguageProvider } from './language/LanguageContext';

export default function App({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}