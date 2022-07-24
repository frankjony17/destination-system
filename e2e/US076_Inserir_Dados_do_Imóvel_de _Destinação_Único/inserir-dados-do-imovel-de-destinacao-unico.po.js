

var imovelDestinacaoUnicoPage = function () {

  var EC = protractor.ExpectedConditions;
  var accordionDadosImovel = element(by.id('dadosImovel'));
  var inputCodigoUltilizacao = element(by.model('codigoUtilizacao'));
  var clicarSelecionar = element(by.className('md-raised margin-lateral-label margem-botoes-modal md-button md-ink-ripple'));
  var loadingBar = element(by.id('loading-bar'));
  var selecionarModalidade = element.all(by.repeater('tipoModalidade in tiposModalidades'));
  var inputModalidade= element(by.model('atendimento.tipoModalidade'));

  this.acessarCUEM = function(){
    browser.wait(EC.invisibilityOf(loadingBar), 9000);
    browser.get('http://su-spu.basis.com.br/#/destinacao/cuem');
    browser.sleep(4000);
    browser.wait(EC.presenceOf(accordionDadosImovel),5000);
    accordionDadosImovel.click();
    browser.sleep(4000);
  }
  this.preencherCodigoUltilizacao = function () {
    browser.wait(EC.presenceOf(inputCodigoUltilizacao));
    inputCodigoUltilizacao.sendKeys("0000002800000000");
    browser.wait(EC.presenceOf(inputModalidade));
    inputModalidade.click();
    browser.sleep(4000);
    selecionarModalidade.get(1).click();
    browser.sleep(4000);
    browser.wait(EC.presenceOf(clicarSelecionar));
    clicarSelecionar.click();
    browser.sleep(4000);
  }
  this.verificarCodigoDaUltizacao = function () {
    return inputCodigoUltilizacao.getText == '';

  }

}
module.exports  = imovelDestinacaoUnicoPage;
