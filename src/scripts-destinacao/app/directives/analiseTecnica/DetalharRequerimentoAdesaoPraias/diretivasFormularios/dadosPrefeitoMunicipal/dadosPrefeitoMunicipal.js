(function () {

  'use strict';

  angular
      .module('su-destinacao')
      .directive('dadosPrefeitoMunicipal', directive);

  function directive ($filter) {
    return {
      restrict: 'EA', //E = element, A = attribute, C = class, M = comment
      scope: {
        requerimento: '=',
        obrigatorio: '=',
        bloquearCampos: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosPrefeitoMunicipal/dadosPrefeitoMunicipal.html',
      //controller: controllerFunction, //Embed a custom controller in the directive
      link: function ($scope) {

        $scope.obrigatorio = ($scope.obrigatorio || angular.isUndefined($scope.obrigatorio));
        $scope.nomeCampo = $filter('translate')('dados-prefeito-municipal');

        $scope.bloquearCampos = ($scope.bloquearCampos === true);

        var init = function () {

        };

        init();

      }
    };
  }

})();
