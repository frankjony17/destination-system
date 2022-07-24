(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('consultaDestinacaoService', service);

    function service($http, URL_DESTINACAO) {

        function consultar(parametros) {
            return $http.get(URL_DESTINACAO + 'destinacao/consultar', { params: parametros });
        }

        function consultarCidades(pais, dadosUtilizacao){
          return $http.get(URL_DESTINACAO + 'destinacao/consultarCidades/'+pais+'/'+dadosUtilizacao);
        }
        function buscarListaHistorico(id, idDestinacao, idVersao){
            return $http.get(URL_DESTINACAO + 'destinacao/buscarHistorico/'+ id + '/' + idDestinacao + '/' + idVersao);
        }

        function buscarListaVersoesDestinacoes(id, rip){
            return $http.get(URL_DESTINACAO + 'destinacao/buscarListaVersaoDestinacao/'+ id + '/' + rip);
        }

        function buscarEncargos(idDestinacao){
            return $http.get(URL_DESTINACAO + 'destinacao/buscarEncargos/' + idDestinacao);
        }


        return {
            consultar: consultar,
            consultarCidades: consultarCidades,
            buscarListaHistorico : buscarListaHistorico,
            buscarListaVersoesDestinacoes : buscarListaVersoesDestinacoes,
            buscarEncargos : buscarEncargos
        }

    }

})();
