/**
 * Created by samuel on 01/06/17.
 */
const DadosLicitacaoPage = require('./inserir-dados-licitacao.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da historia US066 - Inserir dados da licitação', function () {

  var dadosLicitacao = new DadosLicitacaoPage();
  var abrirPagina = new abrirPage();

  it('login e chegar a página', function () {
    abrirPagina.abrirPagina('VENDA');
    expect(abrirPagina.isAberta());
  });

  it('Critério 1. Recuperar', function () {
    browser.sleep(2000);
    dadosLicitacao.abrirAcordionVendas();
    dadosLicitacao.insereNumeroProcesso();
    expect(dadosLicitacao.getNumeroProcessoAtendimento().equals(dadosLicitacao.getNumeroProcessoLicitacao()))
  });

  it('Critério 2 - Número de Processo existente no SEI', function () {
    //Não implementado
  });

  it('Critério 3 - Selecionar a opção "Ver processo no SEI"', function () {
    //Não implementado
  });

  it('Critério 4 - Selecionar a opção "Incluir Documentos"', function () {
    //Não implementado
  });

  it('Critério 5 - Incluir documento', function () {
    //Não implementado
  });

  it('Critério 6 - Limpar Campos', function () {
    //Não implementado
  });

  it('Critério 7 - Confirmar inclusão de documentos', function () {
    //Não implementado
  });

  it('Critério 8 - Realizar o download do documento', function () {
    //Não implementado
  });

  it('Critério 9 - Remover documento', function () {
    //Não implementado
  });

  it('Critério 10 - Validar documento', function () {
    //Não implementado
  });

})
