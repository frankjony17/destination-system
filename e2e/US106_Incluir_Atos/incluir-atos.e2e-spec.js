/**
 * Created by samuel on 02/06/17.
 */

const incluirDadosPage = require('./incluir-atos.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da historia US0106 ', function () {

  var abrirPagina = new abrirPage();
  var incluirAtos = new incluirDadosPage();


  it('login e chegar a página', function () {
    abrirPagina.abrirPagina('CESSÃO GRATUITA');
    expect(abrirPagina.isAberta());
    browser.sleep(1500);
  });

  it('Critério 1 - Incluir Ato', function () {
    incluirAtos.abrirAccordionDados();
    incluirAtos.abrirModalIncluirDocumento();
  });

  it('Criterio 2 - Apresentar subtipo de Ato', function () {
    incluirAtos.selecionarExtrato();
    expect(incluirAtos.getSubTipo()).toBe(true);
  });

  it('Critério 3 - [Tipo] igual a "Outros"', function () {
    incluirAtos.selecionarOutros();
    expect(incluirAtos.getEspecificar()).toBe(true);
  });

  it('Critério 4 - Apresentar [Aditivo do Contrato/Termo dispensado]', function () {
    incluirAtos.selecionarAditivo();
    expect(incluirAtos.getAditivo()).toBe(true);
  });

  it('Critério 5 - Selecionar [Aditivo do Contrato/Termo dispensado]', function () {
    incluirAtos.checkBoxAditivo();
    expect(incluirAtos.getJustificativa()).toBe(true);
    incluirAtos.fecharModal();
    browser.sleep(2000);
  });

  it('Critério 6 - Publicação no DOU', function () {
    incluirAtos.abrirModalIncluirDocumento();
    incluirAtos.publicadoDou();
    expect(incluirAtos.getPagina()).toBe(true);
    expect(incluirAtos.getSecao()).toBe(true);
    expect(incluirAtos.getData()).toBe(true);
  });

  it('Critério 7 - Não Publicado ', function () {
    incluirAtos.naoPublicadoDOU();
    expect(incluirAtos.getBotaoEscolher()).toBe(true);
  });

  it('Critério 8 - Formação do link de ATO', function () {
    incluirAtos.publicadoDou();
    incluirAtos.gerarLink();
  });

  it('Critério 9 - Formato do Arquivo', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('Critério 10 - Visualizar Arquivo Enviado', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('Critério 11 - Excluir Arquivo', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('Critério 12 - Visualizar Arquivo Enviado', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('Critério 13 - Validar Data Inicial da Vigência/Assinatura', function () {
    //FUNCIONALIDADE NÃO IMPLEMENTADA
  });

  it('Critério 14 - Validar Data final da Vigência', function () {
    //FUNCIONALIDADE NÃO IMPLEMENTADA
  });

  it('Critério 15 - Incluir ato', function () {
    incluirAtos.selecionarAditivo();
    incluirAtos.checkBoxAditivo();
    incluirAtos.incluirAto();
    expect(incluirAtos.tableCount()).toEqual(1);
  });

});
