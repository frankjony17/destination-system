(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('cancelarEncerrarUtilizacaoService', service);

    function service ($http) {

        var URL = 'destinacao/api/cancelamento-encerramento';

        function buscarListaMotivosEnum() {
            return $http.get(URL + '/lista-motivos');
        }

        function buscarListaDespachosEnum() {
            return $http.get(URL + '/lista-despachos');
        }

        function submeterSuperIntendente(idDestinacao, cancelamentoEncerramento) {
            return $http.put(URL + '/submeter/' + idDestinacao, cancelamentoEncerramento);
        }

        function confirmarCancelamento(idDestinacao, cancelamentoEncerramento) {
            return $http.put(URL + '/confirmar/' + idDestinacao, cancelamentoEncerramento);
        }

        function buscarPorIdDestinacao(idDestinacao) {
            return $http.get(URL + '/destinacao/' + idDestinacao);
        }

        return {
            buscarListaMotivosEnum: buscarListaMotivosEnum,
            buscarListaDespachosEnum: buscarListaDespachosEnum,
            submeterSuperIntendente: submeterSuperIntendente,
            buscarPorIdDestinacao: buscarPorIdDestinacao,
            confirmarCancelamento: confirmarCancelamento
        };
    }
})();
