/**
 * Created by haillanderson on 15/09/17.
 */
var DetalharCDRU = function () {

    var EC = protractor.ExpectedConditions;
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));
    var botaoIncluirImovel = element(by.id('btn-abrir-incluir-imovel'));
    var iconeExcluirImovel = element.all(by.css('ng-md-icon[icon=close]')).get(0);
    var inputNumeroProcesso = element(by.model('licitacao.numeroProcesso'));
    var botaoAdicionarArquivoDocumento = element(by.id('btn-adicionar-arquivo-documento'));
    var iconeDelete = element.all(by.css('[icon=delete]')).get(0);
    var inputValor = element(by.model('financeiro.valor'));
    var inputPeriodicidade = element(by.model('financeiro.tipoPeriocidade'));
    var inputPrazoInicioCobranca = element(by.model('financeiro.dataInicioCobranca'));
    var inputIndiceReajusteAnual = element(by.model('financeiro.tipoIndiceReajusteAnual'));
    var inputPrazoCarenciaMeses = element(by.model('financeiro.carenciaMeses'));
    var inputMesAnoReajusteContratual = element(by.model('financeiro.mesAnoReajuste'));
    var inputDiaVencimentoDebito = element(by.model('financeiro.diaVencimento'));
    var inputJurosMensal = element(by.model('financeiro.tipoJurosMensal'));
    var inputIndiceJurosMensal = element(by.model('financeiro.tipoIndiceJurosMensal'));
    var inputMultaInadiplencia = element(by.model('financeiro.multaInadimplacia'));
    var inputAtendimento = element(by.model('atendimento.numeroAtendimento'));

    this.verificaEditar = function () {
        browser.wait(EC.visibilityOf(inputProcesso),40000);
        return inputProcesso.isEnabled();
    };

    this.verificaBotaoIncluirImovel = function () {
        return botaoIncluirImovel.isDisplayed();
    };

    this.verificaIconeExcluir = function () {
        return iconeExcluirImovel.isDisplayed();
    };

    this.verificaDiretivaLicitacao = function () {
        return inputNumeroProcesso.isEnabled()
            || botaoAdicionarArquivoDocumento.isDisplayed() || iconeDelete.isDisplayed();
    };

    this.verificaDiretivaFinanceiro = function () {
        return inputValor.isEnabled() || inputPeriodicidade.isEnabled()
            || inputPrazoInicioCobranca.isEnabled() || inputIndiceReajusteAnual.isEnabled()
            || inputPrazoCarenciaMeses.isEnabled() || inputMesAnoReajusteContratual.isEnabled()
            || inputDiaVencimentoDebito.isEnabled() || inputJurosMensal.isEnabled()
            || inputIndiceJurosMensal.isEnabled() || inputMultaInadiplencia.isEnabled();
    };

    this.verificarDiretivaAtendimento = function () {
        return inputNumeroProcesso.isEnabled() || inputAtendimento.isEnabled();
    };
};
module.exports = DetalharCDRU;
