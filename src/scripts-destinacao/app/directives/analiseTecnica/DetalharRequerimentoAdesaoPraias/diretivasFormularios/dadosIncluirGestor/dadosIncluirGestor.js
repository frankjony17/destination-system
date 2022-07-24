(function () {

  angular.module('su-destinacao').directive('dadosIncluirGestor', directive);

  function directive () {
    return {
      restrict: 'EA', //E = element, A = attribute, C = class, M = comment
      scope: {
        gestor: '=',
        requerimento: '=',
        bloquearCampos: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosIncluirGestor/templates/dadosIncluirGestor.html',
      //controller: controllerFunction, //Embed a custom controller in the directive
      link: function (scope) {

        scope.bloquearCampos = (scope.bloquearCampos === true);

        scope.selecionarEnderecoAtuacao = function (gestor) {

            if (gestor.unidadeAtuacao) {
                gestor.enderecoAtuacao = angular.copy(scope.requerimento.municipioRequerente.endereco);
            } else {
                gestor.enderecoAtuacao = {};
            }
        };
      }
    };
  }

})();
