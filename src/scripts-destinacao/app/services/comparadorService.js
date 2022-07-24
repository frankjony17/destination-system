(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('comparadorService', service);

  function service () {

    function comparar(objetoAntigo, objetoNovo) {
        var objeto = removerHashKey(objetoNovo);
        return angular.equals(objetoAntigo, objeto);
    }

    function removerHashKey(objeto) {
        return angular.copy(objeto);
    }

    return {
      comparar: comparar
    };
  }
})();
