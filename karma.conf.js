// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
/* global __dirname, require */

if (!process.env.CHROME_BIN) {
  const fs = require('fs');
  const candidates = [];

  try {
    candidates.push(require('puppeteer').executablePath());
  } catch (error) {
    // Puppeteer é opcional quando existe Chrome instalado no sistema.
  }

  if (process.platform === 'win32') {
    candidates.push(
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    );
  }

  process.env.CHROME_BIN = candidates.find(candidate => fs.existsSync(candidate));

  if (!process.env.CHROME_BIN) {
    console.warn(
      '[karma] Chrome não encontrado no Puppeteer, no ambiente ou nas instalações padrão do sistema.'
    );
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [{ type: 'html' }, { type: 'lcovonly' }, { type: 'text-summary' }],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
      },
    },
    singleRun: false,
    restartOnFileChange: true,
  });
};
