import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ratq: ['Ratq', 'var(--font-plex-sans-arabic)', 'sans-serif'],
        plexArabic: ['Ratq', 'var(--font-plex-sans-arabic)', 'sans-serif'],
        heading: ['Ratq', 'var(--font-plex-sans-arabic)', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#d3e8de',
          200: '#a7d1bb',
          300: '#70b391',
          400: '#45956e',
          500: '#287652',
          600: '#1d5b3f',
          700: '#194833',
          800: '#163a2b',
          900: '#143024',
          950: '#0a1e15',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f9f4ea',
          200: '#f2e8d4',
          300: '#e8d7b5',
          400: '#dbbf8a',
          500: '#cfaa6b',
          600: '#bf904d',
          700: '#a2723c',
          800: '#845a33',
          900: '#6b4a2d',
          950: '#3b2516',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
