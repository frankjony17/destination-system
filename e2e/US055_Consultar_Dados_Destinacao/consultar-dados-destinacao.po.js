/**
 * Created by samuel on 27/06/17.
 */

var consultarDadosPage = function () {

    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var inputCodigoUtilizacao = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.dadosUtilizacao'));
    var inputUtilizacao = element(by.model('$mdAutocompleteCtrl.scope.searchText'));
    var opcoesUtilizacao = element.all(by.repeater('tipo in consultarDestinacaoCtrl.filtrarTipoUtilizacao'));
    var subTipoUtilizacao = element(by.model('$mdAutocompleteCtrl.scope.searchText'));
    var inputPais = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.pais'));
    var inputCep = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.cep'));
    var inputUf = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.uf'));
    var inputMunicipio = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.municipio'));
    var opcoesPais = element.all(by.repeater('pais in consultarDestinacaoCtrl.paises'));
    var inputCidade = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.cidadeExterior'));
    var btnLimpar = element(by.css('[ng-click="consultarDestinacaoCtrl.limparPesquisa()"]'));

    this.abrirPagina = function () {
      browser.get('http://su-spu.basis.com.br/#/destinacao');
      browser.wait(EC.invisibilityOf(loadingBar), 5000);
      browser.get('http://su-spu.basis.com.br/#/destinacao/consultar');
    };

    this.subTipoUtilizacao = function () {
      browser.wait(EC.presenceOf(inputUtilizacao), 5000);
      inputUtilizacao.click();
      browser.wait(EC.elementToBeClickable(opcoesUtilizacao.get(1)), 5000);
      opcoesUtilizacao.get(1).click();
      browser.sleep(2000);
    };

    this.selecionarBrasil = function () {
      browser.wait(EC.presenceOf(inputPais), 5000);
      inputPais.click();
      opcoesPais.get(0).click();
    };

    this.selecionarPais = function () {
      browser.wait(EC.presenceOf(inputPais), 5000);
      inputPais.click();
      opcoesPais.get(1).click();
    };

    this.limparCampos = function () {
      browser.wait(EC.presenceOf(btnLimpar));
      btnLimpar.click();
    };

    this.getCep = function () {
        return browser.wait(EC.visibilityOf(inputCep), 5000);
    };

    this.getUf = function () {
      return browser.wait(EC.visibilityOf(inputUf), 5000);
    };

    this.getMunicipio = function () {
      return browser.wait(EC.visibilityOf(inputMunicipio), 5000);
    };

    this.getCidade = function () {
      return browser.wait(EC.visibilityOf(inputCidade));
    };

    this.getSubTipo = function () {
      return browser.wait(EC.visibilityOf(subTipoUtilizacao), 5000);
    };

    this.getCodigoUtilizacao = function () {
      return browser.wait(EC.visibilityOf(inputCodigoUtilizacao),5000);
    }
};

module.exports = consultarDadosPage;


