/**
 * Created by rogerio on 20/09/17.
 */
var DetalharCuemPage = function () {

    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));
    var inputInserirImovel = element(by.model('codigoUtilizacao'));
    var botaoSelecionarImovel = element(by.css('[ng-click="selecionarImovel()"]'));
    var inputAtendimento = element(by.model('atendimento.numeroAtendimento'));
    var tipoModalidade = element(by.model('atendimento.tipoModalidade'));
    var ufResponsavel = element(by.model('responsaveis[0].endereco.uf'));
    var municipioResponsavel = element(by.model('responsaveis[0].endereco.municipio'));
    var botaoTresPontosBeneficiadas = element.all(by.css('md-fab-trigger')).get(0);
    var botaoIncluirImovel = element(by.cssContainingText('.md-raised.margin-lateral-label.md-button.flex-xs-40.flex-30', 'INCLUIR'));
    var botaoIncluirFamiliaBeneficiadas = element(by.cssContainingText('.md-raised.md-button.flex-xs-40.flex-30', 'INCLUIR BENEFICIÁRIOS'));
    var inputCpfCnpjResponsavel = element(by.model('responsavel.cpfCnpj'));

    this.botaoEInputImovelVisivel = function () {
        return inputInserirImovel.isDisplayed() && botaoSelecionarImovel.isDisplayed();
    };

    this.verificaEditar = function () {
        browser.wait(EC.visibilityOf(inputProcesso),40000);
        return inputProcesso.isEnabled();
    };

    this.verificarDiretivaAtendimento = function () {
        return inputProcesso.isEnabled() || inputAtendimento.isEnabled() || tipoModalidade.isEnabled() ;
    };

    this.isEditar =  function () {
        return inputProcesso.isEnabled();
    };

    this.responsavelNaoBloqueado = function () {
        return ufResponsavel.isEnabled() || municipioResponsavel.isEnabled() || botaoTresPontosBeneficiadas.isDisplayed()
        || botaoIncluirImovel.isDisplayed() || botaoIncluirFamiliaBeneficiadas.isDisplayed() || inputCpfCnpjResponsavel.isDisplayed();
    }


};
module.exports = DetalharCuemPage;
