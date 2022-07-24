/**
 * Created by rogerio on 01/06/17.
 */
var InserirDadosUtilizacao = function () {

  var EC = protractor.ExpectedConditions;
  var loadingBar = element(by.id('loading-bar'));
  var acordion = element(by.cssContainingText('.titulo-verde.negrito.ng-scope.ng-isolate-scope', 'DADOS DA UTILIZAÇÃO'));
  var labelTipo = element(by.cssContainingText('.ng-binding.md-required', 'Tipo:'));
  var inputTipo = element(by.name('Tipo'));
  var labelSubtipo = element(by.cssContainingText('.ng-binding.md-required','Subtipo:'));
  var inputSubtipo = element(by.name('Subtipo'));
  var mensagemAtencao = element(by.cssContainingText('.ng-binding', 'Você está em Unidade/instalação de Segurança e Defesa. Confira se alguma das categorias disponibilizadas atende a utilização a ser cadastrada.'));
  var labelEspecificarTipo = element(by.cssContainingText('.ng-binding.md-required', 'Especificar tipo da utilização:'));
  var comboBoxNaoSeAplica = element(by.model('naoSeAplica'));
  var inputDescricaoFinalidade = element(by.name('Descrição da Finalidade'));

  this.abrirAcordion = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 4000);
    browser.wait(EC.visibilityOf(acordion), 4000);
    acordion.click();
  };

  this.acordionAberto = function () {
    return browser.wait(EC.visibilityOf(labelTipo),2000, "Campo não Apareceu");
  };

  this.preencherTipo = function () {
    browser.wait(EC.visibilityOf(inputTipo), 4000);
    inputTipo.sendKeys("Unidade/instalação de Segurança e Defesa");
    inputTipo.sendKeys(protractor.Key.DOWN, protractor.Key.ENTER);
    browser.wait(EC.visibilityOf(inputSubtipo),4000);
  };

  this.subTipoIsPresent = function () {
    return browser.wait(EC.visibilityOf(labelSubtipo), 4000);
  };

  this.preencherSubtipo = function () {
    inputSubtipo.sendKeys("Outr");
    inputSubtipo.sendKeys(protractor.Key.DOWN, protractor.Key.ENTER);
    browser.wait(EC.visibilityOf(mensagemAtencao),4000);
  };

  this.msgAtencaoAndCampoEspcifiIsVisivel = function () {
    return browser.wait(EC.visibilityOf(mensagemAtencao), 4000) && browser.wait(EC.visibilityOf(labelEspecificarTipo),4000);
  };

  this.naoSeAplica = function () {
    comboBoxNaoSeAplica.click();
  };

  this.descricaoFinalidadeDesabilidado = function () {
    return inputDescricaoFinalidade.isEnabled();
  };


};
module.exports = InserirDadosUtilizacao;
