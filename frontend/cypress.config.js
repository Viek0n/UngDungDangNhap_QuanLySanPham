const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    video: true,
    baseUrl: 'http://localhost:5173', 
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
