/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ebe2ff",
          200: "#d6c5ff",
          300: "#c2a8ff",
          400: "#ad8bff",
          500: "#986eff", // pastel purple main
          600: "#7a59cc",
        },
      },
    },
  },
  plugins: [],
};
