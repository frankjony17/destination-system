(function () {
  var directive = function (arquivoService) {
    return {
      restrict: 'EA', //E = element, A = attribute, C = class, M = comment
      scope: {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        requerimento: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/templates/detalharRequerimentoAdesaoPraias.html',
      //controller: controllerFunction, //Embed a custom controller in the directive
      link: function ($scope) {
        var vm = $scope;

        vm.isDetalhar = true;
        vm.portaria = "portaria";
        vm.adesao = "termo-adesao";

        vm.buscarArquivoGestaoPraia = function(nomeArquivo){
          return arquivoService.downloadGestaoPraia(nomeArquivo);
        }
      }
    };
  }

  angular.module('su-destinacao')
    .directive('requerimentoAdesaoPraia', directive);
})();
