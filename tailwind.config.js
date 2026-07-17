/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SkillBridge brand palette
        brand: {
          50: '#EFFDF9',
          100: '#D7F9EF',
          200: '#B0F2E0',
          300: '#7CE5CC',
          400: '#42D1B3',
          500: '#1AB899',
          600: '#0E9A80',
          700: '#0C7C68',
          800: '#0D6355',
          900: '#0E5147',
        },
        accent: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        sunset: {
          400: '#FB923C',
          500: '#F97316',
        },

        // Legacy tokens (keep for backward compatibility)
        primary: "#0d9488", // teal
        secondary: "#6366f1", // indigo
        dark: "#1f2937",
        light: "#f9fafb",
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

