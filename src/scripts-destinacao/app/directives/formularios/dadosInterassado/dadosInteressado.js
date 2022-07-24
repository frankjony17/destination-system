(function () {

  angular
    .module('su-destinacao')
    .directive('dadosInteressados', directive);

  function directive($mdDialog, dominioService, destinacaoEscopoCompartilhadoService, mensagemDestinacaoService, $filter) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosInterassado/templates/dadosInteressado.html',
      scope: {
        posseInformal: '='
      },
      link: function ($scope) {

        $scope.tabelaInteressados = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        }

        $scope.abrirModalIncluirInteressado = abrirModalIncluirInteressado;
        $scope.buscarTodosTipoPosse = buscarTodosTipoPosse;
        $scope.remover = remover;
        $scope.tiposPosse = [];

        function init() {
          $scope.buscarTodosTipoPosse();
        }

        init();

        function abrirModalIncluirInteressado(ev) {
          destinacaoEscopoCompartilhadoService.setObjetos('interessados', $scope.posseInformal.interessados);
          $mdDialog.show({
            controller: 'incluirInteressadoController',
            controllerAs: 'incluirInteressadoCtrl',
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosInterassado/templates/partial/views/incluirInteressado.html',
            targetEvent: ev,
            locals: {
              interessados: angular.copy($scope.interessados)
            }
          }).then(function (interessados) {
            $scope.posseInformal.interessados = interessados;
          });
        }

        function buscarTodosTipoPosse() {
          dominioService.buscarTodosTipoPosse().then(function (resposta) {
            $scope.tiposPosse = resposta.data.resultado;
          });
        }

        function remover(interessado) {
          var mensagem = $filter('translate')('msg-confirma-exclusao-interessado');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice;
            for (var i = 0; i < $scope.posseInformal.interessados.length; i++) {
              if ($scope.posseInformal.interessados[i].cpfCnpj == interessado.cpfCnpj) {
                indice = i;
                break;
              }
            }
            $scope.posseInformal.interessados.splice(indice, 1);
          });
        }
      }
    }
  }

})();
