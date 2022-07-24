(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('afetacaoService', afetacaoService);

    function afetacaoService ($http, URL_DESTINACAO, $filter, mensagemDestinacaoService, $state) {

      var URL =  URL_DESTINACAO + 'afetacao';

      function salvarAfetacao (afetacao) {
          return $http.post(URL + '/salvar', afetacao);
      }




      return {
          salvarAfetacao: salvarAfetacao
      };

    }

})();
