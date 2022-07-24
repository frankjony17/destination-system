/**
 * Created by samuel on 01/06/17.
 */
var DadosLicitacaoPage = function () {

  var EC = protractor.ExpectedConditions;
  var inputNumeroProcessoAtendimento = element(by.model('atendimento.numeroProcedimento'));
  var inputNumeroProcessoLicitacao = element(by.model('licitacao.numeroProcesso'));
  var accordionLicitacao = element(by.id('accordion-licitacao-venda'));

  //Insere número do processo atendimento
  this.insereNumeroProcesso = function () {
    browser.wait(EC.presenceOf(inputNumeroProcessoAtendimento));
    inputNumeroProcessoAtendimento.sendKeys('4000');

  }

  this.abrirAcordionVendas = function () {
    browser.wait(EC.visibilityOf(accordionLicitacao), 10000);
    accordionLicitacao.click();
    browser.sleep(2000);
  }

  this.getNumeroProcessoLicitacao = function () {
    return inputNumeroProcessoLicitacao.getText();
  }

  this.getNumeroProcessoAtendimento = function(){
    return inputNumeroProcessoAtendimento.getText();
  }

};

module.exports = DadosLicitacaoPage;
