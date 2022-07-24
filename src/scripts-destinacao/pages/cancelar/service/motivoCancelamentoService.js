(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('motivoCancelamentoService', service);

    function service($http) {
        
        var URL = 'destinacao/api/motivoCancelamento';

        function buscarTodos() {
            return $http.get(URL + '/buscarTodosMotivosCancelamento');
        }

        return {
            buscarTodos: buscarTodos
        }

    }

})();
