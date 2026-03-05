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
          black: '#100F10',
          dark: '#242726',
          teal: '#69B7AF',
          'teal-light': '#8FCEC7',
          'teal-dark': '#4A9A92',
          light: '#E3E3E3',
          white: '#F8F8F8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
