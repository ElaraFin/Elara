/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: { elara: '#101010', accent: '#8B5CF6', lime: '#B8FF5C' },
      boxShadow: { soft: '0 22px 80px rgba(0,0,0,0.12)' }
    }
  },
  plugins: []
};
