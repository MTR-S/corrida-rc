/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pit: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#38bdf8',
        },
        bleachers: {
          light: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          accent: '#0284c7',
        }
      }
    },
  },
  plugins: [],
}
