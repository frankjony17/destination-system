/**
 * Created by basis on 06/01/17.
 */
describe('CDRUController > ', function() {
  var createController;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('suApp'));

  beforeEach(inject(function (mensagemDestinacaoService, $controller) {

    createController = function() {
      return $controller('CDRUController', {
      });
    };
  }));

  describe('Criando a controller de CDRU', function () {
    it('Criando a instância ', function() {
      var controller = createController();
      expect(controller).toBeDefined();
    });
  })

  describe('Teste Fechar Modal', function () {
    it('Deveria ir para a home ', function() {
      var controller = createController();
    });
  })

  describe('Teste Verificar Se Pode Exibir Financeiro', function () {
    it('Deveria retornar true', function() {
      var controller = createController();
      controller.atendimento.tipoConcessao.id = 2;
      expect(controller.verificarSePodeExibirFinanceiro()).toBeTruthy;
    });

    it('Deveria retornar false', function() {
      var controller = createController();
      controller.atendimento.tipoConcessao.id = 2;
      expect(controller.verificarSePodeExibirFinanceiro()).toBeFalsy;
    });
  })


});
