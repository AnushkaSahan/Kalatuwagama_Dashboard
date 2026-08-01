/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f2",
          100: "#fce4e4",
          200: "#f8cdcd",
          300: "#f0a8a8",
          400: "#e37777",
          500: "#d14e4e",
          600: "#b83535",
          700: "#9a2a2a",
          800: "#7f2323",
          900: "#6F1D1B",
          950: "#4a1311",
        },
        accent: {
          DEFAULT: "#D4AF37",
          50: "#fbf6e8",
          100: "#f5edc9",
          200: "#ecdba4",
          300: "#e1c77a",
          400: "#d6b354",
          500: "#D4AF37",
          600: "#b8942f",
          700: "#9c7a27",
          800: "#80601f",
          900: "#644617",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        sinhala: ['"Noto Sans Sinhala"', "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0, 0, 0, 0.08)",
        card: "0 4px 20px -8px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
