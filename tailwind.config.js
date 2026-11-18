/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        qtd: {
          50: 'var(--qtd-primary-50)',
          100: 'var(--qtd-primary-100)',
          200: 'var(--qtd-primary-200)',
          300: 'var(--qtd-primary-300)',
          400: 'var(--qtd-primary-400)',
          500: 'var(--qtd-primary-500)',
          600: 'var(--qtd-primary-600)',
          700: 'var(--qtd-primary-700)',
          800: 'var(--qtd-primary-800)',
          900: 'var(--qtd-primary-900)',
          950: 'var(--qtd-primary-950)',
        },
        deep: {
          50: 'var(--qtd-deep-50)',
          100: 'var(--qtd-deep-100)',
          300: 'var(--qtd-deep-300)',
          500: 'var(--qtd-deep-500)',
          700: 'var(--qtd-deep-700)',
          900: 'var(--qtd-deep-900)',
        },
        gold: {
          50: 'var(--qtd-gold-50)',
          100: 'var(--qtd-gold-100)',
          300: 'var(--qtd-gold-300)',
          500: 'var(--qtd-gold-500)',
          700: 'var(--qtd-gold-700)',
          900: 'var(--qtd-gold-900)',
        },
        canvas: 'var(--bg-canvas)',
        subtle: 'var(--bg-subtle)',
        muted: 'var(--bg-muted)',
        inverse: 'var(--bg-inverse)',
        fg: {
          DEFAULT: 'var(--fg-default)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          inverse: 'var(--fg-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        badge: {
          basic: 'var(--badge-basic)',
          verified: 'var(--badge-verified)',
          certified: 'var(--badge-certified)',
          gold: 'var(--badge-gold)',
        },
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      fontFamily: {
        ui: ['var(--font-ui)'],
        quran: ['var(--font-quran)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'focus': 'var(--shadow-focus)',
      },
      maxWidth: {
        'container': 'var(--container-max)',
        'narrow': 'var(--container-narrow)',
      },
    },
  },
  plugins: [],
};
