(function () {

  angular
      .module('su-destinacao')
      .directive('atoAutorizativo', directive);

    function directive (dominioService) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/atoAutorizativo/templates/atoAutorizativo.html',
            scope: {
              dadosAtoAutorizativo: '=',
              bloquear: '='
            },

            link: function (scope) {

              scope.tiposAutorizativos = [];

              function init(){
                atualizaTiposAutorizativos();
              }

              init();

              function atualizaTiposAutorizativos(){
                dominioService.buscaTodosTiposAtosAdministrativos()
                  .then(function (resposta) {
                    scope.tiposAutorizativos = resposta.data.resultado;
                  });
              }
            }
        };
    }


})();
