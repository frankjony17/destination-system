/**
 * Created by haillanderson on 20/09/17.
 */
var DetalharDoacao = function () {
    var EC = protractor.ExpectedConditions;
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));
    var botaoIncluirImovel = element(by.id('btn-abrir-incluir-imovel'));
    var iconeExcluirImovel = element.all(by.css('ng-md-icon[icon=close]')).get(0);
    var inputAtendimento = element(by.model('atendimento.numeroAtendimento'));
    var inputTipoInstrumento = element(by.model('atendimento.tipoInstrumento'));
    var inputTipoDoacao = element(by.model('atendimento.tipoDoacao'));

    this.verificaBotaoIncluirImovel = function () {
        return botaoIncluirImovel.isDisplayed();
    };

    this.verificaIconeExcluir = function () {
        return iconeExcluirImovel.isDisplayed();
    };

    this.verificaEditar = function () {
        browser.wait(EC.visibilityOf(inputProcesso),40000);
        return inputProcesso.isEnabled();
    };

    this.verificarDiretivaAtendimento = function () {
        return inputProcesso.isEnabled() || inputAtendimento.isEnabled()
            || inputTipoInstrumento.isEnabled() || inputTipoDoacao.isEnabled();
    };
};
module.exports = DetalharDoacao;
