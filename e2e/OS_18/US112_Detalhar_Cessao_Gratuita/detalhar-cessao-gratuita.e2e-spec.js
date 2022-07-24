/**
 * Created by rogerio on 14/09/17.
 */
const DetalharCessaoGratuitaPage = require('./detalhar-cessao-gratuita.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US112 - Detalhar Cessão Gratuita', function () {
    var detalharCessaoGratuita = new DetalharCessaoGratuitaPage();
    var detalharDestinacao = new DetalharDestinacaoPage();

    it('Critério 1.1.Dados do Cancelamento/Encerramento da Utilização (apresenta a funcionalidade US163 ' +
        '(Apresentar Dados de Cancelamento)', function () {
        detalharDestinacao.irDestinacao(10, 'Cessão Gratuita');
       //Não Implementado
    });

    it('Critério 1.2.Dados do Imóvel/Parcela (Não apresenta a opção de incluir e cancelar imóvel/parcela. ' +
        'Ao se selecionar editar, apresenta os campos bloqueados sem a opção de incluir)', function () {
        //Verifica dados Imovel
        detalharDestinacao.clicaAccordion('id_acordion_dadosImovel');
        detalharDestinacao.editarImovel();
        expect(detalharDestinacao.imovelBloqueado()).toBe(false);
        detalharDestinacao.voltar();

    });

    it('Critério 1.3.Dados da Utilização (Apresenta todos os campos bloqueados)', function () {
        //Verifica Dados da utilização
        var tipoUtilizacao = element(by.model('utilizacao.tipoUtilizacao'));
        var subTipoUtilizacao = element(by.model('utilizacao.subTipoUtilizacao'));
        detalharDestinacao.clicaAccordion('id_acordion_dadosUtilizacao');
        expect(tipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(subTipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.dadosUtilizacaoDiretiva()).toBe(false);
        detalharDestinacao.clicaAccordion('id_acordion_dadosUtilizacao');
    });

    it('Critério 1.4.Dados Responsável / Destinatário (Não apresenta a opção incluir e cancelar. Ao se selecionar editar, ' +
        'apresenta os campos bloqueados sem a opção de incluir)', function () {
        //Verifica Dados Responsavel
        detalharDestinacao.clicaAccordion('dadosResponsavel');
        expect(detalharDestinacao.responsavelDiretiva(0)).toBe(false);
        detalharDestinacao.clicaAccordion('dadosResponsavel');
    });

    it('Critério 1.5.Dados do Instrumento / Ato (Apresenta os campos bloqueados, sem opção de incluir e editar encargos, ' +
        'e sem a opção de incluir e cancelar documentos. Ao se selecionar editar ' +
        'um documento, apresenta os campos bloqueados sem opção de salvar)', function () {
        //Verifica Instrumento ATo
        detalharDestinacao.clicaAccordion('dadosDoInstrumento');
        expect(detalharDestinacao.encargoIsPresent(1)).toBe(false);
        detalharDestinacao.clicaAccordion('dadosDoInstrumento');
        //mudar aba
        detalharDestinacao.avancar();
        //contrato
        var dataFinalContrato = element(by.model('dadosContrato.dataFinal'));
        var dataInicioContrato = element(by.model('dadosContrato.dataInicio'));
        expect(dataFinalContrato.getAttribute('disabled')).toEqual('true');
        expect(dataInicioContrato.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.contratoBloqueado()).toBe(false);
        //documentos
        detalharDestinacao.clicaAccordion('id_acordion_documentos');
        detalharDestinacao.irAoDocumentos(2,2);
        var tipoDocumento = element(by.model('incluirDocumentoCtrl.documento.tipoDocumento'));
        var aditivoDocumento = element(by.model('incluirDocumentoCtrl.documento.dispensado'));
        expect(tipoDocumento.getAttribute('disabled')).toEqual('true');
        expect(aditivoDocumento.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.documentoBloqueado()).toBe(false);
        detalharDestinacao.fechar();
    });

    it('Critério 2.Selecionar a opção "Fechar"', function () {
        detalharDestinacao.fechar();
        expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/consultar')
    });

    it('Critério 3.Selecionar a opção "Cancelar esta Destinação"', function () {
        //Criterio não implementado
    });

    it('Critério 4.Selecionar a opção "Editar"',function () {
        detalharDestinacao.irDestinacao(10, 'Cessão Gratuita');
        detalharDestinacao.editar();
        expect(detalharCessaoGratuita.isEditar()).toBe(true);
    });

});
