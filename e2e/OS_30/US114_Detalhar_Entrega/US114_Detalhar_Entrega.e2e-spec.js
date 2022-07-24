const detalharEntrega = require('./US114_Detalhar_Entrega.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US114 detalhar entrega da utilização de destinação', function () {
    var EC = protractor.ExpectedConditions;
    var detalharEntregar = new detalharEntrega();
    var detalharDestinacao = new DetalharDestinacaoPage();
    it('Critério 1.1 - Dados do Cancelamento/Encerramento da Utilização (apresenta a funcionalidade' +
        ' US163 – Apresentar Dados de Cancelamento)', function () {
        detalharDestinacao.irDestinacao(6,'Termo Entrega');
        //Funcionalidade Não implementada

        console.log('Critério 1.1 - Dados do Cancelamento/Encerramento da Utilização (apresenta a funcionalidade US163 – Apresentar Dados de Cancelamento)')
    });

    it('Critério 1.2 - Dados do Imóvel ( Não apresenta a opção de incluir e cancelar imóvel/parcela)', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-entrega');
        console.log('Critério 1.2 - Dados do Imóvel ( Não apresenta a opção de incluir e cancelar imóvel/parcela)')
    });

    it('Critério 1.3 - Dados Responsável / Destinatário (Não apresenta a opção incluir e cancelar.' +
        ' Ao se selecionar editar, apresenta os campos bloqueados sem a opção de incluir)', function () {

        var tipoUtilizacao = element(by.model('utilizacao.tipoUtilizacao'));
        var subTipoUtilizacao = element(by.model('utilizacao.subTipoUtilizacao'));
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel');
        expect(tipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(subTipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.dadosUtilizacaoDiretiva()).toBe(false);
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel');

        console.log('Critério 1.3 - Dados Responsável / Destinatário (Não apresenta a opção incluir e cancelar.Ao se selecionar editar, apresenta os campos bloqueados sem a opção de incluir)\'')
    });

    it('Abrir detalhar Accordion dados da utilizacao(Não apresentar opção incluir e cancelar )', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-utilizacao');
        var tipoUtilizacao = element(by.model('utilizacao.tipoUtilizacao'));
        var subTipoUtilizacao = element(by.model('utilizacao.subTipoUtilizacao'));
        expect(tipoUtilizacao.getAttribute('disabled')).toEqual('true');
        expect(subTipoUtilizacao.getAttribute('disabled')).toEqual('true');
        detalharDestinacao.clicaAccordion('accordion-dados-utilizacao');
        console.log('Abrir detalhar Accordion dados da utilizacao(Não apresentar opção incluir e cancelar ')
    });

    it('Critério 1.6 - Dados do Instrumento / Ato (Apresenta os campos bloqueados, sem opção de incluir' +
        ' e editar encargos, e sem a opção de incluir e cancelar documentos. Ao se selecionar editar um' +
        ' documento, apresenta os campos bloqueados sem opção de salvar)', function () {
        detalharDestinacao.clicaAccordion('accordion-dados-instrumento');
        detalharDestinacao.avancar();

        //contrato
        var dataFinalContrato = element(by.model('dadosContrato.dataFinal'));
        var dataInicioContrato = element(by.model('dadosContrato.dataInicio'));
        expect(dataFinalContrato.getAttribute('disabled')).toEqual('true');
        expect(dataInicioContrato.getAttribute('disabled')).toEqual('true');
        expect(detalharDestinacao.contratoBloqueado()).toBe(false);

        //documentos
        detalharDestinacao.clicaAccordion('accordion-documento-entrega');
        console.log('Critério 1.6 - Dados do Instrumento / Ato (Apresenta os campos bloqueados, sem opção de incluir e editar encargos, e sem a opção de incluir e cancelar documentos. Ao se selecionar editar um documento, apresenta os campos bloqueados sem opção de salvar)')
    });

    it('Critério 2.Selecionar a opção "Fechar"', function () {
        detalharDestinacao.fechar();
        expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/consultar');
        console.log('Critério 2.Selecionar a opção "Fechar"')
    });

    it('Critério 3.Selecionar a opção "Cancelar esta Destinação"', function (){
        //Criterio não implementado
        console.log('Critério 3.Selecionar a opção "Cancelar esta Destinação"')
    });

});
