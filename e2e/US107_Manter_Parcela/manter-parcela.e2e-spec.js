/**
 * Created by rogerio on 05/05/17.
 */
const ManterParcelaPage = require('./manter-parcela.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da historia US107 - Manter Parcela', function () {
  var EC = protractor.ExpectedConditions;
  var manterParcela = new ManterParcelaPage();
  var abrirPagina = new abrirPage();

  browser.get('http://su-spu.basis.com.br/#/destinacao/parcelaImovel');

  //abrirPagina.abrir();

  //abrirPagina.abrirPagina('GERENCIAR PARCELAS');

    //expect(abrirPagina.isAberta());


  it('Critério 4.Dados obrigatórios não informados', function () {
    manterParcela.pesquisar();
    expect(manterParcela.campoObrigatorioNaoInformado()).toBe(true);
  });
  it('Critério 1.Recuperar UF e Municipio', function () {
    manterParcela.preencherCep();
    expect(manterParcela.campoAtivado()).toBe(false);
  });
  it('Critério 2.Limpar o campo CEP', function () {
    manterParcela.limparCep();
    expect(manterParcela.campoAtivado()).toBe(true);
  });
  it('Critério 3.Consultar',function () {
    manterParcela.preencherCampos();
    manterParcela.pesquisar();
    expect(manterParcela.resultadoConsultaCount()).toBeGreaterThan(0);
  });
  it('Critério 5.selecionar a opção "editar"', function () {
    manterParcela.editar();
    expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/criarParcelaImovel');
  });
  it('Critério 6. Bloquear a opção "editar"', function () {
    //Não implementada
  })
});
