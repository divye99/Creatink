/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Creatink palette — slate-blue canvas with champagne paper cards;
        // cognac is the primary action color, hermès for urgency dots.
        bg: '#8FA3BF',          // slate blue — entire canvas
        slateblue: '#8FA3BF',
        cognac: '#8B5E3C',      // primary CTA fill, active states
        hermes: '#E8600A',      // notification dots / urgency only
        champagne: '#E8D5B0',   // card surface + light text on cognac
        card: '#E8D5B0',        // champagne paper-card surface
        body: '#1A1410',        // dark warm near-black — body text on cards
        muted: '#6B5D4F',       // warm muted brown
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        // shadcn semantic tokens mapped to brand
        background: '#8FA3BF',
        foreground: '#1A1410',
        primary: { DEFAULT: '#8B5E3C', foreground: '#E8D5B0' }, // cognac CTA, champagne text
        secondary: { DEFAULT: '#E8D5B0', foreground: '#1A1410' },
        accent: { DEFAULT: '#8B5E3C', foreground: '#E8D5B0' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#E8D5B0' },
        border: '#BFA47C',     // darker tan — gives champagne cards visible edges
        input: '#E8D5B0',
        ring: '#8B5E3C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '12px', sm: '8px' },
      boxShadow: {
        cognac: '0 0 0 1px rgba(139, 94, 60, 0.55), 0 8px 24px -8px rgba(139, 94, 60, 0.35)',
        champagne: '0 8px 24px -8px rgba(232, 213, 176, 0.35)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        'fade-in': 'fade-in 600ms ease-out',
        'slide-up': 'slide-up 400ms ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
