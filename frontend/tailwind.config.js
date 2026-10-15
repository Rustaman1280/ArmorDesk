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
        canvas: '#09090B',
        surface: {
          DEFAULT: '#111114',
          subtle: '#0E0E11',
          elevated: '#18181C',
          hover: '#1F1F24',
          active: '#27272E',
        },
        border: {
          hairline: 'rgba(255, 255, 255, 0.07)',
          subtle: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Geist Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'hairline': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'elevated': '0 1px 2px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
