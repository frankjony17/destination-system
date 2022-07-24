(function () {

  angular.module('su-destinacao').directive('dadosTelefones', directive);

  function directive () {
    return {
      restrict: 'EA', //E = element, A = attribute, C = class, M = comment
      scope: {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        entidade: '=',
        tipoRequerimento: '=',
        bloquearCampos: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosTelefone/dadosTelefones.html',
      //controller: controllerFunction, //Embed a custom controller in the directive
      link: function ($scope) {
          $scope.bloquearCampos = ($scope.bloquearCampos === true);
          $scope.REQUERIMENTO_ADESAO_GESTAO_PRAIA = 'ADESAO_GESTAO_PRAIAS';
      }
    };
  }

})();
