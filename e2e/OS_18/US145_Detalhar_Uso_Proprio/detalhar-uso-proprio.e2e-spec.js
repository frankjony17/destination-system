/**
 * Created by rogerio on 14/09/17.
 */
const DetalharUsoProprioPage = require('./detalhar-uso-proprio.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US145 – Detalhar Uso Próprio', function () {
    var detalharUsoProprio = new DetalharUsoProprioPage();
    var detalharDestinacao = new DetalharDestinacaoPage();

    it('Critério 1.Apresentar campos bloqueados', function () {
        detalharDestinacao.irDestinacao(10, 'Uso Próprio');
        // Verificar se os campos estão bloqueados para edição ok
        // Verificar se DADOS DO IMÓVEL apresenta apenas a tabela ok
        // Verificar se na linha da tabela apresenta apenas o icone editar
        // Verificar se FOTOS apresenta apenas a tabela
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-uso-proprio');

        detalharDestinacao.editarImovel();
        expect(detalharDestinacao.imovelBloqueado()).toBe(false);
        detalharDestinacao.voltar();

        detalharDestinacao.clicaAccordion('accordion-dados-imovel-uso-proprio');
        expect(detalharUsoProprio.getTabelaImoveis().isDisplayed()).toBe(true);

        expect(detalharUsoProprio.getTipoUtilizacao().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getSubTipoUtilizacao().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getDescricaoFinalidade().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getNumeroFamiliasBeneficiadas().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getNumeroServidores().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getAreaServidor().getAttribute('disabled')).toEqual('true');
        
        expect(detalharUsoProprio.getTipoDeProprietario().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getOrgaoEntidade().getAttribute('disabled')).toEqual('true');
        expect(detalharUsoProprio.getUnidadeUsuario().getAttribute('disabled')).toEqual('true');

        expect(detalharUsoProprio.isEnabledDadosUtilizacaoDiretivaDataObs()).toBe(false);

        detalharDestinacao.clicaAccordion('painel-fotos');
        expect(detalharUsoProprio.getIncluirFotos().isDisplayed()).toBe(false);
        expect(detalharUsoProprio.isEnabledBotaoAdicionarFoto()).toBe(false);
        expect(detalharUsoProprio.getTabelaFotos().isDisplayed()).toBe(true);
    });
    it('Critério 2.Apresentar dados da Homologação', function () {
        expect(detalharUsoProprio.getObservacao().getText()).toEqual('');
        expect(detalharUsoProprio.getAccordionObservacao().isDisplayed()).toBe(false);
    });
    it('Critério 3.Selecionar a opção "Fechar"', function () {
        detalharUsoProprio.fechar();
        expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/consultar')
    });
    it('Critério 4.Selecionar a opção "Cancelar esta Destinação"', function () {
        //Criterio não implementado
    });
    it('Critério 5 - Apresentar opção "Editar"',function () {
        detalharDestinacao.irDestinacao(10, 'Uso Próprio');
        expect(detalharUsoProprio.botaoEditarHabilitado()).toBe(true);
    });
    it('Critério 6.Selecionar a opção "Editar"',function () {
        detalharUsoProprio.editar();
        expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/usoProprio')
        // Verificar campos habilitados para edição
    
    
    });

});
