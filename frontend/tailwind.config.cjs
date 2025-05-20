/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        muted: 'var(--text-secondary)',
        accent: 'var(--accent-primary)',
        hover: 'var(--bg-hover)',
        default: 'var(--border-color)',
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
        default: 'var(--border-color)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        hover: 'var(--bg-hover)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-secondary)',
      },
      animation: {
        'in': 'in 0.2s ease-out',
      },
      keyframes: {
        in: {
          '0%': { opacity: 0, transform: 'translateY(-4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 