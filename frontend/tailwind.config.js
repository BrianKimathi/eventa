/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          primary: '#4f46e5',
          primaryHover: '#4338ca',
          accent: '#0284c7',
        }
      }
    },
  },
  plugins: [],
}
