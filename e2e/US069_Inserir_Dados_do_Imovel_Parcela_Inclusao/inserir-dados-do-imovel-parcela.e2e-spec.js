/**
 * Created by rogerio on 06/06/17.
 */
/**
 * Created by haillanderson on 02/06/17.
 */

const InserirParcelaPage = require('./inserir-dados-do-imovel-parcela.po');
const abrirPage = require('../abrirPage.po');

describe('Teste e2e da história US068 - Inserir Dados Financeiros Vendas',function () {
  var inserirParcela = new InserirParcelaPage();
  var abrirPagina = new abrirPage();

  it('login e chegar a página', function () {
    abrirPagina.abrirPagina('CESSÃO GRATUITA');
    inserirParcela.abrirAccordion();
    inserirParcela.clicarBotaoIncluir();
    expect(inserirParcela.isAberta()).toBe(true);
  });

  it('Criterio 1. Validação do RIP no [Código da Utilização com Área Disponível]', function () {
    inserirParcela.inserirCodigodeUtilizacao();
    expect(inserirParcela.ripValido()).toBe(true);
  });

  it('Criterio 2. Validar UF do RIP', function () {
    //TEM QE MODIFICAR O ACESSO
  });

  it('Criterio 3. Selecionar a parcela disponível - com acessões/benfeitorias', function () {
    expect(inserirParcela.comAcessoesEBenfeitorias()).toBe(true);
  });

  it('Criterio 4. Selecionar a parcela disponível - sem acessões/benfeitorias', function () {
    //Cadastrar um imovel sem benfeitoria
  });

  it('Criterio 5. Selecionar a opção Não sei o Código da Utilização', function () {
    //funcionalidade não implemnetada
  });

  it('Criterio 6. Apresentar opção Ver outras utilizações do imóvel', function () {

  });

  it('Criterio 7. Selecionar a opção Ver outras utilizações do imóvel', function () {

  });

  it('Criterio 8. Apresentar detalhamento do imóvel', function () {

  });

  it('Criterio 9. Ver memorial descritivo completo', function () {

  });

  it('Criterio 10. Área remanescente inferior a 20m²', function () {

  });

  it('Criterio 11. [Área Construída a Utilizar] maior que a [Área Construída Disponível]', function () {

  });

  it('Criterio 12. Cálculo da [Área Construída Disponível]', function () {

  });

  it('Criterio 13. Calcular Fração Ideal', function () {

  });

  it('Criterio 14. Permitir arredondamento da [Fração Ideal]', function () {

  });

  it('Criterio 15. Arredondamento não permitido', function () {

  });

  it('Criterio 16. Tabela com as Benfeitorias', function () {

  });

  it('Criterio 17. Apresentar campo de descrição e upload de fotos', function () {

  });

  it('Criterio 18. Upload de arquivos', function () {

  });

  it('Criterio 19. Validar planta/documentos diversos', function () {

  });

  it('Criterio 20. Validar fotos/videos', function () {

  });

  it('Criterio 21. Excluir planta/documentos/fotos/videos', function () {

  });

  it('Criterio 22. Seleção de Unidade Autônoma', function () {

  });

  it('Criterio 23. Incluir Imóvel/Parcela', function () {

  });

  it('Criterio 24. Remover Imóvel/Parcela', function () {

  });

  it('Criterio 25. Editar Imóvel/Parcela', function () {

  });

  it('Criterio 26. Confirmar Inclusão de Imóveis', function () {

  });

});
