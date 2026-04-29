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
        slateblue: '#7E907A',           // Ironwood
        surface2: '#161311',
        inkslate: '#161311',
        cognac: '#8E4A2F',              // Mesa Clay — borders, hairlines
        hermes: '#A85539',              // Mesa Clay vivid — energy / dot
        champagne: '#B58A2B',           // Prairie Gold — primary text on dark
        card: '#111111',
        body: '#ECDFC2',                // Creme
        muted: '#BCA286',               // Stone
        success: '#7E907A',           // Ironwood sage — aligned with the palette
        warning: '#D4A574',
        error: '#A85539',

        // Named aliases (for use directly when desired)
        mesa:    '#8E4A2F',
        prairie: '#B58A2B',
        creme:   '#ECDFC2',
        stone:   '#BCA286',
        ironwood:'#7E907A',

        background: '#080808',
        foreground: '#ECDFC2',
        primary:    { DEFAULT: '#A85539', foreground: '#ECDFC2' },
        secondary:  { DEFAULT: '#161311', foreground: '#ECDFC2' },
        accent:     { DEFAULT: '#8E4A2F', foreground: '#ECDFC2' },
        destructive:{ DEFAULT: '#A85539', foreground: '#ECDFC2' },
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
        champagne: '0 0 24px rgba(181, 138, 43, 0.10)',
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
