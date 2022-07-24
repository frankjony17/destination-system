'use strict';
(function () {

  angular
    .module('su-destinacao')
    .factory('itemVerificacaoCheckListService', service);

  function service ($http) {

      var URL = 'destinacao/api/itemVerificacaoCheckList/';

      function listarItensPorIdFundamentoLegal(idFundamento) {
          return $http.get(URL + idFundamento);
      }

    return {
        listarItensPorIdFundamentoLegal: listarItensPorIdFundamentoLegal
    };
  }

}());
