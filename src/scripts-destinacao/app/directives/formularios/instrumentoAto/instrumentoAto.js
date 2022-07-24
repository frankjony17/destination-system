(function () {
    angular
    .module('su-destinacao')
    .directive('instrumentoAto', directive);

  function directive() {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/instrumentoAto/templates/instrumentoAto.html',
      scope: {
        destinacaoTransito: '=',
        bloquear: '=',
        rotaDestinacao: '='

      }, link: function () {

      }
    }
  }
})();
