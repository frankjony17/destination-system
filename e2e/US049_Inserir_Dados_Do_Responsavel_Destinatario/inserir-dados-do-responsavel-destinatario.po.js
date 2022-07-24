
var InserirDadosDoResponsavelDestinatarioPage = function () {

  var EC = protractor.ExpectedConditions;
  var acessarDadosDoResponsavel = element(by.id('dadosResponsavel'));
  var loadingBar = element(by.id('loading-bar'));
  var inputCpfCnpj = element(by.model('responsavel.cpfCnpj'));
  var incluirCpfCnpj = element(by.className('md-raised margin-lateral-label md-button md-ink-ripple flex-xs-40 flex-30'));
  var inputUgExecutora = element(by.model('responsavel.codigoUG'));
  var excluirCpf = element.all(by.repeater('responsavel in responsaveis'));

  this.clicarDadosResponsavel = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 9000, 'Aguardando loading bar desaparecer');
    browser.wait(EC.presenceOf(acessarDadosDoResponsavel));
    acessarDadosDoResponsavel.click();
    browser.sleep(2000);

   };

  this.preencherCpf = function () {
    browser.wait(EC.presenceOf(inputCpfCnpj));
    inputCpfCnpj.sendKeys('57641783120');
    browser.sleep(2000);

   };

  this.verificaCampoCpfCnpjVazio = function () {
    return incluirCpfCnpj.getText =='';
   };

  this.clicarIncluirCpfCnpj = function () {
    browser.wait(EC.presenceOf(incluirCpfCnpj));
    incluirCpfCnpj.click();
    browser.sleep(2000);

   };

  this.verificarBotaoIncluir = function () {
    return incluirCpfCnpj.isPresent();

   };

  this.ClicarExcluirCpf = function () {
    var excluirCpf = element.all(by.repeater('responsavel in responsaveis'));
    var excluirCpfResponsavel =
    excluirCpf.then(function(selecionarItem){
    return selecionarItem[0].element(by.css('[ng-click="remover(responsavel.cpfCnpj);"]')).click();

   });

     browser.sleep(5000);
     return excluirCpfResponsavel;

   };

  this.verificarBotaoExcluir = function () {
    return excluirCpf.isPresent();

   };

  this.preencherCnpj = function () {
    browser.wait(EC.presenceOf(inputCpfCnpj));
    inputCpfCnpj.sendKeys('11443715000135');

    browser.wait(EC.presenceOf(inputUgExecutora));
    inputUgExecutora.sendKeys('Teste');
    browser.sleep(2000);
   };

  this.verificarUgExecutora = function () {
    browser.wait(EC.presenceOf(inputUgExecutora));
    return inputUgExecutora.isPresent();

     };

   };
   module.exports = InserirDadosDoResponsavelDestinatarioPage;
