
const InserirDadosDoResponsavelDestinatarioPage = require('./inserir-dados-do-responsavel-destinatario.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da história-US049 Inserir Dados do Responsável Destinatário', function () {

   var EC = protractor.ExpectedConditions;
   var inserirDadosDoResponsavelDestinatario = new InserirDadosDoResponsavelDestinatarioPage();
   var abrirPagina = new abrirPage();


     abrirPagina.abrir();

     abrirPagina.abrirPagina('CESSÃO GRATUITA');

     inserirDadosDoResponsavelDestinatario.clicarDadosResponsavel();


   it('Informar CPF valido no campo', function () {
     inserirDadosDoResponsavelDestinatario.preencherCpf();
     expect(inserirDadosDoResponsavelDestinatario.verificaCampoCpfCnpjVazio()).toBe(false);

     });

   it('Clicar para incluir [CPF/CNPJ]', function () {
     inserirDadosDoResponsavelDestinatario.clicarIncluirCpfCnpj();
     expect(inserirDadosDoResponsavelDestinatario.verificarBotaoIncluir()).toBe(true);

     });

   it('Clicar no Botão Remover [CPF]', function () {
     inserirDadosDoResponsavelDestinatario.ClicarExcluirCpf();
     expect(inserirDadosDoResponsavelDestinatario.verificarBotaoExcluir()).toBe(false);

     });

   it('Informar CNPJ no Campo e incluir CNPJ ', function () {
     inserirDadosDoResponsavelDestinatario.preencherCnpj();
     inserirDadosDoResponsavelDestinatario.clicarIncluirCpfCnpj();
     expect(inserirDadosDoResponsavelDestinatario.verificarUgExecutora()).toBe(true);

     });


    });
