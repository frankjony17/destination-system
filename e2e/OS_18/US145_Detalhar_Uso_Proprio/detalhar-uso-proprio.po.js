/**
 * Created by rogerio on 14/09/17.
 */
var DetalharUsoProprioPage = function () {
    
    var EC = protractor.ExpectedConditions;
    var loadingBar = element(by.id('loading-bar'));
    var botaoFechar = element(by.buttonText('FECHAR'));
    var botaoEditar = element(by.buttonText('EDITAR'));
    var observacao = element(by.model('usoProprioCtrl.usoProprio.observacao'));
    var botaoAdicionarFoto = element(by.cssContainingText('.md-raised.btn-margin-bottom.md-button.md-ink-ripple', 'ADICIONAR'));
    var dataUtilizacao = element(by.model('utilizacao.dataUtilizacao'));
    var anotacoes = element(by.model('utilizacao.anotacoes'));
    var tipoUtilizacao = element(by.model('utilizacao.tipoUtilizacao'));
    var subTipoUtilizacao = element(by.model('utilizacao.subTipoUtilizacao'));
    var descricaoFinalidade = element(by.model('utilizacao.finalidade'));
    var numeroFamiliasBeneficiadas = element(by.model('utilizacao.numeroFamiliasBeneficiadas'));
    var numeroServidores = element(by.model('utilizacao.numeroServidores'));
    var areaServidor = element(by.model('utilizacao.areaServidor'));
    var tipoDeProprietario = element(by.model('usoProprio.responsavel.tipoProprietarioReal'));
    var orgaoEntidade = element(by.id('input-orgao-entidade'));
    var unidadeUsuario = element(by.id('input-unidade-usuario'));
    var incluirFotos = element(by.id('incluirFotos'));
    var tabelaFotos = element(by.id('tabelaFotos'));
    var tabelaImoveis = element(by.id('tabelaImoveis'));
    var botaoIncluirImovel = element(by.cssContainingText('.md-raised.md-button.md-ink-ripple', 'INCLUIR IMÓVEL/PARCELA'));
    var accordionObservacao = element(by.id('accordion-observacao'));

    this.getObservacao = function(){
        return observacao;
    }
    
    this.fechar = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 80000);
        botaoFechar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 80000);
    };

    this.cancelar = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        botaoFechar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
    };
    
    //Verifica se o botão editar está habilitado
    this.botaoEditarHabilitado = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        return botaoEditar.isEnabled();
    };

    //Verifica se os campos do formulário estão desabilitados
    this.camposDesabilitados = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 40000);
        return !(tipoUtilizacao.isEnabled() && subTipoUtilizacao.isEnabled());
        
    };

    this.editar = function () {
        browser.wait(EC.invisibilityOf(loadingBar), 80000);
        botaoEditar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 80000);
    };

    this.isEnabledDadosUtilizacaoDiretivaDataObs = function () {
        return dataUtilizacao.isDisplayed() || anotacoes.isDisplayed();
    };

    this.isEnabledBotaoAdicionarFoto = function(){
        return botaoAdicionarFoto.isDisplayed();
    }
    
    this.getTipoUtilizacao = function(){
        return tipoUtilizacao;
    }

    this.getSubTipoUtilizacao = function(){
        return subTipoUtilizacao;
    }

    this.getDescricaoFinalidade = function(){
        return descricaoFinalidade;
    }

    this.getNumeroFamiliasBeneficiadas = function(){
        return numeroFamiliasBeneficiadas;
    }

    this.getNumeroServidores = function(){
        return numeroServidores;
    }

    this.getAreaServidor = function(){
        return areaServidor;
    }

    this.getTipoDeProprietario = function(){
        return tipoDeProprietario;
    }

    this.getOrgaoEntidade = function(){
        return orgaoEntidade;
    }

    this.getUnidadeUsuario = function(){
        return unidadeUsuario;
    }

    this.getIncluirFotos = function(){
        return incluirFotos;
    }

    this.getTabelaFotos = function(){
        return tabelaFotos;
    }

    this.getTabelaImoveis = function(){
        return tabelaImoveis;
    }

    this.isEnabledBotaoIncluirImovel = function(){
        return botaoIncluirImovel.isDisplayed();
    }

    this.getAccordionObservacao = function(){
        return accordionObservacao;
    }

};
module.exports = DetalharUsoProprioPage;
