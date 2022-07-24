/**
 * Created by haillanderson on 02/06/17.
 */

var VendaPage = function () {

  var EC = protractor.ExpectedConditions;
  var mensagemErro = element(by.css('[md-theme="error-toast"]'));
  var accordionDadosImovel = element(by.id('accordion-dados-imovel'));
  var accordionDadosFinanceiros = element(by.id('accordion-financeiro-venda'));
  var accordionDadosLicitacao = element(by.id('accordion-licitacao-venda'));
  var loadingBar = element(by.id('loading-bar'));
  var formaPagamento = element(by.model('financeiro.tipoPagamento'));
  var tipoModalidade = element(by.model('licitacao.tipoLicitacao'));
  var inputValor = element(by.model('financeiro.valor'));
  var inputNumeroParcelas = element(by.model('financeiro.numeroParcelas'));
  var inputRip = element(by.model('incluirImovelCtrl.imovel.rip'));
  var inputValorEntrada = element(by.model('financeiro.valorEntrada'));
  var inputValorFinanciado = element(by.model('financeiro.valorFinancidado'));
  var inputJurosMensal = element(by.model('financeiro.jurosMensal'));
  var comboBoxJurosMensal = element(by.model('financeiro.tipoJurosMensal'));
  var comboBoxIndiceJurosMensal = element(by.model('financeiro.tipoIndiceJurosMensal'));
  var dadosJurosMensal = element.all(by.repeater('item in tipoJuro'));
  var dadosFormaPagamento = element.all(by.repeater('item in tipoPagamento'));
  var dadosTipoModalidade = element.all(by.repeater('item in tiposLicitacao'));
  var dadosImovel = element.all(by.repeater('destinacaoImovel in destinacaoImoveis'));
  var botaoIncluirImovel = element(by.cssContainingText('.md-button.md-ink-ripple', 'INCLUIR IMÓVEL'));
  var botaoConsultar = element(by.cssContainingText('.md-button.md-ink-ripple','CONSULTAR'));
  var botaoIncluir = element(by.css('[ng-click="incluirImovelCtrl.incluir()"]'));
  var botaoConfirmar = element(by.cssContainingText('.md-button.md-ink-ripple','CONFIRMAR'));

  //Clica no accordion Dados Financeiros
  this.clicaDadosFinanceiros = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 10000, "Timeout LoandingBar");
    browser.wait(EC.visibilityOf(accordionDadosFinanceiros),10000);
    browser.sleep(2000);
    accordionDadosFinanceiros.click();
    };

  //Seleciona a opção à vista no tipo de pagamento
  this.selecionaAVista = function () {
    browser.wait(EC.visibilityOf(formaPagamento),10000,"O combobox de forma de pagamento não apareceu");
    formaPagamento.click();
   /* browser.wait(EC.visibilityOf(dadosFormaPagamento),10000,"Os dados do combobox de forma de pagamento não aparecam");*/
    dadosFormaPagamento.get(0).click();
  };

  //Verifica se o campo valor apareceu
  this.verificaInputValor = function () {
    return browser.wait(EC.visibilityOf(inputValor),10000,"O input valor não apareceu") &&
      browser.wait(EC.invisibilityOf(inputNumeroParcelas),10000,"Os inputs restantes apareceram");
  };

  //Clica no accordion dados da licitação
  this.selecionaDiferenteDispensaOuInexigibilidade = function () {
    browser.wait(EC.visibilityOf(accordionDadosLicitacao),10000,"O accordion de dados da licitação não apareceu");
    accordionDadosLicitacao.click();
    browser.wait(EC.visibilityOf(tipoModalidade),10000,"O combobox de tipo/modalidade não apareceu");
    tipoModalidade.click();
    browser.wait(EC.presenceOf(dadosTipoModalidade),10000,"Os dados tipo/modalidade não apareceram");
    dadosTipoModalidade.get(0).click();
  };

  //Verifica se o campo valor está habilitado
  this.campoValorHabilitado = function () {
    return inputValor.isEnabled();
  };

  //Clica no accordion dados do imovel
  this.clicaAccordionDadosImovel = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 10000, "Timeout LoandingBar");
    browser.wait(EC.visibilityOf(accordionDadosImovel),5000);
    accordionDadosImovel.click();
  };

  //Inclui um imóvel
  this.incluirImovel = function () {
    browser.wait(EC.visibilityOf(botaoIncluirImovel),10000,"O botão de incluir imóvel não apareceu");
    botaoIncluirImovel.click();
    browser.wait(EC.visibilityOf(inputRip),10000,"O input par inserir o rip não apareceu");
    inputRip.sendKeys('00000029');
    browser.wait(EC.visibilityOf(botaoConsultar),10000,"O botão para consultar o imóvel inserido não apareceu");
    botaoConsultar.click();
    browser.sleep(5000);
    botaoIncluir.click();
    return botaoConfirmar.click();
  };

  //Retorna o valor do inputValor
  this.getValor = function () {
    browser.sleep(2000);
    return inputValor.evaluate(inputValor.getAttribute('ng-model'));
  };

  //Insere no campo valor um número menor do que o laudo de avaliação do imóvel
  this.insereValorMenorLaudo = function () {
    browser.wait(EC.visibilityOf(inputValor),10000,"O input do valor não está visível");
    inputValor.sendKeys(1000, protractor.Key.TAB);
  };

  //Verifica se apareceu a mensagem de que o valor é menor do que o laudo
  this.verificaMensagemValorMenorLaudo = function () {
    browser.wait(EC.visibilityOf(mensagemErro),10000,"A mensagem de erro não apareceu");
    return browser.wait(EC.textToBePresentInElement(mensagemErro, 'O valor informado não pode ser menor que o valor do' +
      ' Laudo de Avaliação do Imóvel'));
  };

  //Verifica se a tabela com os dois imóveis apareceu e se o campo valor desapareceu
  this.verificaDadosImovel = function () {
    return browser.wait(EC.presenceOf(dadosImovel),10000)  && browser.wait(EC.invisibilityOf(inputValor),10000);
  };

  //Verifica tamanho da tabela de imoveis inseridos
  this.tamanhoTabImoveis = function () {
    return dadosImovel.count();
  };

  //Seleciona a opção parcelado no tipo de pagamento
  this.selecionaParcelado = function () {
    browser.wait(EC.visibilityOf(formaPagamento),10000,"O combobox de forma de pagamento não apareceu");
    formaPagamento.click();
    dadosFormaPagamento.get(1).click();
  };

  //Insere valores nos inputs de valor de entrada e valor financiado
  this.insereInputsVendaFinanciado = function () {
    inputValorEntrada.sendKeys(100);
    inputValorFinanciado.sendKeys(100, protractor.Key.TAB);
  };

  //Verifica apareceu a mensagem da soma dos valores de entrada e financiado diferente do valor total
  this.verificaMensagemSomaValorEntradaEFinanciado = function () {
    browser.wait(EC.visibilityOf(mensagemErro),10000,"A mensagem de erro não apareceu");
    return browser.wait(EC.textToBePresentInElement(mensagemErro, 'A soma do Valor de Entrada e Valor Financiado não ' +
      'pode ser diferente do Valor do Imóvel informado'));
  };

  //Retorna o valor do inputValorEntrada
  this.getValorEntrada = function () {
    return inputValorEntrada.evaluate(inputValorEntrada.getAttribute('ng-model'));
  };

  //Retorna o valor do inputValorFinanciado
  this.getValorFinanciado = function () {
    return inputValorFinanciado.evaluate(inputValorFinanciado.getAttribute('ng-model'));
  };

  //Seleciona o valor no combo de juros mensal
  this.selecionaJurosMensal = function (indice) {
    browser.wait(EC.visibilityOf(comboBoxJurosMensal),10000,"O ComboBox de juros mensal");
    comboBoxJurosMensal.click();
    browser.wait(EC.presenceOf(dadosJurosMensal),10000,"As opções do ComboBox de juros mensal não apareceram");
    dadosJurosMensal.get(indice).click();
  };

  //Verifica se o ComboBox indice de jusros mensal apareceu e o input juros mensal desapareceu
  this.verificaIndiceJurosMensal = function () {
    return browser.wait(EC.visibilityOf(comboBoxIndiceJurosMensal)) &&
      browser.wait(EC.invisibilityOf(inputJurosMensal));
  };

  //Verifica se o input de juros mensal apareceu e se o ComboBox de juros mensal desapareceu
  this.verificaJurosMensal = function () {
    return browser.wait(EC.visibilityOf(inputJurosMensal),10000) &&
        browser.wait(EC.invisibilityOf(comboBoxIndiceJurosMensal));
  };

};
module.exports = VendaPage;
