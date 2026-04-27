/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // WHOOP-style: near-black canvas, dark cards, champagne hero numbers,
        // slate-blue secondary accent, cognac for hairline borders, hermes for CTAs.
        bg: '#080808',
        slateblue: '#8FA3BF',
        surface2: '#161616',
        inkslate: '#161616',
        cognac: '#8B5E3C',
        hermes: '#E8600A',
        champagne: '#E8D5B0',
        card: '#111111',
        body: '#F5F0E8',
        muted: '#444444',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        background: '#080808',
        foreground: '#F5F0E8',
        primary: { DEFAULT: '#E8600A', foreground: '#F5F0E8' },
        secondary: { DEFAULT: '#161616', foreground: '#F5F0E8' },
        accent: { DEFAULT: '#8B5E3C', foreground: '#F5F0E8' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#F5F0E8' },
        border: 'rgba(139, 94, 60, 0.25)',
        input: '#161616',
        ring: '#E8600A',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '10px', sm: '6px' },
      boxShadow: {
        cognac: '0 0 20px rgba(139, 94, 60, 0.08)',
        glow: '0 0 24px rgba(139, 94, 60, 0.12)',
        champagne: '0 0 24px rgba(232, 213, 176, 0.08)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0.55 },
        },
      },
      animation: {
        'fade-in':   'fade-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up':   'slide-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up':  'slide-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-slow': 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
