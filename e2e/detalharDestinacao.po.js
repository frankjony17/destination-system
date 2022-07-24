/**
 * Created by rogerio on 15/09/17.
 */
var DetalharDestinacaoPage = function () {

    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var inputUF = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.uf'));
    var opcoesUF = element.all(by.repeater('uf in consultarDestinacaoCtrl.ufs'));
    var inputInstrumentoDestinacao = element(by.model('consultarDestinacaoCtrl.destinacaoFiltro.tiposDestinacao'));
    var botaoPesquisar = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'PESQUISAR'));
    var listaDestinacao = element(by.repeater('destinacao in consultarDestinacaoCtrl.destinacoes'));
    var botaoTresPontos = element.all(by.css('md-fab-trigger')).get(0);
    var botaoDetalhar = element.all(by.css('md-fab-actions ng-md-icon[icon=search]')).get(0);
    var botaoFechar = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'FECHAR'));
    var botaoEditar = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'EDITAR'));
    var inputResponsavel = element(by.model('responsavel.cpfCnpj'));
    var botaoEncargo = element(by.id('btn-abrir-Incluir-Encargos'));
    var inputFundamentoLegal = element(by.model('fundamento'));
    var botaoAvancar = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'AVANÇAR'));
    var inputNumeroContrato = element(by.model('dadosContrato.numero'));
    var tituloDocumento = element(by.cssContainingText('.titulo-verde-header.ng-binding', 'DOCUMENTOS'));
    var justificativaDocumento = element(by.model('incluirDocumentoCtrl.documento.justificativa'));
    var descricaoFinalidade = element(by.model('utilizacao.finalidade'));
    var numeroFamiliasBeneficiadas = element(by.model('utilizacao.numeroFamiliasBeneficiadas'));
    var numeroServidores = element(by.model('utilizacao.numeroServidores'));
    var areaServidor = element(by.model('utilizacao.areaServidor'));
    var botaoTresPontosImovel = element.all(by.css('md-fab-trigger')).get(0);
    var botaoEditarImovel = element.all(by.css('md-fab-actions ng-md-icon[icon=edit]')).get(0);
    var inputInserirImovel = element(by.model('inserirDadosImovelParcelaCtrl.dadosUtilizacao'));
    var botaoInserirImovel = element(by.id('btn-selecionar-imovel'));
    var tituloPaginaImovel = element(by.cssContainingText('.titulo-verde-header.ng-binding', 'INSERIR DADOS DO IMÓVEL PARCELA'));
    var botaoVoltarImovel = element(by.cssContainingText('.md-raised.margem-botoes-modal.md-button.md-ink-ripple', 'VOLTAR'));
    var inputProcesso = element(by.model('atendimento.numeroProcedimento'));

    //seleciona a uf para pesquisar
    this.selecionarUf = function (uf) {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        browser.wait(EC.visibilityOf(inputUF), 15000);
        browser.wait(EC.elementToBeClickable(inputUF), 15000);
        inputUF.click();

        browser.wait(EC.elementToBeClickable(opcoesUF.get(uf)), 5000);
        opcoesUF.get(uf).click();
        browser.wait(EC.invisibilityOf(loadingBar), 15000);
    };
    // clica no botão pesquisar
    this.selecionarInstrumentoDestinacao = function (destinacao) {
        browser.sleep(2000);
        browser.wait(EC.elementToBeClickable(inputInstrumentoDestinacao), 15000);
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        inputInstrumentoDestinacao.click();
        var tipoDestinacao = element(by.cssContainingText('.md-text.ng-binding', destinacao));
        browser.wait(EC.visibilityOf(tipoDestinacao), 15000);
        tipoDestinacao.click();
        var tab = browser.actions().sendKeys(protractor.Key.TAB);
        tab.perform();
    };

    //Clica no botão pesquisar e retorna a lista
    this.pesquisar = function () {
        browser.sleep(2000);
        browser.wait(EC.visibilityOf(botaoPesquisar), 5000);
        botaoPesquisar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 5000);

    };
    //verifica a lista da consulta
    this.irAoDetalhar = function () {
        browser.wait(EC.visibilityOf(listaDestinacao), 15000);
        browser.wait(EC.invisibilityOf(loadingBar), 15000);
        botaoTresPontos.click();
        browser.sleep(2000);
        botaoDetalhar.click();
        browser.sleep(2000);
    };
    //Ir ate a destincao
    this.irDestinacao = function (uf, destinacao) {
        browser.get('http://su-spu.basis.com.br/#/destinacao/consultar');
        this.selecionarUf(uf);
        this.selecionarInstrumentoDestinacao(destinacao);
        this.pesquisar();
        this.irAoDetalhar();
    };

    this.fechar = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        botaoFechar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
    };

    this.editar = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        browser.wait(EC.elementToBeClickable(botaoEditar), 40000);
        botaoEditar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
    };

    this.clicaAccordion = function (idAccordion) {
        var acordion = element(by.id(idAccordion.toString()));
        browser.wait(EC.invisibilityOf(loadingBar),40000);
        browser.wait(EC.visibilityOf(acordion),40000);
        browser.wait(EC.elementToBeClickable(acordion),40000);
        browser.sleep(1000);
        acordion.click();
    };
    //index é a posição na lista de incones close começando por 0
    this.responsavelDiretiva = function (index) {
        var xResponsavel = element.all(by.css('[icon=close]')).get(index);
        return inputResponsavel.isDisplayed() || xResponsavel.isDisplayed();
    };
    //index é a posição na lista de fabActions começando por 0
    this.encargoIsPresent = function (index) {
        var botaoTresPontosEncargo = element.all(by.css('md-fab-trigger')).get(index);
        return botaoTresPontosEncargo.isDisplayed() || inputFundamentoLegal.isEnabled() || botaoEncargo.isDisplayed();
    };

    this.avancar = function () {
        browser.wait(EC.visibilityOf(botaoAvancar), 4000);
        browser.sleep(2000);
        botaoAvancar.click();
        browser.wait(EC.visibilityOf(inputNumeroContrato), 4000);
    };

    this.contratoBloqueado = function () {
        return inputNumeroContrato.isEnabled();
    };

    this.irAoDocumentos = function (index, indexEditar) {
        var botaoTresPontosDocumento = element.all(by.css('md-fab-trigger')).get(index);
        browser.wait(EC.visibilityOf(botaoTresPontosDocumento), 4000);
        botaoTresPontosDocumento.click();
        var botaoEditarFab = element.all(by.css('md-fab-actions ng-md-icon[icon=edit]')).get(indexEditar);
        browser.wait(EC.visibilityOf(botaoEditarFab), 3000);
        browser.sleep(2000);
        botaoEditarFab.click();
        browser.wait(EC.visibilityOf(tituloDocumento), 5000);
    };

    this.documentoBloqueado = function () {
        return justificativaDocumento.isEnabled();
    };

    this.dadosUtilizacaoDiretiva = function () {
        return descricaoFinalidade.isEnabled() || numeroFamiliasBeneficiadas.isEnabled()
            || numeroServidores.isEnabled() || areaServidor.isEnabled();
    };

    this.editarImovel = function () {
        browser.wait(EC.visibilityOf(botaoTresPontosImovel), 4000);
        browser.wait(EC.elementToBeClickable(botaoTresPontosImovel), 4000);
        botaoTresPontosImovel.click();
        browser.wait(EC.visibilityOf(botaoEditarImovel), 4000);
        browser.wait(EC.elementToBeClickable(botaoEditarImovel), 4000);
        browser.sleep(2000);
        botaoEditarImovel.click();
    };

    this.voltar = function () {
        browser.wait(EC.visibilityOf(botaoVoltarImovel), 4000);
        botaoVoltarImovel.click();
        browser.wait(EC.invisibilityOf(loadingBar), 4000);
        browser.wait(EC.visibilityOf(inputProcesso), 4000);
    };

    this.imovelBloqueado = function () {
        browser.wait(EC.visibilityOf(tituloPaginaImovel), 10000);
        return inputInserirImovel.isDisplayed() || botaoInserirImovel.isDisplayed();
    };

};
module.exports = DetalharDestinacaoPage;
