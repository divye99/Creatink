/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Creatink palette — luxury editorial. Materials, not a theme.
        // Black = space, champagne = paper, cognac = leather, blue = fabric.
        bg: '#121417',          // charcoal/ink — the canvas (not pure black)
        slateblue: '#8FA3BF',   // light slate — wordmarks + headings accent
        inkslate: '#2F3E55',    // deeper ink slate — accent SURFACES only
        cognac: '#8B5E3C',      // leather — small highlights, never large fills
        hermes: '#E8600A',      // notification dots / urgency only — used sparingly
        champagne: '#F2E7D3',   // paper — warmer, lighter, less yellow than before
        card: '#1A1C1F',        // very subtle charcoal card (cleaner than before)
        body: '#F5F0E8',        // cream body text on dark surfaces
        muted: '#6F7480',       // calmer cool muted (was #8A8F99 — too cold)
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',

        // shadcn semantic tokens mapped to brand
        background: '#121417',
        foreground: '#F5F0E8',
        primary: { DEFAULT: '#F2E7D3', foreground: '#121417' },
        secondary: { DEFAULT: '#1A1C1F', foreground: '#F5F0E8' },
        accent: { DEFAULT: '#8B5E3C', foreground: '#F5F0E8' },
        destructive: { DEFAULT: '#E74C3C', foreground: '#F5F0E8' },
        border: '#2A2D31',     // soft divider — luxury hairline
        input: '#1A1C1F',
        ring: '#F2E7D3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '10px', md: '6px', sm: '3px' },
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
