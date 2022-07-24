
var IncluirEncargoPage = function () {

  var EC = protractor.ExpectedConditions;
  var inputNomeEncargo = element(by.model('incluirCtrl.encargo.nome'));
  var accordionDadosDoInstrumento = element(by.id('dadosDoInstrumento'));
  var loadingBar = element(by.id('loading-bar'));
  var botaoIncluirEncargos = element(by.id('btn-abrir-Incluir-Encargos'));
  var clicarUtilizarData = element(by.model('incluirCtrl.encargo.utilizarData'));
  var tituloPagina = element(by.className('titulo-verde-header ng-binding'));
  var botaoIncluirEncargoModal = element(by.id('btn-incluir-modal-encargo'));
  var inputDataPrazoCumprimento = element(by.id('dataEncargo')).$('input.md-datepicker-input');
  var qtdIncluirEncargos = element.all(by.repeater('encargo in incluirCtrl.encargos'));
  var tituloIncluirEncargo = element(by.cssContainingText('.ng-binding','Incluir Encargos'));
  var confirmarEncargo = element(by.css('[ng-click="incluirCtrl.confirmar();"]'));

  this.dadosDoInstrumento = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 9000, 'Aguardando loading bar desaparecer');
    browser.wait(EC.visibilityOf(accordionDadosDoInstrumento), 50000);
    accordionDadosDoInstrumento.click();
    browser.waitForAngular();

  };

  this.clicarIncluirEncargos = function () {
    browser.wait(EC.visibilityOf(botaoIncluirEncargos), 50000);
    botaoIncluirEncargos.click();

  };

  this.resultadoTituloIncluirEncargo = function () {
    browser.wait(EC.visibilityOf(tituloIncluirEncargo), 50000);
    return tituloIncluirEncargo.isPresent();

  };

  this.preencherCampos = function () {
    browser.wait(EC.visibilityOf(inputNomeEncargo), 30000);
    browser.waitForAngular();
    inputNomeEncargo.sendKeys('teste');

    browser.wait(EC.visibilityOf(clicarUtilizarData));
    clicarUtilizarData.click();


  };

  this.verificarPrazoCumprimento = function() {
    browser.wait(EC.presenceOf(inputDataPrazoCumprimento),30000);
    return inputDataPrazoCumprimento.isEnabled();
  };

  this.incluirEncargoModal = function () {
    browser.wait(EC.visibilityOf(botaoIncluirEncargoModal), 50000);
    botaoIncluirEncargoModal.click();
    browser.waitForAngular();
  };

  this.resultadoIncluirEncargoModal = function () {
    browser.wait(EC.visibilityOf(botaoIncluirEncargoModal));
    return qtdIncluirEncargos.count() > 0;
  };

  this.preencherDataPrazoCumprimento = function () {
    browser.wait(EC.visibilityOf(inputNomeEncargo), 30000);
    inputNomeEncargo.sendKeys('Teste 01');
    browser.waitForAngular();

    browser.wait(EC.visibilityOf(inputDataPrazoCumprimento), 30000);
    inputDataPrazoCumprimento.sendKeys('27/10/2017');
    browser.waitForAngular();

    browser.wait(EC.visibilityOf(botaoIncluirEncargoModal), 30000);
    botaoIncluirEncargoModal.click();
    browser.waitForAngular();

    confirmarEncargo.click();


  };

};
module.exports = IncluirEncargoPage;
