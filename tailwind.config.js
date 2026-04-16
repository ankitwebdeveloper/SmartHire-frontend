/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f4c81",
        "primary-dark": "#0a3a63",
        accent: "#2e8b57",
        "accent-light": "#4caf50",
        background: "#f8fafc",
        text: "#0f172a",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
