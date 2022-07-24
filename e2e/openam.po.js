var OpenAMPage = function () {

  var EC = protractor.ExpectedConditions;

  this.logar = function (cpf, senha) {
    browser.driver.wait(
      EC.presenceOf(element(by.css('#idToken1'))),
      15000
    );

    browser.driver.findElement(by.css('#idToken1')).sendKeys(cpf);
    browser.driver.findElement(by.css('#idToken2')).sendKeys(senha);

    var botaoLogin = browser.driver.findElement(by.id('loginButton_0'));

    return botaoLogin.click().then(function () {
        browser.sleep(2000);
        browser.get('http://su-spu.basis.com.br/#');
        browser.sleep(2000);
      }
    );
  }
};

module.exports = OpenAMPage;
