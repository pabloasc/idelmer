'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { translations } from '@/translations';
import { motion } from 'framer-motion';

export default function SettingsPage({ onClose }: { onClose: () => void }) {
  const { locale, setLocale, isLoading } = useLocale();
  const t = translations[locale];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-newyorker-white p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-playfair font-bold">{t.settings.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif mb-3">{t.settings.language}</h3>
            <div className="space-y-2">
              <button
                onClick={() => setLocale('en')}
                disabled={isLoading}
                className={`w-full py-2 px-4 border-2 text-left font-serif
                  ${locale === 'en' 
                    ? 'border-black bg-black text-white'
                    : 'border-black text-black hover:bg-black hover:text-white'
                  } transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                English
              </button>
              <button
                onClick={() => setLocale('es')}
                disabled={isLoading}
                className={`w-full py-2 px-4 border-2 text-left font-serif
                  ${locale === 'es'
                    ? 'border-black bg-black text-white'
                    : 'border-black text-black hover:bg-black hover:text-white'
                  } transition-colors duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
