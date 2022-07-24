(function () {

 'use strict';

  angular
         .module('su-destinacao')
         .directive('dadosMunicipio', directive);

  function directive ($filter) {
        return {
          restrict: 'EA',
          scope: {
              requerimento: '=',
              bloquearCampos: '='
          },
          templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosMunicipio/dadosMunicipio.html',
          link: function ($scope) {

            $scope.bloquearCampos = ($scope.bloquearCampos === true);
            $scope.nomeCampo = $filter('translate')('dados-municipio');
            $scope.textoEmail = $filter('translate')('email-institucional');


          }
        };
    }
})();
