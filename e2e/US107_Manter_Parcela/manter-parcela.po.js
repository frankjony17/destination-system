/**
 * Created by rogerio on 05/05/17.
 */
var ManterParcelaPage = function () {

  var EC = protractor.ExpectedConditions;
  var loadingBar = element(by.id('loading-bar'));
  var inputRip = element(by.model('parcelaCtrl.rip'));
  var inputCep = element(by.model('parcelaCtrl.localizacaoEctDto.cep'));
  var inputUf = element(by.model('parcelaCtrl.localizacaoEctDto.uf'));
  var opcoesUf = element.all(by.repeater('uf in parcelaCtrl.ufs'));
  var inputMunicipio = element(by.model('parcelaCtrl.localizacaoEctDto.municipio'));
  var botaoPesquisar = element(by.cssContainingText('.md-button.md-ink-ripple', 'CONSULTAR'));
  var resultadoConsulta = element.all(by.repeater('utilizacoes in parcelaCtrl.listaUtilizacoes'));
  var erroCamposObrigatorios = element(by.className("md-toast-content"));
  var botaoEditar = element(by.css('.hand'));

  //função que preenche os campos, dados informados devem estar de acordo com oqe tem no banco
  this.preencherCampos = function () {
    browser.wait(EC.presenceOf(inputRip), 30000);

    inputRip.sendKeys('00000028');

    //browser.wait(EC.presenceOf(inputMunicipio));

    inputMunicipio.sendKeys('Brasília');

    browser.wait(EC.presenceOf(inputUf), 5000);
    inputUf.click();

    browser.wait(EC.elementToBeClickable(opcoesUf.get(6)), 5000);
    opcoesUf.get(6).click();

    browser.wait(EC.presenceOf(inputCep), 5000);
    inputCep.sendKeys('71900100');
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    return true;
  };
  //retorna true para tentar brecar o click no botão pesquisar
  // clica no botão pesquisar
  this.pesquisar = function () {
    browser.wait(EC.visibilityOf(botaoPesquisar), 5000);
    browser.wait(EC.invisibilityOf(loadingBar),5000);
    botaoPesquisar.click();
    };
  //faz a contagem da lista da pesquisa
  this.resultadoConsultaCount = function () {
    return resultadoConsulta.count();
  };
  //preenche apenas o cep para verificar se busca na base o municipio e a UF correta
  this.preencherCep = function () {
    browser.wait(EC.presenceOf(inputCep));
    inputCep.sendKeys('71900100');
    browser.wait(EC.invisibilityOf(loadingBar), 10000);
    inputRip.sendKeys('');
    browser.sleep(5000);
  };
  //limpa os campos para verificar se os campos UF e municipio são desbloqueados
  this.limparCep = function () {
    inputCep.clear();
    inputRip.sendKeys('');
    browser.wait(EC.elementToBeClickable(inputMunicipio),2000);
  };
  //returna se o campo está ativo
  this.campoAtivado = function () {
    return inputMunicipio.isEnabled();
  };
  //verifica se a mensagem de campo obrigatorio não preenchido apareceu
  this.campoObrigatorioNaoInformado = function () {
    browser.wait(EC.visibilityOf(erroCamposObrigatorios),10000);
    return erroCamposObrigatorios.isPresent();
  };
  //clica no botão de editar para redirecionar ate a tela editar
  this.editar = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 20000);
    browser.wait(EC.visibilityOf(botaoEditar), 20000);
    botaoEditar.click();
  };

};
module.exports = ManterParcelaPage;
