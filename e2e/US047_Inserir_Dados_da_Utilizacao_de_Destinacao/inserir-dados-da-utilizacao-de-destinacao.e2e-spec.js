/**
 * Created by rogerio on 01/06/17.
 */
const inserirDados = require('./inserir-dados-da-utilizacao-de-destinacao.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da historia US047 - Inserir Dados da Utilização de Destinação', function () {
  var EC = protractor.ExpectedConditions;
  var inserirDadosUtilizacao = new inserirDados();
  var abrirPagina = new abrirPage();

  it('Chegar a página', function () {

    abrirPagina.abrir();
    abrirPagina.abrirPagina('CESSÃO GRATUITA');

    inserirDadosUtilizacao.abrirAcordion();
    expect(inserirDadosUtilizacao.acordionAberto()).toBe(true);

  });
  it('Critério 1. Preenchimento automático dos Dados de Utilização', function () {

  });
  it('Critério 2. Apresentar subtipo de utilização', function () {
    inserirDadosUtilizacao.preencherTipo();
    expect(inserirDadosUtilizacao.subTipoIsPresent()).toBe(true);
  });
  it('Critério 3. Apresentar campo [Especificar tipo da utilização] e mensagem de alerta', function () {
     inserirDadosUtilizacao.preencherSubtipo();
     expect(inserirDadosUtilizacao.msgAtencaoAndCampoEspcifiIsVisivel()).toBe(true);
  });
  it('Critério 4. Autocomplete da [Especificar tipo da utilização]', function () {
    //Fazer por ultimo
  });
  it('Critério 5. Selecionar opção [Não se aplica]', function () {
    inserirDadosUtilizacao.naoSeAplica();
    expect(inserirDadosUtilizacao.descricaoFinalidadeDesabilidado()).toBe(false);
  });
  it('Critério 6. Preenchimento do campo [Área (m2) por servidor]', function () {
    //Não Implementado
  });
  it('Critério 7. Validar vínculo de UG e Ministério da Defesa', function () {
    //Não implementado
  });
  it('Critério 8. Apresentação de valores para o campo Uso e Especificação', function () {
    //Não implementado
  });
});
