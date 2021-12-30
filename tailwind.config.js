module.exports = {
  mode: "jit", // this will enable Tailwind JIT compiler to make the build faster
  purge: ["./app/**/*.{ts,tsx}"], // Here we are going to tell Tailwind to use any .ts or .tsx file to purge the CSS
  darkMode: "media", // Use media queries for dark mode, customize it as you want
  theme: {
    extend: {
      colors: {
        exun: "#2977f5",
        "exun-dark": "#2977f5",
        "exun-light": "#2977f5",
      },
      fontFamily: {
        sans: [
          "Spline Sans",
          "monospace",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          '"Open Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
    },
  }, // customize the theme however you want here
  plugins: [], // add any plugin you need here
};
