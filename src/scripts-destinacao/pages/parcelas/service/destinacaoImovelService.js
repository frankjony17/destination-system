/**
 * Created by haillanderson on 21/03/17.
 */

(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('destinacaoImovelService', service);

  function service ($http) {

    var URL = 'destinacao/api/destinacaoImovel';

    function buscarDadosUtilizacao (rip) {
      return $http.get(URL + '/buscarDadosUtilizacao/'+rip);
    }

    return {
      buscarDadosUtilizacao: buscarDadosUtilizacao
    };

  }

})();
