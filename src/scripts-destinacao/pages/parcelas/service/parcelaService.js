/**
 * Created by haillanderson on 09/03/17.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('parcelaService', service);

  function service ($http) {

    var URL = 'destinacao/api/parcela';

    function salvar (parcela) {
        return $http.post(URL + '/salvar', parcela);
    }

    function excluir(listaParcela) {
      return $http.post(URL + '/excluir', listaParcela);
    }

    function buscarParcelasSemUtilizacao(rip, codigoUtilizacao) {
      return $http.get(URL + '/buscarParcelasSemUtilizacao/' + rip + '/' + codigoUtilizacao);
    }

    function buscarParcelasInativas(rip) {
      return $http.get(URL + '/buscarParcelasInativas/' + rip);
    }

    function editar(parcela) {
      return $http.put(URL + '/editar', parcela);
    }

      function salvarListaParcelas(parcelas) {
          return $http.post(URL + '/salvarListaParcelas', parcelas);
      }

      function buscarParcelas(rip){
          return $http.get(URL + '/buscarParcelas/' + rip);
      }

    return {
      salvar: salvar,
      excluir: excluir,
      buscarParcelasSemUtilizacao: buscarParcelasSemUtilizacao,
      buscarParcelasInativas: buscarParcelasInativas,
      editar: editar,
        buscarParcelas : buscarParcelas,
        salvarListaParcelas: salvarListaParcelas
    };

  }

})();
