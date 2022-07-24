/**
 * Created by haillanderson on 15/09/17.
 */
const DetalharCDRU = require('./detalhar-cdru.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US119 - Detalhar CDRU', function () {
    var detalharCDRU = new DetalharCDRU();
    var detalharDestinacao = new DetalharDestinacaoPage();

    it('Critério 1.1 - Dados do Cancelamento/Encerramento da Utilização (apresenta a funcionalidade' +
        ' US163 – Apresentar Dados de Cancelamento)', function () {
        detalharDestinacao.irDestinacao(8,'Cdru');
        //Funcionalidade Não implementada
    });

    it('Critério 1.2 - Dados do Imóvel ( Não apresenta a opção de incluir e cancelar imóvel/parcela)', function () {
        expect(detalharCDRU.verificarDiretivaAtendimento()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-cdru');
        expect(detalharCDRU.verificaBotaoIncluirImovel()).toBe(false);
        expect(detalharCDRU.verificaIconeExcluir()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-cdru');
    });

    it('Critério 1.3 - Dados Responsável / Destinatário (Não apresenta a opção incluir e cancelar.' +
        ' Ao se selecionar editar, apresenta os campos bloqueados sem a opção de incluir)', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel-cdru');
        expect(detalharDestinacao.responsavelDiretiva(1)).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel-cdru');
    });

    it('Critério 1.4 - Dados da Licitação (Apresenta os campos bloqueados sem a opção de incluir e' +
        ' cancelar documentos )', function () {
        var inputTipoModalidade = element(by.model('licitacao.tipoLicitacao'));
        detalharDestinacao.clicaAccordion('accordion-dados-licitacao-cdru');
        expect(inputTipoModalidade.getAttribute('disabled')).toEqual('true');
        expect(detalharCDRU.verificaDiretivaLicitacao()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-licitacao-cdru');
    });

    it('Critério 1.5 - Dados Financeiros (Apresenta os campos bloqueados )', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-financeiros-cdru');
        expect(detalharCDRU.verificaDiretivaFinanceiro()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-financeiros-cdru');
    });

    it('Critério 1.6 - Dados do Instrumento / Ato (Apresenta os campos bloqueados, sem opção de incluir' +
        ' e editar encargos, e sem a opção de incluir e cancelar documentos. Ao se selecionar editar um' +
        ' documento, apresenta os campos bloqueados sem opção de salvar )', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-instrumento-cdru');
        expect(detalharDestinacao.encargoIsPresent(0)).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-instrumento-cdru');
        detalharDestinacao.avancar();

        //contrato
        var dataFinalContrato = element(by.model('dadosContrato.dataFinal'));
        var dataInicioContrato = element(by.model('dadosContrato.dataInicio'));
        expect(dataFinalContrato.getAttribute('disabled')).toEqual('true');
        expect(dataInicioContrato.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.contratoBloqueado()).toBe(false);

        //documentos
        detalharDestinacao.clicaAccordion('accordion-documentos-cdru');
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
        detalharDestinacao.irDestinacao(8, 'Cdru');
        detalharDestinacao.editar();
        expect(detalharCDRU.verificaEditar()).toBe(true);
    });
});
