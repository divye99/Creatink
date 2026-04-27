/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Creatink brand palette — dark warm canvas, slate-blue + cognac + champagne as accents
        bg: '#0E0E0F',
        slateblue: '#8FA3BF',
        cognac: '#8B5E3C',
        hermes: '#E8600A',
        champagne: '#E8D5B0',
        card: '#16130F',
        body: '#F5F0E8',
        muted: '#8A8F99',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        // shadcn semantic tokens mapped to brand
        background: '#0E0E0F',
        foreground: '#F5F0E8',
        primary: { DEFAULT: '#E8D5B0', foreground: '#0E0E0F' },
        secondary: { DEFAULT: '#16130F', foreground: '#F5F0E8' },
        accent: { DEFAULT: '#8B5E3C', foreground: '#F5F0E8' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#F5F0E8' },
        border: '#26221C',
        input: '#16130F',
        ring: '#E8D5B0',
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
