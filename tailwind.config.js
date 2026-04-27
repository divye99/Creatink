/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Slate canvas + champagne paper cards. Cognac is the action color
        // (warm, saturated against the soft canvas), hermès for urgency dots.
        bg: '#8FA3BF',          // slate blue — entire canvas
        slateblue: '#8FA3BF',
        inkslate: '#2F3E55',    // deeper accent surface (kept for future use)
        cognac: '#8B5E3C',      // primary CTA fill, active states, links
        hermes: '#E8600A',      // notification dots / urgency only
        champagne: '#F2E7D3',   // card surface + light text on cognac
        card: '#F2E7D3',        // champagne paper-card surface
        body: '#1A1410',        // dark warm near-black — body text on cards
        muted: '#6B5D4F',       // warm muted brown
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        // shadcn semantic tokens mapped to brand
        background: '#8FA3BF',
        foreground: '#1A1410',
        primary: { DEFAULT: '#8B5E3C', foreground: '#F2E7D3' }, // cognac CTA, champagne text
        secondary: { DEFAULT: '#F2E7D3', foreground: '#1A1410' },
        accent: { DEFAULT: '#8B5E3C', foreground: '#F2E7D3' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#F2E7D3' },
        border: '#BFA47C',     // darker tan — gives champagne cards visible edges
        input: '#F2E7D3',
        ring: '#8B5E3C',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '6px', md: '4px', sm: '2px' },
      boxShadow: {
        cognac: '0 0 0 1px rgba(139, 94, 60, 0.55), 0 8px 24px -8px rgba(139, 94, 60, 0.35)',
        champagne: '0 8px 24px -8px rgba(232, 213, 176, 0.35)',
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
