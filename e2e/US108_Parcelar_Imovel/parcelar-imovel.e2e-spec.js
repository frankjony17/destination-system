const AbrirPage = require('../abrirPage.po');
const CriarParcelaPage = require('./parcelar-imovel.po');

describe('Teste e2e da historia US108 - Criar Parcela', function () {

  var EC = protractor.ExpectedConditions;
  var criarParcelaPage = new CriarParcelaPage();
  var abrirPagina = new AbrirPage();

  it('Pesquisar parcela editar e abrir a página criar parcela', function () {
     criarParcelaPage.acessarPaginaCriarParcela();
     browser.sleep(2000);
     expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/criarParcelaImovel');
  });

  it('1 - Selecionar o grupo Dados do Imóvel', function () {
     criarParcelaPage.abrirAcordion();
     expect(criarParcelaPage.contarQtdBenfeitorias()).toBeGreaterThan(0);
  });

  it('2 - Detalhar a Benfeitoria', function () {
     criarParcelaPage.detalharBenfeitoria();
     browser.sleep(5000);
     browser.getAllWindowHandles().then(function (handles) {
        var novaTabAberta = handles[0] != null && handles[1] != null;
        expect(novaTabAberta).toBe(true);
        browser.switchTo().window(handles[1]);
        browser.close();
        browser.switchTo().window(handles[0]);
        browser.switchTo().window(handles[0]);
     });
  });

  it('3 - Selecionar parcela de origem', function () {
     
  });

  it('4 - Selecionar parcela de origem automaticamente', function () {
     if (criarParcelaPage.verificarUmaParcela()) {
         expect(criarParcelaPage.verificarParcelaP0Selecionada()).toBe(true);
     } else {
         expect(criarParcelaPage.verificarParcelaP0Selecionada()).toBe(false);
     }
  });

  it('5 - Validar Área da parcela', function () {
    criarParcelaPage.preencherAreaNovaParcela(100000000);
    criarParcelaPage.clicarForaCampo();
    expect(criarParcelaPage.existeMensagemErro()).toBe(true);
  });

  it('6 - Preencher o campo Área da parcela', function () {
    browser.sleep(2000);
    criarParcelaPage.preencherAreaNovaParcela(10000);
    criarParcelaPage.clicarForaCampo();
    expect(criarParcelaPage.parcelaRemanescenteVisivel()).toBe(true);
  });

  it('7 - Calcular a Área da parcela remanescente', function () {    
    expect(criarParcelaPage.areaParcelaRemanescenteCalculadaCorreta()).toBe(true);
  });

  it('8 - Atualizar a lista de benfeitorias da parcela remanescente', function () {
    expect(criarParcelaPage.marcarBenfeitoriasNovaParcela()).toBe(false);
  });

  it('9 - Upload de arquivo shapefile', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('10 - Shapefile inválido', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('11 - Sobrepor arquivo shapefile', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('12 - Remover arquivo', function () {
    //ESTUDAR COMO FAZER UPLOAD DE ARQUIVOS
  });

  it('15 - Selecionar a opção Salvar Parcela', function () {
    expect(criarParcelaPage.salvar()).toBeGreaterThan(0);
    browser.sleep(9000);
  });

  it('14 - Selecionar a opção Limpar', function () {    
    criarParcelaPage.preencherAreaNovaParcela(10000);
    expect(criarParcelaPage.limparFormulario()).toBe('');
  });
  

  it('13 - Selecionar a opção Fechar', function () {
    criarParcelaPage.fechar();
    expect(browser.getCurrentUrl()).toEqual('http://su-spu.basis.com.br/#/destinacao/parcelaImovel');
  });

  it('16 - Selecionar a opção Criar Nova Parcela a Partir Desta', function () {

  });

  it('17 - Bloquear opções da lista', function () {

  });

  it('18 - Selecionar a opção Ver Parcelas Canceladas', function () {

  });

  it('19 - Selecionar a opção Redimensionar Parcelas', function () {

  });

  it('20 - Selecionar a opção Excluir Parcela', function () {

  });

  it('21. Não apresentar a opção Excluir Parcela', function () {

  });

  it('22 - Cancelar exclusão de parcela', function () {

  });

  it('23 - Confirmar exclusão de parcela', function () {

  });

  it('24 - Confirmar exclusão de parcela - nenhuma parcela selecionada', function () {

  });

  it('25 - Listar parcelas para receber os dados', function () {

  });


  it('26 - Selecionar a opção "Editar"', function () {

  });

  it('27. Editar as informações', function () {

  });

  it('28 - Subdividir a parcela inicial do imóvel', function () {

  });

  it('29 - Subdividir uma parcela do imóvel', function () {

  });

  it('30 - Excluir uma parcela do imóvel', function () {

  });

  it('31 - Excluir todas as parcelas do imóvel', function () {

  });

  it('32 - Vincular parcela com área disponível', function () {

  });

});
