const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5000",
  },
  webServer: {
    command: "node e2e/server.js",
    url: "http://127.0.0.1:5000/api/menu",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});