/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        wood: {
          100: '#f7f1e5',
          200: '#eddcc2',
          300: '#dec297',
          400: '#caa36c',
          500: '#b68449',
          600: '#9b6a38',
          700: '#7c502c',
          800: '#5c3921',
          900: '#3d2516',
        }
      },
      fontFamily: {
        oriental: ['"Noto Serif TC"', '"Songti SC"', '"STSong"', 'serif'],
        sans: ['"Inter"', '"Noto Sans TC"', 'sans-serif'],
      },
      keyframes: {
        ripple: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.08)', opacity: '0.9' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(234, 179, 8, 0.6)' },
          '50%': { boxShadow: '0 0 25px rgba(234, 179, 8, 0.95)' },
        }
      },
      animation: {
        ripple: 'ripple 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s infinite',
      }
    },
  },
  plugins: [],
}
