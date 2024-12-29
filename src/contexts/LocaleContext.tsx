'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { translations } from '@/translations';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  t: () => '',
  isLoading: false,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const initializeLocale = async () => {
      // If user is logged in, try to fetch their preference
      if (user?.email) {
        try {
          const response = await fetch('/api/user/language');
          const data = await response.json();
          if (data.language) {
            setLocaleState(data.language);
            localStorage.setItem('preferredLocale', data.language);
            return;
          }
        } catch (error) {
          console.error('Error fetching language preference:', error);
        }
      }

      // If no user preference, check localStorage
      const savedLocale = localStorage.getItem('preferredLocale');
      if (savedLocale) {
        setLocaleState(savedLocale);
        return;
      }

      // Otherwise, detect from browser/timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const spanishTimeZones = [
        'America/Argentina',
        'America/Buenos_Aires',
        'America/Bogota',
        'America/Caracas',
        'America/Lima',
        'America/Mexico_City',
        'America/Santiago',
        'Europe/Madrid',
      ];

      const isSpanishTimeZone = spanishTimeZones.some(zone => 
        timeZone.startsWith(zone)
      );
      const browserLang = navigator.language.toLowerCase();
      const isSpanishLanguage = browserLang.startsWith('es');

      if (isSpanishTimeZone || isSpanishLanguage) {
        setLocaleState('es');
        localStorage.setItem('preferredLocale', 'es');
      }
    };

    initializeLocale();
  }, [user]);

  const handleSetLocale = async (newLocale: string) => {
    setIsLoading(true);
    
    try {
      if (user?.email) {
        // Update in database if user is logged in
        const response = await fetch('/api/user/language', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: newLocale }),
        });

        if (!response.ok) {
          throw new Error('Failed to update language preference');
        }
      }

      // Update local state and storage
      setLocaleState(newLocale);
      localStorage.setItem('preferredLocale', newLocale);
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value as string;
  };

  return (
    <LocaleContext.Provider 
      value={{ 
        locale, 
        setLocale: handleSetLocale, 
        t,
        isLoading 
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
