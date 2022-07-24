var DetalharPermissao = function () {

    var EC = protractor.ExpectedConditions;
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));
    var botaoIncluirImovel = element(by.id('btn-abrir-incluir-imovel'));
    var iconeExcluirImovel = element.all(by.css('ng-md-icon[icon=close]')).get(0);

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


};
module.exports = DetalharPermissao;
