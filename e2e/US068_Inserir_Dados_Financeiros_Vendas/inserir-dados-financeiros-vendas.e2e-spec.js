/**
 * Created by haillanderson on 02/06/17.
 */

const VendaPage = require('./inserir-dados-financeiros-vendas.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da história US068 - Inserir Dados Financeiros Vendas',function () {
  var vendaPage = new VendaPage();
  var abrirPagina = new abrirPage();

  abrirPagina.abrirPagina('VENDA');
  vendaPage.clicaDadosFinanceiros();

  it('Critério 1.Forma de Pagamento "À Vista"', function () {
    expect(abrirPagina.isAberta());
    vendaPage.selecionaAVista();
    expect(vendaPage.verificaInputValor()).toBe(true);
  });

  it('Critério 2.Campo [Valor] recuperado do Laudo de Avaliação', function () {
    vendaPage.clicaAccordionDadosImovel();
    if(vendaPage.incluirImovel()){
      expect(vendaPage.getValor()).toEqual(1000000);
    }
  });

  it('Critério 3.Campo [Valor]', function () {
    vendaPage.selecionaDiferenteDispensaOuInexigibilidade();
    expect(vendaPage.campoValorHabilitado()).toBe(true);
  });

  it('Critério 4.Apresentação do campo [Moeda]', function () {
    //Não é possível testar, pois precisa cadastrar um imovel no exterior
  });

  it('Critério 5.[Valor] inferior ao valor do laudo', function () {
    vendaPage.insereValorMenorLaudo();
    expect(vendaPage.verificaMensagemValorMenorLaudo()).toBe(true);
    expect(vendaPage.getValor()).toEqual('');
  });

  it('Critério 6.Valor quando há mais de um imóvel', function () {
    vendaPage.incluirImovel();
    expect(vendaPage.verificaDadosImovel()).toBe(true);
    expect(vendaPage.tamanhoTabImoveis()).toEqual(4);
  });

  it('Critério 7.Validar [Valor de Entrada] e [Valor Financiado]', function () {
    vendaPage.selecionaParcelado();
    vendaPage.insereInputsVendaFinanciado();
    expect(vendaPage.verificaMensagemSomaValorEntradaEFinanciado()).toBe(true);
    expect(vendaPage.getValorEntrada()).toEqual(null);
    expect(vendaPage.getValorFinanciado()).toEqual(null);
  });

  it('Critério 8.Validar [Data de início da cobrança]', function () {
    //Campo Data assinatura do Termpo/Contrato não está presente na tela
  });

  it('Critério 9.Validar [Mês/Ano do 1º Reajuste Contratual]', function () {
    //Requisito não condizente com o sistema
  });

  it('Critério 10.Preenchimento do campo [Dia do vencimento do débito mensal]', function () {
    //Funcionalidade não implementada
  });

  it('Critério 11.[Juros Mensal] igual a Manual', function () {
    vendaPage.selecionaJurosMensal(1);
    expect(vendaPage.verificaJurosMensal()).toBe(true);
  });

  it('Critério 12.[Juros Mensal] igal a Índice', function () {
    vendaPage.selecionaJurosMensal(0);
    expect(vendaPage.verificaIndiceJurosMensal()).toBe(true);
  });

});
