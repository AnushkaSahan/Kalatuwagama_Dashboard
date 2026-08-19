/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f4f5f6",
          100: "#e4e6e9",
          200: "#c5c9cf",
          300: "#9aa1ab",
          400: "#69727e",
          500: "#4b535e",
          600: "#3b4149",
          700: "#32373d",
          800: "#292d33",
          850: "#23262b",
          900: "#1e2126",
          950: "#141619",
        },
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
        display: ['"Playfair Display"', "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0, 0, 0, 0.08)",
        card: "0 4px 20px -8px rgba(0, 0, 0, 0.06)",
        glass: "0 8px 32px rgba(31, 15, 15, 0.12)",
        glow: "0 0 0 1px rgba(212, 175, 55, 0.15), 0 8px 30px -6px rgba(212, 175, 55, 0.35)",
        "glow-red":
          "0 0 0 1px rgba(111, 29, 27, 0.12), 0 8px 30px -6px rgba(111, 29, 27, 0.35)",
        "card-hover":
          "0 20px 50px -20px rgba(0, 0, 0, 0.18), 0 4px 12px -4px rgba(0, 0, 0, 0.06)",
        "glow-accent": "0 0 0 1px rgba(212,175,55,0.2), 0 8px 32px -6px rgba(212,175,55,0.4)",
        "glow-primary": "0 0 0 1px rgba(111,29,27,0.2), 0 8px 32px -6px rgba(111,29,27,0.4)",
        "inner-accent": "inset 0 1px 0 rgba(212,175,55,0.12)",
        "sidebar": "4px 0 24px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #7f2323 0%, #6F1D1B 45%, #4a1311 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #e1c77a 0%, #D4AF37 50%, #9c7a27 100%)",
        "gradient-hero":
          "radial-gradient(1200px 600px at 20% -10%, rgba(212,175,55,0.28) 0%, transparent 55%), linear-gradient(135deg, #4a1311 0%, #6F1D1B 50%, #2a0d0c 100%)",
        "gradient-surface":
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
        "gradient-sidebar-dark":
          "linear-gradient(180deg, #1c1418 0%, #191114 60%, #141010 100%)",
        "gradient-sidebar-light":
          "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        "shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(212,175,55,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(212,175,55,0.5)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "slide-down": "slide-down 0.22s ease-out both",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
