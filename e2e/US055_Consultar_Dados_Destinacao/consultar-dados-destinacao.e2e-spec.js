/**
 * Created by samuel on 27/06/17.
 */

const consultarDadosPage = require('./consultar-dados-destinacao.po');
const abrirPage = require('../abrirPage.po');

describe('Testes e2e da história US055', function () {

  var abrirPagina = new abrirPage();
  var consultarDados = new consultarDadosPage();

  it('login e chegar a página', function () {
    consultarDados.abrirPagina();
    expect(abrirPagina.isAberta());
    browser.sleep(1500);
  });

  it('Critério 1 - Apresentar o [Subtipo de Utilização]', function () {
    // consultarDados.subTipoUtilizacao();
    // expect(consultarDados.getSubTipo()).toBe(true);
    // browser.sleep(2000);
  });

  it('Critério 2 - Consultar Dados no Brasil', function () {
    consultarDados.selecionarBrasil();
    expect(consultarDados.getCep()).toBe(true);
    expect(consultarDados.getUf()).toBe(true);
    expect(consultarDados.getMunicipio()).toBe(true);
  });

  it('Critério 3 - Consultar Dados no Exterior', function () {
    consultarDados.selecionarPais();
    expect(consultarDados.getCidade()).toBe(true);
  });

  it('Critério 4 - Consultar Destinações', function () {

  });

  it('Critério 5 - Limpar Filtros', function () {
    consultarDados.limparCampos();
    expect(consultarDados.getCodigoUtilizacao()).toBe(true);
    browser.sleep(5000);
  });

});
