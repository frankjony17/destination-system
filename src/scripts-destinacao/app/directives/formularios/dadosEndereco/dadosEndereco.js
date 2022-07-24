/**
 * Created by basis on 16/01/17.
 */
(function(){
  'use strict';

  angular
    .module('su-destinacao')
    .directive('dadosEndereco', directive);

  function directive(localidadeService){
    return{
      restrict: 'EA',
      scope: {
        endereco: '='
      },
      templateUrl: '/scripts-destinacao/app/directives/formularios/dadosEndereco/templates/dadosEndereco.html',
      link: function ($scope) {

        var buscarEnderecoByCep = function(){
          localidadeService.buscarEnderecoByCep($scope.endereco.cep).then(function (response) {
            $scope.endereco = (response.data.resultado);
            $scope.isCepNormal = !localidadeService.isCEPGenerico($scope.endereco);
          });
        };

        $scope.buscarEnderecoByCep = buscarEnderecoByCep;
      }
    }
  }
})();
