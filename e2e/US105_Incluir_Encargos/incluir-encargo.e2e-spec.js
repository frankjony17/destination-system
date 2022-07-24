
 const IncluirEncargoPage = require('./incluir-encargo.po');
 const abrirPage = require('../abrirPage.po');

describe('Teste e2e da história-US105 incluir encargos',function () {
  var EC = protractor.ExpectedConditions;
  var incluirEncargo = new IncluirEncargoPage();
  var abrirPagina = new abrirPage();

     abrirPagina.abrir();

     abrirPagina.abrirPagina('CESSÃO GRATUITA');

     incluirEncargo.dadosDoInstrumento();


  it('Critério 1, incluir de encargos', function () {
     incluirEncargo.clicarIncluirEncargos();
     expect(incluirEncargo.resultadoTituloIncluirEncargo()).toBe(true);

    });

  it('Critério 2,Selecionar a opção: [Utilizar data de encerramento do contrato]', function () {
     incluirEncargo.preencherCampos();
     expect(incluirEncargo.verificarPrazoCumprimento()).toBe(false);

    });

  it('Critério 3, Seleciona opção incluir', function () {
     incluirEncargo.incluirEncargoModal();
     expect(incluirEncargo.resultadoIncluirEncargoModal()).toBe(false);

    });

  it('Critério 4, Utilizar a data do contrato', function () {
     incluirEncargo.preencherDataPrazoCumprimento();
     expect(incluirEncargo.resultadoIncluirEncargoModal()).toBe(false);

     });

  });


