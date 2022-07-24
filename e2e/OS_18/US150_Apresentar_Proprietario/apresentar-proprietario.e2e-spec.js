/**
 * Created by haillanderson on 20/09/17.
 */
const ApresentarProprietario = require('./apresentar-proprietario.po');
const DetalharDestinacaoPage = require('../../detalharDestinacao.po');

describe('Teste e2e da historia US150 - Apresentar Proprietário', function () {
    var apresentarProprietario = new ApresentarProprietario();
    var detalharDestinacao = new DetalharDestinacaoPage();

    it('Critério 1 - Apresentar dados de proprietário', function () {
        browser.get('http://su-spu.basis.com.br/#/destinacao/usoProprio');
        detalharDestinacao.clicaAccordion('accordion-dados-imovel-uso-proprio');
        apresentarProprietario.inserirImovel();
        detalharDestinacao.clicaAccordion('accordion-dados-responsavel-uso-proprio');
        var inputTipoProprietario = element(by.model('usoProprio.responsavel.tipoProprietarioReal'));
        var inputOrgaoEntidade = element(by.id('input-orgao-entidade'));
        var inputUgEspecifica = element(by.id('input-unidade-usuario'));
        var radioButtonIntegralmente = element(by.css('[ng-value="true"]'));
        var radioButtonParcialmente = element(by.css('[ng-value="false"]'));

        expect(inputTipoProprietario.getAttribute('disabled')).toBe('true');
        expect(inputOrgaoEntidade.getAttribute('disabled')).toBe('true');
        expect(inputUgEspecifica.getAttribute('disabled')).toBe('true');
        expect(radioButtonIntegralmente.getAttribute('disabled')).toBe('true');
        expect(radioButtonParcialmente.getAttribute('disabled')).toBe('true');
    });
});
