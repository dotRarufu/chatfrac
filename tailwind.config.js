/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      // "light",
      // "dark",
      {
        mytheme: {
          primary: "#3C7FEB",
          secondary: "#FAFAFA",
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
