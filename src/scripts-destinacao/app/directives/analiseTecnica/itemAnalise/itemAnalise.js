(function(){
/**
 * @param: itensAnalise Variável que irá conter as respostas dos itens da análise técnica
 * @param: itensRequerimento Itens que vieram do requerimento
 * @param: bloquearFormulario boolean, true para bloquear formulário
 * @param: titulo
 */
angular.module('su-destinacao')
  .directive('itemAnalise', function () {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/itemAnalise/template/itemAnalise.html',
      scope: {
        itensAnalise: '=',
        itensRequerimento: '=',
        bloquearFormulario: '=',
        titulo: '='
      },
      controller: function () {
      }

    };
  });

})();
