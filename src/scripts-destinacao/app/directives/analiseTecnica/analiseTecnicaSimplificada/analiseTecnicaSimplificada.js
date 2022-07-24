(function () {
  'use-strict'
  angular.module('su-destinacao')
    .directive('analiseSimplificada', directive);

  function directive (requerimentoDestinacaoService, $mdDialog, $document) {
    return {
      restrict: 'EA', //E = element, A = attribute, C = class, M = comment
      scope: {
        requerimento: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/analiseTecnicaSimplificada/analiseTecnicaSimplificada.html',
      //controller: controllerFunction, //qEmbed a custom controller in the directive
      link: function ($scope) {

        var init = function () {
          $scope.registroInicial = 1;
          $scope.tamanhoLimite = 5;
          $scope.totalItems = 0;
          buscarAnaliseTecnica();
          buscarHistorico();
        }

        var buscarAnaliseTecnica = function () {
          requerimentoDestinacaoService.buscarAnaliseTecnicaRequerimento($scope.requerimento.id)
            .then(function (resposta){
              $scope.analisesTecnicas = resposta.data.resultado;
          });
        };

        var buscarHistorico = function () {
          requerimentoDestinacaoService.buscarHistoricoPorRequerimentoId(($scope.registroInicial - 1),
            $scope.tamanhoLimite, $scope.requerimento.id).then(function (resp) {
            $scope.historicos = resp.data.resultado.content;
            $scope.totalItems = resp.data.resultado.totalElements;
          });
        };

        $scope.verificarRespostaButton = function (item) {
          return item.resposta;
        }

        $scope.abrirModalJustificativa = function (item) {

          $mdDialog.show({
            controller: function ($scope) {
              $scope.justificativa = item.justificativa;

              $scope.confirmar = function () {
                $mdDialog.hide($scope.justificativa);
              };

              $scope.fechar = function () {
                $mdDialog.cancel();
              };

            },
            templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/analiseTecnicaSimplificada/partial/justificativa.html',
            parent: angular.element($document.body),
            clickOutsideToClose: true
          }).then(function (justificativa) {
            item.justificativa = justificativa;
          });
        };

        init();

      }
    }
  }
})();
