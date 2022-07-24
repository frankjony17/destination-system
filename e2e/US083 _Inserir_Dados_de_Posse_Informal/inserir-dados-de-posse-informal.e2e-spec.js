/**
 * Created by haillanderson on 29/05/17.
 */

const PosseInformalPage = require('./inserir-dados-de-posse-informal.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da história US083 - Inserir Dados de Posse Informal', function(){
  var posseInformalPage = new PosseInformalPage();
  var abrirPagina = new abrirPage();

  it('login e chegar a página', function () {
    abrirPagina.abrirPagina('POSSE INFORMAL');
    expect(abrirPagina.isAberta());

  });

  it('Critério 2.RIP inválido', function () {
    if (posseInformalPage.insereRipInvalido()){
      posseInformalPage.consultar();
    }
    expect(posseInformalPage.ripInvalido()).toBe(true);
    expect(posseInformalPage.getValorInputRip()).toEqual("");
  });

  it('Critério 1.Informar RIP do Imóvel', function () {
    if(posseInformalPage.insereRipValido()){
      posseInformalPage.consultar();
    }
    expect(posseInformalPage.dadosEnderecoVazio()).toBe(false);
    expect(posseInformalPage.acordionDadosInteressadoPresente()).toBe(true);
  });

  it('Critério 3.Acessar funções', function () {
    //Funcionalidades do critério ainda não desenvolvidas
  });

  it('Critério 4.Tipo de Posse Igual a Coletivo com Entidade Representativa', function () {
    if(posseInformalPage.acordionDadosInteressadoPresente()){
      posseInformalPage.abrirAcordionDadosInteressados();
      posseInformalPage.selecionaTipoPosse(0);
    }
    expect(posseInformalPage.verificarCamposAdicionais()).toBe(true);
  });

  it('Critério 5.Selecionar a opão Incluir Interessado', function(){
    expect(posseInformalPage.verificaModalIncluirInteressado()).toBe(true);
  });

  it('Critério 7.Apresentar [Código UG]', function () {
    posseInformalPage.insereCNPJInteressado();
    expect(posseInformalPage.verificaInputCodigoUG()).toBe(true);
  });

  it('Critério 8.Incluir Interessado', function () {
    posseInformalPage.insereInteressado();
    expect(posseInformalPage.verificaDadosInteressadoVazio()).toBe(false);
  });

  it('Citério 6.Excluir Interessado', function () {
    posseInformalPage.clicaExcluirInteressado();
    expect(posseInformalPage.clicaConfirmarExclusaoInteressado()).toBe(true);
  });

  it('Critério 10.Dados Obrigatórios não informados', function () {
    posseInformalPage.clicaConfirmar();
    expect(posseInformalPage.verificaErroCamposObrigatorios()).toBe(true);
  });

  it('Critério 11.Fechar', function () {
    expect(posseInformalPage.clicaFecharECancela()).toBe(true);
  });

  it('Critério 9.Gravar Dados', function () {
    posseInformalPage.preencheCamposFaltantesESalva();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/principal');
  });

});
