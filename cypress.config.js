const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  videoCompression: false,
  screenshotOnRunFailure: true,

  defaultCommandTimeout: 15000,
  requestTimeout: 10000,
  responseTimeout: 15000,
  pageLoadTimeout: 45000,

  retries: {
    runMode: 0,
    openMode: 0
  },

  defaultBrowser: 'chrome',
  numTestsKeptInMemory: 0,
  chromeWebSecurity: false,
  // allowCypressEnv: false,

  //  REQUIRED FOR MOCHAWESOME
  reporter: "cypress-mochawesome-reporter",


  e2e: {
    baseUrl: 'https://pricelabs.co',
    viewportWidth: 1920,
    viewportHeight: 1080,


    setupNodeEvents(on, config) {

      //  REQUIRED FOR MOCHAWESOME
      require('cypress-mochawesome-reporter/plugin')(on);

      // Browser optimization
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-background-timer-throttling');
          launchOptions.args.push('--disable-application-cache');
          launchOptions.args.push('--disable-cache');
          launchOptions.args.push('--disable-http-cache');
          launchOptions.args.push('--disk-cache-size=0');
          launchOptions.args.push('--memory-pressure-off');
          launchOptions.args.push('--max_old_space_size=4096');
        }
        return launchOptions;
      });

      return config;
    }
  }
});