/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000",
        white: "#fff",
        gray: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        sk: {
          1: "#FFFFFF", // White
          2: "#EAEAEA", // Light gray
          3: "#D4D4D4", // Medium gray
          4: "#333333", // Dark gray
          5: "#000000", // Black
          6: "#FFA07A", // Light salmon
          7: "#FF7F50", // Coral
          8: "#FF6347", // Tomato
          9: "#FFD700", // Gold
          10: "#FFDAB9", // Peach puff
          11: "#FFA500", // Orange
          12: "#FF8C00", // Dark orange
          13: "#FF4500", // Orange red
          14: "#ADD8E6", // Light blue
          15: "#90EE90", // Light green
          16: "#E6E6FA", // Lavender
          17: "#708090", // Slate gray
          18: "#2F4F4F", // Dark slate gray
          19: "#00BFFF", // Deep sky blue
          20: "#00CED1", // Dark turquoise
          21: "#EEE8AA", // Pale goldenrod
          22: "#B0C4DE", // Light steel blue
          23: "#BC8F8F", // Rosy brown
        },
      },
      fontFamily: {
        oswald: "var(--font-oswald) !important",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
      keyframes: {
        scale: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.5)" },
        },
      },
      animation: {
        scale: "scale 1.2s ease-in-out infinite",
        "scale-delay-1": "scale 1.2s ease-in-out infinite .4s",
        "scale-delay-2": "scale 1.2s ease-in-out infinite .8s",
      },
    },
  },
  plugins: [],
};
