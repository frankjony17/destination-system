/**
 * Created by rogerio on 06/06/17.
 */
/**
 * Created by haillanderson on 02/06/17.
 */

var InserirParcelaPage = function () {

  var EC = protractor.ExpectedConditions;
  var loadingBar = element(by.id('loading-bar'));
  var accordionDadosdoImovelParcela = element(by.cssContainingText('.titulo-verde.negrito.ng-scope.ng-isolate-scope', 'DADOS DO IMÓVEL/PARCELA'))
  var botaoIncluirImovelParcela = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'INCLUIR IMÓVEL/PARCELA'));
  var tituloModal = element(by.cssContainingText('.ng-binding', 'Incluir Dados Imóvel Parcela'));
  var inputCodigodeUtilizacao = element(by.model('incluirDadosImovelParcelaCtrl.dadosUtilizacao'));
  var botaoSelecionar = element(by.cssContainingText('.md-raised.margin-lateral-label.md-button.md-ink-ripple', 'Selecionar'));
  var ripInvalido = element(by.cssContainingText('.ng-binding.flex', 'RIP INVÁLIDO'));
  var linkDadosImovel = element(by.cssContainingText('.hand.link.ng-binding', 'Ver dados imóvel'));
  var areaDaParcelaDoTerreno = element(by.cssContainingText('.negrito.ng-binding', '2.313,21 m²'));
  var campoFracaoIdeal = element(by.model('incluirDadosImovelParcelaCtrl.destinacaoImovel.fracaoIdeal'));
  var tabelaBenfeitoria = element.all(by.repeater('benfeitoria in incluirDadosImovelParcelaCtrl.destinacaoImovel.imovel.benfeitorias'));

  this.abrirAccordion = function () {
    browser.waitForAngularEnabled(true);
    browser.wait(EC.invisibilityOf(loadingBar), 10000);
    accordionDadosdoImovelParcela.click();
    browser.wait(EC.visibilityOf(botaoIncluirImovelParcela), 10000);
  };

  this.clicarBotaoIncluir = function () {
    botaoIncluirImovelParcela.click();
    browser.wait(EC.visibilityOf(tituloModal), 4000);
  };

  this.isAberta = function () {
    return browser.wait(EC.visibilityOf(tituloModal), 4000);
  };

  this.inserirCodigodeUtilizacao = function () {
    inputCodigodeUtilizacao.sendKeys('0000002800000000');
    botaoSelecionar.click();
    browser.wait(EC.invisibilityOf(loadingBar),10000);
  };

  this.ripValido = function () {
    return browser.wait(EC.invisibilityOf(ripInvalido), 4000);
  };

  this.comAcessoesEBenfeitorias = function () {
    return browser.wait(EC.visibilityOf(campoFracaoIdeal), 4000) && browser.wait(EC.visibilityOf(linkDadosImovel), 4000)
      && browser.wait(EC.visibilityOf(areaDaParcelaDoTerreno)) && browser.wait(EC.presenceOf(tabelaBenfeitoria), 5000, "Erro na tabela");
  };
};
module.exports = InserirParcelaPage;
