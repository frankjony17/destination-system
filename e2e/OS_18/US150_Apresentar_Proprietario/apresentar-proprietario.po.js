/**
 * Created by haillanderson on 20/09/17.
 */
var ApresentarProprietario = function () {
    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var inputRip = element(by.model('inserirDadosImovelParcelaCtrl.dadosUtilizacao'));
    var botaoSelecionar = element(by.id('btn-selecionar-imovel'));
    var botaoIncluir = element(by.id('btn-incluir-imovel'));
    var botaoIncluirImovelParcela = element(by.id('btn-incluir-imovel-parcela'));

    this.inserirImovel = function () {
        browser.wait(EC.visibilityOf(botaoIncluirImovelParcela),4000);
        browser.wait(EC.elementToBeClickable(botaoIncluirImovelParcela),4000);
        botaoIncluirImovelParcela.click();
        browser.wait(EC.visibilityOf(inputRip),4000);
        inputRip.sendKeys('0000000700000000');
        browser.wait(EC.visibilityOf(botaoSelecionar),4000);
        browser.wait(EC.elementToBeClickable(botaoSelecionar),4000);
        botaoSelecionar.click();
        browser.wait(EC.invisibilityOf(loadingBar),4000);
        browser.sleep(2000);
        browser.wait(EC.visibilityOf(botaoIncluir),4000);
        browser.wait(EC.elementToBeClickable(botaoIncluir),4000);
        botaoIncluir.click();
    };
};
module.exports = ApresentarProprietario;
