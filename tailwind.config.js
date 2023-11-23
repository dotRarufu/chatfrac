/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        mercury: {
          "0%": { transform: "translateY(0px)", backgroundColor: "#6CAD96" },
          "28%": { transform: "translateY(-7px)", backgroundColor: "#9ECAB9" },
          "44%": { transform: "translateY(0px)", backgroundColor: "#B5D9CB" },
        },
      },
      fontFamily: {
        gagalin: ["'Mukta'", "sans-serif"],
        sans: [
          "'Source Serif 4'",
          '"Inter"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  daisyui: {
    themes: [
      // "light",
      // "dark",
      {
        mytheme: {
          primary: "#BE7EE4",
          secondary: "#FFFBF0",
          accent: "#1d54ba",
          neutral: "#201c22",
          "base-100": "#C0C0C0",
          info: "#41b0dc",
          success: "#129b7e",
          warning: "#d99a08",
          error: "#f16a6e",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
