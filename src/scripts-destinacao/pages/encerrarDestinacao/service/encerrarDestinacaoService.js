(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('encerrarDestinacaoService', service);

    function service($http) {

        var URL = 'destinacao/api/encerrarDestinacao';

        function buscarListaMotivosEnum() {
            return $http.get(URL + '/lista-motivos');
        }

        function buscarListaDespachosEnum() {
            return $http.get(URL + '/lista-despachos');
        }

        function submeterSuperIntendente(idDestinacao, encerramentoDestinacao) {
            return $http.put(URL + '/submeter/' + idDestinacao, encerramentoDestinacao);
        }

        function confirmarEncerramento(idDestinacao, encerramentoDestinacao) {
            return $http.put(URL + '/confirmar/' + idDestinacao, encerramentoDestinacao);
        }

        function buscarPorIdDestinacao(idDestinacao) {
            return $http.get(URL + '/destinacao/' + idDestinacao);
        }

        return {
            buscarListaMotivosEnum: buscarListaMotivosEnum,
            buscarListaDespachosEnum: buscarListaDespachosEnum,
            submeterSuperIntendente : submeterSuperIntendente,
            confirmarEncerramento: confirmarEncerramento,
            buscarPorIdDestinacao: buscarPorIdDestinacao
        }

    }

})();
