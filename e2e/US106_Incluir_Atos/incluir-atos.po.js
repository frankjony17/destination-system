/**
 * Created by samuel on 02/06/17.
 */

var incluirDadosPage = function () {
  var EC = protractor.ExpectedConditions;
  var acordionDados = element(by.id('dadosDoInstrumento'));
  var botaoIncluirDocumento = element(by.css('[ng-click="abrirModalIncluirDocumento($event);"]'));
  var inputDocumento = element(by.model('incluirDocumentoCtrl.documento.tipoDocumento'));
  var opcoesDocumento = element.all(by.repeater('tipo in incluirDocumentoCtrl.tipoDocumentos'));
  var inputSubtipo = element(by.model('incluirDocumentoCtrl.documento.tipoDocumento'));
  var checkBoxAditivo = element(by.model('incluirDocumentoCtrl.documento.dispensado'));
  var inputEspecificar = element(by.model('incluirDocumentoCtrl.documento.especificar'));
  var fecharModal = element(by.css('[ng-click="incluirDocumentoCtrl.fechar()"]'));
  var inputJustificativa = element(by.model('incluirDocumentoCtrl.documento.justificativa'));
  var publicadoDOU = element(by.model('incluirDocumentoCtrl.documento.publicacao')).all(by.tagName('md-radio-button')).get(0);
  var naoPublicadoDOU = element(by.model('incluirDocumentoCtrl.documento.publicacao')).all(by.tagName('md-radio-button')).get(1);
  var inputPagina = element(by.model('incluirDocumentoCtrl.documento.pagina'));
  var inputSecao = element(by.model('incluirDocumentoCtrl.documento.secao'));
  var inputData = element(by.id('dataPublicacao')).$('input.md-datepicker-input');
  var botaoEscolherArquivo = element(by.id('escolherArquivo'));
  var linkPublicacao = element(by.model('incluirDocumentoCtrl.documento.link'));
  var campoData = element(by.model('incluirDocumentoCtrl.documento.dataPublicacao'));
  var botaoIncluir = element(by.css('[ng-click="incluirDocumentoCtrl.incluir(documento)"]'));
  var botaoConfirmar = element(by.css('[ng-click="incluirDocumentoCtrl.confirmar();"]'));
  var listaDocumentos = element.all(by.repeater('documento in listaDocumentos'));


  //Abre accordion dados do instrumento/ato
  this.abrirAccordionDados = function () {
    acordionDados.click();
    browser.sleep(2000);
  };

  //Clica no botão incluir documento
  this.abrirModalIncluirDocumento = function () {
    browser.wait(EC.presenceOf(botaoIncluirDocumento), 5000);
    botaoIncluirDocumento.click();
    browser.sleep(1000);
  };

  //Seleciona a opção extrato na listbox
  this.selecionarExtrato = function () {
    browser.wait(EC.presenceOf(inputDocumento), 5000);
    inputDocumento.click();
    browser.wait(EC.elementToBeClickable(opcoesDocumento.get(1)), 5000);
    opcoesDocumento.get(1).click();
    browser.sleep(2000);
  };

  //Seleciona a opção Outros na listbox
  this.selecionarOutros = function () {
    browser.wait(EC.presenceOf(inputDocumento), 5000);
    inputDocumento.click();
    browser.wait(EC.elementToBeClickable(opcoesDocumento.get(2)), 5000);
    opcoesDocumento.get(2).click();
    browser.sleep(2000);
  };

  //Seleciona opção Aditivo na listbox
  this.selecionarAditivo = function () {
    browser.wait(EC.presenceOf(inputDocumento), 5000);
    inputDocumento.click();
    browser.wait(EC.elementToBeClickable(opcoesDocumento.get(0)), 5000);
    opcoesDocumento.get(0).click();
    browser.sleep(2000);
  };

  //Clica na checkbox gerada ao selecionar Aditivo do Contrato
  this.checkBoxAditivo = function () {
    browser.wait(EC.presenceOf(checkBoxAditivo), 5000);
    checkBoxAditivo.click();
  };

  //Clica na checkbox Publicado DOU
  this.publicadoDou = function () {
    browser.wait(EC.presenceOf(publicadoDOU), 5000);
    publicadoDOU.click();
  };

  //Preenche os dados para gerar o link
   this.gerarLink = function () {
    browser.wait(EC.presenceOf(inputPagina), 5000);
    inputPagina.sendKeys('123');
    browser.wait(EC.presenceOf(inputSecao), 5000);
    inputSecao.sendKeys('123');
    browser.wait(EC.presenceOf(inputData), 5000);
    inputData.sendKeys('12/02/1995');
    browser.sleep(2000);

    linkPublicacao.click().then(function () {
        browser.getAllWindowHandles().then(function(handles) {
            var newWindowHandle = handles[1];
            var atualWindow = handles[0];
            browser.switchTo().window(newWindowHandle);
            expect(browser.getCurrentUrl()).toEqual('http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=123&pagina=123&data=12/02/1995');
            browser.driver.close();
            browser.switchTo().window(atualWindow);
        })
    });
  };

  //Click na checkbox Não Publicado DOU
  this.naoPublicadoDOU = function () {
    browser.wait(EC.presenceOf(naoPublicadoDOU), 5000);
    naoPublicadoDOU.click();
  };

  //Inclui um ATO
  this.incluirAto = function () {
      inputJustificativa.sendKeys('Testando');
      browser.wait(EC.presenceOf(botaoIncluir));
      botaoIncluir.click();
      browser.wait(EC.presenceOf(botaoConfirmar));
      botaoConfirmar.click();
  }

  //Retorna o campo subTipo
  this.getSubTipo = function () {
    return browser.wait(EC.visibilityOf(inputSubtipo), 5000);
  };

  //Retorna o botão Escolher Arquivo
  this.getBotaoEscolher = function () {
    return browser.wait(EC.visibilityOf(botaoEscolherArquivo), 5000);
  };

  //Retorna o campo Especificar
  this.getEspecificar = function () {
    return browser.wait(EC.visibilityOf(inputEspecificar), 5000);
  };

  //Retorna o campo Página
  this.getPagina = function () {
    return browser.wait(EC.visibilityOf(inputPagina));
  };

  //Retorna o campo Secão
  this.getSecao = function () {
    return browser.wait(EC.visibilityOf(inputSecao));
  };

  //Retorna o campo Data
  this.getData = function () {
    return browser.wait(EC.visibilityOf(campoData));
  };

  //Retorna o campo Aditivo
  this.getAditivo = function () {
    return browser.wait(EC.visibilityOf(checkBoxAditivo), 5000);
  };

  //Retorna o textArea da justificativa
  this.getJustificativa = function(){
    return browser.wait(EC.visibilityOf(inputJustificativa), 5000);
  };

  this.tableCount = function () {
    browser.wait(EC.presenceOf(listaDocumentos));
    return listaDocumentos.count();
  };

  //Fecha a Modal
  this.fecharModal = function () {
    browser.wait(EC.presenceOf(fecharModal));
    fecharModal.click();
  };

}

module.exports = incluirDadosPage;
