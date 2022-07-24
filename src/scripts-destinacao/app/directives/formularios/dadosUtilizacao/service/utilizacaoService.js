/**
 * Created by haillanderson on 17/04/17.
 */

(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('utilizacaoService', service);

  function service($http) {
    var URL = 'destinacao/api/utilizacao/';

    function buscarEspecificacoes (idTipoUtilizacao) {
      return $http.get(URL + 'buscarEspecificacoes/'+idTipoUtilizacao);
    }

    return{
      buscarEspecificacoes: buscarEspecificacoes
    };
  }

})();
