/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#556B2F",
        accent: "#D4AF37",
        "background-light": "#FAF0E6",
        "background-dark": "#1a1d15",
        "text-color": "#38471F",
        "text-light": "#38471F",
        "text-dark": "#faf0e6",
        "heading": "#556B2F",
        "rich-olive": "#556B2F",
        "dark-olive": "#38471F",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-10%)' },
        },
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
    },
  },
  plugins: [],
}

