(function () {

  angular
    .module('su-destinacao')
    .directive('tituloDestinacao', directive);


  function directive($rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/tituloDestinacao/templates/tituloDestinacao.html',
     // replace: true,
      scope: {
        parcela: '='
      },
      link: function ($scope) {
        $rootScope.$watch('paginaAtual', function (newValue) {
          if (newValue) {
            $scope.titulo = newValue;
            $scope.parcela = angular.isDefined($scope.parcela) && $scope.parcela === true;
          }
        });

      }
    };
  }


})();
