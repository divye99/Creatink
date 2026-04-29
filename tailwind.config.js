/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Southwest desert palette:
        //   Mesa Clay (terracotta) — borders + energy moments    -> cognac / hermes
        //   Prairie Gold (warm tan) — primary text, hero numbers  -> champagne
        //   Creme (off-white) — headings, names                   -> body / foreground
        //   Stone (warm beige) — secondary text, muted labels     -> muted
        //   Ironwood (cool sage) — verified, slate accents        -> slateblue
        // Background and dark cards stay near-black.
        bg: '#080808',
        slateblue: '#8E9A8B',           // Ironwood
        surface2: '#161311',
        inkslate: '#161311',
        cognac: '#8E4A2F',              // Mesa Clay — borders, hairlines
        hermes: '#A85539',              // Mesa Clay vivid — energy / dot
        champagne: '#D4B07A',           // Prairie Gold — primary text on dark
        card: '#111111',
        body: '#F4ECDC',                // Creme
        muted: '#A89B85',               // Stone
        success: '#7BAA7E',
        warning: '#D4A574',
        error: '#A85539',

        // Named aliases (for use directly when desired)
        mesa:    '#8E4A2F',
        prairie: '#D4B07A',
        creme:   '#F4ECDC',
        stone:   '#A89B85',
        ironwood:'#8E9A8B',

        background: '#080808',
        foreground: '#F4ECDC',
        primary:    { DEFAULT: '#A85539', foreground: '#F4ECDC' },
        secondary:  { DEFAULT: '#161311', foreground: '#F4ECDC' },
        accent:     { DEFAULT: '#8E4A2F', foreground: '#F4ECDC' },
        destructive:{ DEFAULT: '#A85539', foreground: '#F4ECDC' },
        border: 'rgba(142, 74, 47, 0.25)',
        input: '#161311',
        ring: '#A85539',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        editorial: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '10px', sm: '6px' },
      boxShadow: {
        cognac: '0 0 20px rgba(142, 74, 47, 0.10)',
        glow: '0 0 24px rgba(142, 74, 47, 0.14)',
        champagne: '0 0 24px rgba(212, 176, 122, 0.10)',
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
