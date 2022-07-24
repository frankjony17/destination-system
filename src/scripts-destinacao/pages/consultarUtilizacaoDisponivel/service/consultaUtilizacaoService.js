(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('consultaUtilizacaoService', service);

    function service($http, URL_DESTINACAO) {

        function consultar(parametros) {
            return $http.post(URL_DESTINACAO + 'destinacao/consultarUtilizacao', parametros);
        }



        return {
            consultar: consultar
        }

    }

})();
