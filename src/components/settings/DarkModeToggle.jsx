import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    loadDarkMode();
  }, []);

  const loadDarkMode = async () => {
    try {
      const user = await base44.auth.me();
      const darkModeEnabled = user?.dark_mode || false;
      setIsDark(darkModeEnabled);
      
      if (darkModeEnabled) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#141414';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
      }
    } catch (error) {
      console.error('Error loading dark mode:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDark;
    
    try {
      await base44.auth.updateMe({ dark_mode: newValue });
      
      // Dark Mode sofort anwenden
      if (newValue) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#141414';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
      }
      
      setIsDark(newValue);
      
      // Seite neu laden für vollständige Anwendung
      setTimeout(() => {
        window.location.reload();
      }, 50);
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-3 p-4 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors w-full bg-white dark:bg-[#1a1a1a]"
    >
      <div className={`w-12 h-7 rounded-full transition-colors ${isDark ? 'bg-amber-600' : 'bg-stone-300'} relative`}>
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-stone-800 dark:text-stone-200">Dark Mode</div>
        <div className="text-sm text-stone-500 dark:text-stone-400">Dunkles Design aktivieren</div>
      </div>
      {isDark ? <Moon className="w-5 h-5 text-stone-600 dark:text-stone-400" /> : <Sun className="w-5 h-5 text-stone-600 dark:text-stone-400" />}
    </button>
  );
}