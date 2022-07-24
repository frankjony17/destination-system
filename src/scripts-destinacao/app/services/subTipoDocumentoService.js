/**
 * Created by haillanderson on 31/03/17.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('subTipoDocumentoService', service);

  function service ($http) {

    var URL = 'destinacao/api/documento/';

    function buscarSubTipoDocumento(id) {
      return $http.get(URL + 'buscarSubTipoDocumento/'+id);
    }

    return {
      buscarSubTipoDocumento: buscarSubTipoDocumento
    };
  }
  })();
