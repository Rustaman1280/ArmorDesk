/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: '#0F172A',
        cardBorder: '#1E293B',
        accentBorder: '#334155',
        primary: '#3B82F6',
        emerald: {
          500: '#10B981',
          900: '#064E3B',
        },
        amber: {
          500: '#F59E0B',
          900: '#78350F',
        },
        rose: {
          500: '#F43F5E',
          900: '#881337',
        }
      },
    },
  },
  plugins: [],
};
