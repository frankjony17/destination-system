/**
 * Created by haillanderson on 07/07/17.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('tipoPosseService', service);

  function service ($http) {

    var URL = 'destinacao/api/tipoPosse/';

    function buscarTiposPosse() {
      return $http.get(URL + 'buscarTodos');
    }

    return {
      buscarTiposPosse: buscarTiposPosse
    };
  }
})();
