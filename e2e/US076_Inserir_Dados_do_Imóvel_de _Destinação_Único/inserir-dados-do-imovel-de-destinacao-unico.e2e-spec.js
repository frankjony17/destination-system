
const imovelDestinacaoUnicoPage = require('./inserir-dados-do-imovel-de-destinacao-unico.po');

describe('Teste e2e da história-US076-Inserir Dados do Imóvel de Destinação - Único',function () {

  var imovelDestinacaoUnico = new imovelDestinacaoUnicoPage();

  imovelDestinacaoUnico.acessarCUEM();

  it('03. Selecionar Código da Utilização', function () {
    imovelDestinacaoUnico.preencherCodigoUltilizacao();
    expect(imovelDestinacaoUnico.verificarCodigoDaUltizacao().toBe(true));

  })

});
