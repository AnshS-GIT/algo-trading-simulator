/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D0D12',
        'brand-darkern': '#09090B',
        'brand-primary': '#6366F1', // Indigo
        'brand-secondary': '#A855F7', // Purple
        'brand-accent': '#22C55E', // Green
        'brand-danger': '#EF4444', // Red
      }
    },
  },
  plugins: [],
}
