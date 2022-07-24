/**
 * Created by haillanderson on 29/05/17.
 */
var PosseInformalPage = function () {

  var EC = protractor.ExpectedConditions;
  var inputRip = element(by.model('destinacao.imovel.rip'));
  var mensagemErro = element(by.css('[md-theme="error-toast"]'));
  var dadosEndereco = element(by.binding('destinacao.imovel.endereco.bairro'));
  var botaoConsultar = element(by.cssContainingText('.md-button.md-ink-ripple', 'CONSULTAR'));
  var botaoIncluir = element(by.cssContainingText('.md-button.md-ink-ripple', 'INCLUIR INTERESSADO'));
  var botaoIncluirModal = element(by.css('[ng-click="incluirInteressadoCtrl.incluir(interessado)"]'));
  var botaoConfirmarModal = element(by.css('[ng-click="incluirInteressadoCtrl.confirmar();"]'));
  var botaoConfirmarExclusaoInteressado = element(by.css('[ng-click="dialog.hide()"]'));
  var botaoConfirmar = element(by.css('[ng-click="posseCtrl.salvar()"]'));
  var botaoFechar = element(by.css('[ng-click="posseCtrl.fechar()"]'));
  var botaoNaoConfirmarFechar = element(by.css('[ng-click="dialog.abort()"]'));
  var acordionDadosInteressado = element(by.css('[ng-show="posseCtrl.posseInformal.mostrarDadosImovel"]'));
  var inputTipoPosse = element(by.model('posseInformal.tipoPosse'));
  var inputNomeEntidade = element(by.model('posseInformal.nomeEntidade'));
  var inputCNPJEntidade = element(by.model('posseInformal.cnpj'));
  var inputCNPJInteressado = element(by.model('incluirInteressadoCtrl.interessado.cpfCnpj'));
  var inputUG = element(by.model('incluirInteressadoCtrl.interessado.ug'));
  var inputAreaUtilizada = element(by.model('incluirInteressadoCtrl.interessado.areaUtilizada'));
  var dadosInteressadoModal = element.all(by.repeater('item in incluirInteressadoCtrl.interessados'));
  var dadosInteressado = element.all(by.repeater('item in posseInformal.interessados'));
  var opcoesTipoPosse = element.all(by.repeater('item in tiposPosse'));
  var loadingBar = element(by.id('loading-bar'));
  var tituloModal = element(by.tagName('h2'));
  var dialogConfirmarExclusao = element(by.className('md-dialog-content'));

  // clica no botão concultar
  this.consultar = function () {
    browser.wait(EC.visibilityOf(botaoConsultar),4000);
    botaoConsultar.click();
  };

  // insere um RIP inexistente (inválido) na base de dados
  this.insereRipInvalido = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.presenceOf(inputRip));

    inputRip.sendKeys('00000027');
    return true;
  };

  // insere um RIP válido
  this.insereRipValido = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.presenceOf(inputRip));

    inputRip.sendKeys('00000028');
    return true;
  };

  //verifica se a mensagem de RIP inválido apareceu
  this.ripInvalido = function () {
    browser.wait(EC.presenceOf(mensagemErro), 20000, "A mensagem rip inválido não apareceu");
    return browser.wait(EC.textToBePresentInElement(mensagemErro, 'RIP invalido'));
  };

  //retorna o valor do inputRip
  this.getValorInputRip = function () {
    return inputRip.getText();
  };

  //Verifica se os dados do endereco são vazios
  this.dadosEnderecoVazio = function () {
    return dadosEndereco.getText() == '';
  };

  //Verifica se o acordion de dados interessados apareceu
  this.acordionDadosInteressadoPresente = function () {
    return acordionDadosInteressado.isPresent();
  };

  //Abre acordion dados interessados
  this.abrirAcordionDadosInteressados = function(){
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.visibilityOf(acordionDadosInteressado), 10000, "Não apareceu o acordion de dados do interessado");
    acordionDadosInteressado.click();
  };

  //Seleciona o tipo de posse de acordo com o parâmetro passado
  this.selecionaTipoPosse = function (tipoPosse) {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.visibilityOf(inputTipoPosse),10000, "Não apareceu o campo input do tipo de posse");
    inputTipoPosse.click();
    opcoesTipoPosse.get(tipoPosse).click();
  };

  //Verifica se os capos Nome da Entidade e CNPJ da Entidade estão visíveis;
  this.verificarCamposAdicionais = function () {
    return inputNomeEntidade.isPresent() && inputCNPJEntidade.isPresent();
  };

  //Verifica se abril a modal de inserir interessados
  this.verificaModalIncluirInteressado = function () {
    this.abrirModalIncluirInteressado();
    browser.wait(EC.visibilityOf(tituloModal),10000, "A modal não abril");
    return tituloModal.isPresent();
  };

  //Clicar no botão incluir interessado
  this.abrirModalIncluirInteressado = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.visibilityOf(botaoIncluir),10000, "O botão incluir interessado não apareceu");
    botaoIncluir.click();
  };

  //Inserir CNPJ na modal de inserir interessado
  this.insereCNPJInteressado = function () {
    browser.wait(EC.visibilityOf(inputCNPJInteressado),10000, "O input de CNPJ do interessado não apareceu");
    inputCNPJInteressado.sendKeys('00000000000191');
    return true;
  };

  //Verifica se o input de Codigo UG apareceu
  this.verificaInputCodigoUG = function () {
    return inputUG.isPresent();
  };

  //Inserir codigo UG, area e clica em incluir
  this.insereInteressado = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.visibilityOf(inputUG),10000,"Input do codigo UG não apareceu");
    inputUG.sendKeys('Teste');
    browser.wait(EC.visibilityOf(inputAreaUtilizada),10000,"Input da area não apareceu");
    inputAreaUtilizada.sendKeys('2000');
    browser.wait(EC.visibilityOf(botaoIncluirModal),10000,"Botão incluir na modal incluir interessado");
    botaoIncluirModal.click();
    botaoConfirmarModal.click();
  };

  //Retorna os dados do interessados incluídos
  this.verificaDadosInteressadoVazio = function () {
    return dadosInteressadoModal.then(function (interessado) {
      return interessado.length === 0;
    });
  };

  //Clica no botão excluir interessado
  this.clicaExcluirInteressado = function () {
    var botaoExluirInteressado;
    dadosInteressado.then(function () {
      browser.wait(EC.invisibilityOf(loadingBar), 5000);
      botaoExluirInteressado = element(by.css('[ng-click="remover(item);"]'));
      browser.wait(EC.invisibilityOf(botaoIncluirModal),10000, "A modal não fechou");
      browser.wait(EC.visibilityOf(botaoExluirInteressado),10000, "O botão de excluir o interessado não apareceu");
      botaoExluirInteressado.click();
    });
  };

  //Clica em sim para confirmar exclusão do interessado
  this.clicaConfirmarExclusaoInteressado = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 5000);
    browser.wait(EC.visibilityOf(dialogConfirmarExclusao), 10000, "A modal de confirmar a exclusão do interessado não apareceu");
    botaoConfirmarExclusaoInteressado.click();
    browser.wait(EC.invisibilityOf(dialogConfirmarExclusao), 10000, "A modal de confirmar a exclusão do interessado não desapareceu");
    return dadosInteressado.then(function (interessado) {
      return interessado.length === 0;
    });
  };

  //Clica no botão confirmar para salvar a posse informal
  this.clicaConfirmar = function () {
    browser.wait(EC.invisibilityOf(loadingBar), 10000);
    browser.wait(EC.visibilityOf(botaoConfirmar), 10000, "O botão de confirmar não apareceu");
    browser.sleep(2000);
    botaoConfirmar.click();
  };

  //Verifica se a mensagem de campos obrigatórios aparece
  this.verificaErroCamposObrigatorios = function () {
    return browser.wait(EC.visibilityOf(mensagemErro), 10000, "A mensagem de erro não apareceu") &&
      browser.wait(EC.textToBePresentInElement(mensagemErro, 'Preencha os campos obrigatórios'));
  };

  //Clica em fechar e não confirma
  this.clicaFecharECancela = function () {
    browser.wait(EC.visibilityOf(botaoFechar), 10000, "O botão de fechar não apareceu");
    botaoFechar.click();
    browser.wait(EC.visibilityOf(botaoNaoConfirmarFechar), 10000, "O botão de cancelar o fechar não apareceu");
    botaoNaoConfirmarFechar.click();
    return browser.wait(EC.visibilityOf(dialogConfirmarExclusao),10000,"A modal de confirmação não apareceu") &&
      browser.wait(EC.textToBePresentInElement(dialogConfirmarExclusao, 'Os dados da posse informal serão perdidos ' +
        'e não poderão ser recuperados. Deseja confirmar?'));
  };

  //Preenche o campo nome da entidade e clica em confirmar
  this.preencheCamposFaltantesESalva = function () {
    browser.wait(EC.visibilityOf(inputNomeEntidade),10000,"O input nome da entidade não apareceu");
    inputNomeEntidade.sendKeys('teste');
    browser.wait(EC.visibilityOf(botaoConfirmar),10000,"O botão confirmar não apareceu");
    browser.sleep(2000);
    botaoConfirmar.click();
  };
};
module.exports = PosseInformalPage;
