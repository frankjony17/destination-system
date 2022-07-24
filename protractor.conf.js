//protractor.conf.js
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./*/*/*.e2e-spec.js'],
    getPageTimeout: 45000,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 45000,
      showColors:true
    },

    capabilities: {
      browserName: 'chrome'
    },
    suites: {
      destinacao: '/**/*.e2e-spec.js'
    },
    onPrepare: function () {
      browser.driver.manage().window().maximize();
       //abre login
      browser.driver.get('http://su-spu.basis.com.br/#/destinacao');
      browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('loading-bar'))), 5000);
      browser.waitForAngularEnabled(false);
      //insere informações no campo de login
      browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('#idToken1'))),15000);
      browser.driver.findElement(by.css('#idToken1')).sendKeys('61914509153');
      browser.driver.findElement(by.css('#idToken2')).sendKeys('123456789');
      browser.driver.findElement(by.css('#loginButton_0')).click();
      return browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('breadcrumb'))), 20000);
  }
};
