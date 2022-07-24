const AbrirPage = require('../abrirPage.po');

var CriarParcelaPage = function () {

  var EC = protractor.ExpectedConditions;
  var loadingBar = element(by.id('loading-bar'));
  var inputRip = element(by.model('parcelaCtrl.rip'));
  var inputCep = element(by.model('parcelaCtrl.localizacaoEctDto.cep'));
  var inputUf = element(by.model('parcelaCtrl.localizacaoEctDto.uf'));
  var opcoesUf = element.all(by.repeater('uf in parcelaCtrl.ufs'));
  var inputMunicipio = element(by.model('parcelaCtrl.localizacaoEctDto.municipio'));
  var botaoPesquisar = element(by.cssContainingText('.md-button.md-ink-ripple', 'CONSULTAR'));
  var resultadoConsulta = element.all(by.repeater('utilizacoes in parcelaCtrl.listaUtilizacoes'));
  var cbxParcela = element(by.id('cbx-parcela'));
  var botaoEditar = element(by.id('icon-editar-parcela'));
  var lbAreaParcela = element(by.id('lb-area-parcela'));
  var inAreaParcela = element(by.id('in-area-parcela'));
  var toastError = element(by.className("md-toast-content"));
  var spAreaParcelaRemanescente = element(by.id('sp-valor-area-parcela-remanescente'));
  var diretivaParcelaRemanescente = element(by.id('diretiva-parcela-remanescente'));
  var btnFechar = element(by.id('btn-fechar-parcela'));
  var btnLimpar = element(by.id('btn-limpar-parcela'));
  var btnSalvar = element(by.id('btn-salvar-parcela'));
  var memorialParcelaNova = element(by.id('memorial-nova-parcela'));
  var memorialParcelaRemanescente = element(by.id('memorial-parcela-remanescente'));
  var parcelasSalvas = element.all(by.repeater('parcela in criarParcelaCtrl.todasParcelas'));

  var abrirPage = new AbrirPage();

  this.acessarPaginaCriarParcela = function () {
    abrirPage.abrir();
    abrirPage.abrirPagina('GERENCIAR PARCELAS');

    inputRip.sendKeys('00000028');
    inputMunicipio.sendKeys('Brasília');
    browser.wait(EC.presenceOf(inputUf), 5000, 'Aguardando preencher campo municipio');
    inputUf.click();
    browser.wait(EC.elementToBeClickable(opcoesUf.get(6)), 5000, 'Aguardando renderizar as opções do combo UF');
    opcoesUf.get(6).click();
    browser.wait(EC.presenceOf(inputCep), 5000, 'Aguardando selecionar UF');
    inputCep.sendKeys('71900100');
    browser.wait(EC.invisibilityOf(loadingBar), 9000, 'Aguardando loading bar desaparecer');
    botaoPesquisar.click();    
    browser.sleep(9000);    
    botaoEditar.click();
    
  };

  this.abrirAcordion = function() {
    var acordion = element(by.id('accordion-dados-imovel-parcela'));
    acordion.click();    
  };

  this.contarQtdBenfeitorias = function() {
      var quantidadeBenfeitorias = element.all(by.repeater('benfeitoria in criarParcelaCtrl.dadosRipUtilizacao.benfeitorias'));
      return quantidadeBenfeitorias.count();
  };

  this.detalharBenfeitoria = function() {
      browser.sleep(5000);
      element.all(by.repeater('benfeitoria in criarParcelaCtrl.dadosRipUtilizacao.benfeitorias'))
        .then(function(detalhar) {
        var btnDetalharBenfeitoria = detalhar[0].element(by.id('btn-detalhar-benfeitoria'));
        btnDetalharBenfeitoria.click();
      });
      
  };

    this.verificarUmaParcela = function() {
        var qtdParcelas = element.all(by.repeater('parcela in criarParcelaCtrl.dadosRipUtilizacao.parcelas'));
        return qtdParcelas.count() > 0;
    };

    this.verificarComboDesabilitado = function() {        
        return cbxParcela.getAttribute('disabled') == 'disabled';
    };

    this.verificarParcelaP0Selecionada = function() {
        return cbxParcela.getText() == 'P0';
    };

    this.preencherAreaNovaParcela = function(valor) {
        inAreaParcela.sendKeys(valor); 
    };

    this.clicarForaCampo = function() {
        browser.sleep(5000);
        lbAreaParcela.click()
    }

    this.existeMensagemErro = function() {
        browser.wait(EC.visibilityOf(toastError), 5000, 'Aguardando mensagem de erro aparecer');
        return toastError.isPresent();
    };

    this.parcelaRemanescenteVisivel = function() {

        return browser.wait(function() {
            return diretivaParcelaRemanescente.isPresent().then(function(valor) {
                return valor;
            });
        });
        
    };

    this.areaParcelaRemanescenteCalculadaCorreta = function() {

         return browser.wait(function() {
            return spAreaParcelaRemanescente.getText().then(function(texto) {
                return texto === '2.213,21'
            });
        });

    };

    this.marcarBenfeitoriasNovaParcela = function() {
        var cbxCheckAllBenfeitorias = element(by.id('cbx-checkall-benfeitorias-nova-parcela'));
        cbxCheckAllBenfeitorias.click();
        browser.wait(EC.elementToBeClickable(cbxCheckAllBenfeitorias), 5000, 'Aguardando selecionar todas as benfeitorias');
        var benfeitorias = element.all(by.repeater('benfeitoria in parcelaRemanescente.benfeitorias'));
        var benfeitoriasRemanescentes = 
        benfeitorias.then(function(checkBox) {
            return checkBox[0].element(by.id('cbx-benfeitoria-parcela-remanescente')).isSelected().then(function(checked) {
                return checked;
            });
        });

        browser.sleep(5000);
        return benfeitoriasRemanescentes;                    
    };

    this.limparFormulario = function() {
        btnLimpar.click();
        browser.sleep(2000);
        return inAreaParcela.getText();
    };

    this.fechar = function() {        
        btnFechar.click();
        browser.wait(EC.presenceOf(inputCep), 5000, 'Aguardando campo UF aparecer na tela');
    };

    this.salvar = function() {
        memorialParcelaNova.sendKeys('teste');
        memorialParcelaRemanescente.sendKeys('teste');
        browser.sleep(2000);
        btnSalvar.click();
        browser.wait(EC.invisibilityOf(loadingBar), 9000, 'Aguardando loading bar desaparecer');
        return parcelasSalvas.count();
    };

};

module.exports = CriarParcelaPage;