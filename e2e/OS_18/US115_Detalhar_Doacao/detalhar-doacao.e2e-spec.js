/**
 * Created by haillanderson on 20/09/17.
 */
const DetalharDoacao = require('./detalhar-doacao.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US115 - Detalhar Doação', function () {
    var detalharDoacao = new DetalharDoacao();
    var detalharDestinacao = new DetalharDestinacaoPage();

    it('Critério 1.1 - Dados do Cancelamento/Encerramento da Utilização (apresenta a funcionalidade' +
        ' US163 – Apresentar Dados de Cancelamento)', function () {
        detalharDestinacao.irDestinacao(8,'Doação');
        //Funcionalidade Não implementada
    });

    it('Critério 1.2 - Dados do Imóvel ( Não apresenta a opção de incluir e cancelar imóvel/parcela)', function () {
        expect(detalharDoacao.verificarDiretivaAtendimento()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-doacao');
        expect(detalharDoacao.verificaBotaoIncluirImovel()).toBe(false);
        expect(detalharDoacao.verificaIconeExcluir()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-doacao');
    });

    it('Critério 1.3 - Dados da Utilização (Apresenta todos os campos bloqueados)', function () {
        var tipoUtilizacao = element(by.model('utilizacao.tipoUtilizacao'));
        var subTipoUtilizacao = element(by.model('utilizacao.subTipoUtilizacao'));
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-doacao');
        expect(tipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(subTipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.dadosUtilizacaoDiretiva()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-doacao');
    });

    it('Critério 1.4 - Dados Responsável / Destinatário (Não apresenta a opção incluir e cancelar. Ao se' +
        ' selecionar editar, apresenta os campos bloqueados sem a opção de incluir)', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel-doacao');
        expect(detalharDestinacao.responsavelDiretiva(1)).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel-doacao');
    });

    it('Critério 1.5 - Dados do Instrumento / Ato (Apresenta os campos bloqueados, sem opção de incluir' +
        ' e editar encargos, e sem a opção de incluir e cancelar documentos. Ao se selecionar editar um' +
        ' documento, apresenta os campos bloqueados sem opção de salvar )', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-instrumento-doacao');
        expect(detalharDestinacao.encargoIsPresent(0)).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-instrumento-doacao');
        detalharDestinacao.avancar();

        //contrato
        var dataFinalContrato = element(by.model('dadosContrato.dataFinal'));
        var dataInicioContrato = element(by.model('dadosContrato.dataInicio'));
        expect(dataFinalContrato.getAttribute('disabled')).toEqual('true');
        expect(dataInicioContrato.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.contratoBloqueado()).toBe(false);

        //documentos
        detalharDestinacao.clicaAccordion('accordion-documentos-doacao');
        detalharDestinacao.irAoDocumentos(1,1);
        var tipoDocumento = element(by.model('incluirDocumentoCtrl.documento.tipoDocumento'));
        var aditivoDocumento = element(by.model('incluirDocumentoCtrl.documento.dispensado'));
        expect(tipoDocumento.getAttribute('disabled')).toEqual('true');
        expect(aditivoDocumento.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.documentoBloqueado()).toBe(false);
        detalharDestinacao.fechar();
    });

    it('Critério 2.Selecionar a opção "Fechar"', function () {
        detalharDestinacao.fechar();
        expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/consultar');
    });

    it('Critério 3.Selecionar a opção "Cancelar esta Destinação"', function (){
        //Criterio não implementado
    });

    it('Critério 4.Selecionar a opção "Editar"',function () {
        detalharDestinacao.irDestinacao(8, 'Doação');
        detalharDestinacao.editar();
        expect(detalharDoacao.verificaEditar()).toBe(true);
    });
});
