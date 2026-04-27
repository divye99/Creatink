/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Creatink brand palette
        bg: '#1A1A2E',
        slateblue: '#8FA3BF',
        cognac: '#B85E30',
        hermes: '#E8600A',
        champagne: '#E8D5B0',
        card: '#232338',
        body: '#F5F0E8',
        muted: '#8A8F99',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        // shadcn semantic tokens mapped to brand
        background: '#1A1A2E',
        foreground: '#F5F0E8',
        primary: { DEFAULT: '#E8D5B0', foreground: '#1A1A2E' },
        secondary: { DEFAULT: '#232338', foreground: '#F5F0E8' },
        accent: { DEFAULT: '#B85E30', foreground: '#F5F0E8' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#F5F0E8' },
        border: '#2E2E45',
        input: '#232338',
        ring: '#E8D5B0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '12px', sm: '8px' },
      boxShadow: {
        cognac: '0 0 0 1px rgba(184, 94, 48, 0.45), 0 8px 24px -8px rgba(184, 94, 48, 0.25)',
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
