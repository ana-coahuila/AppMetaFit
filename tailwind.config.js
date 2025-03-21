/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'metafit-blue': '#a3d8f4',
        'metafit-blue-dark': '#7cc0e8',
        'metafit-green': '#b5e8b5',
        'metafit-green-dark': '#8ad68a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};