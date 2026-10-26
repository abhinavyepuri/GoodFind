import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rate: 0.012 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.011 },
};

export const LANGUAGES = {
  en: { code: 'en', label: 'English', flag: '🇮🇳' },
  hi: { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
};

export const usePreferenceStore = create(
  persist(
    (set, get) => ({
      currency: 'INR',
      language: 'en',

      setCurrency: (currency) => {
        if (CURRENCIES[currency]) set({ currency });
      },

      setLanguage: (language) => {
        if (LANGUAGES[language]) set({ language });
      },

      formatPriceWithPreference: (amountInInr) => {
        const { currency } = get();
        const info = CURRENCIES[currency] || CURRENCIES.INR;
        const converted = amountInInr * info.rate;

        const locale = currency === 'INR' ? 'en-IN' : currency === 'EUR' ? 'de-DE' : 'en-US';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: info.code,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(converted);
      },
    }),
    {
      name: 'goodfind-user-preferences',
    }
  )
);
