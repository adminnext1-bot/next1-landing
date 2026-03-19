/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8CC7A',
          dark:    '#9B7A2A',
          pale:    'rgba(201,168,76,0.08)',
        },
        ink: {
          DEFAULT: '#080808',
          2:       '#111111',
          3:       '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        revealIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.8s ease forwards',
        'ticker':    'ticker 32s linear infinite',
        'reveal':    'revealIn 0.7s ease forwards',
      },
    },
  },
  plugins: [],
};
