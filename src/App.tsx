// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import { AppRouter } from '@/router';
import { ThemeCustomizerFloatingButton } from '@/components/theme/ThemeCustomizerFloatingButton';

export const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { theme } = useThemeStore();

  // Sync HTML lang and dir attributes
  useEffect(() => {
    const isRtl = i18n.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Sync Theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
        <ThemeCustomizerFloatingButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
