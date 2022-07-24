/**
 * Created by Basis Tecnologia on 11/10/2016.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('fundamentoLegalServiceDestinacao', service);

  function service ($http) {

    var URL = 'destinacao/api/fundamentoLegal/';

    function getFundamentosLegais(tipoDestinacao) {
      return $http.get(URL + tipoDestinacao);
    }


    return {
      getFundamentosLegais: getFundamentosLegais
    };

  }

})();
