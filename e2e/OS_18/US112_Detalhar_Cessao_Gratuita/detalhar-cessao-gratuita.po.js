/**
 * Created by rogerio on 14/09/17.
 */
var DetalharCessaoGratuitaPage = function () {

    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));

    this.isEditar =  function () {
        return inputProcesso.isEnabled();
    };
};
module.exports = DetalharCessaoGratuitaPage;
