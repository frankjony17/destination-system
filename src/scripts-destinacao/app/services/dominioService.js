/**
 * Created by Basis Tecnologia on 11/10/2016.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('dominioService', service);

  function service ($http) {

    var URL = 'destinacao/api/dominio/';

    function getFundamentoLegais() {
      return $http.get(URL + 'buscar-fundamentos-legais');
    }

    function buscarTodosTipoPagamentos () {
      return $http.get(URL + 'buscar-tipo-pagamento');
    }

    function buscarTodosTipoPeriocidades () {
      return $http.get(URL + 'buscar-tipo-periocidade');
    }

    function buscarTodosTipoMoeda () {
      return $http.get(URL + 'buscar-tipo-moeda');
    }

    function buscarTodasInstituicaoFinanceiras() {
      return $http.get(URL + 'buscar-instituicao-financeira');

    }

    function buscarTodosTipoReajuste () {
      return $http.get(URL + 'buscar-tipo-reajuste');
    }

    function buscarTodosTipoJuros () {
      return $http.get(URL + 'buscar-tipo-juros');
    }

    function buscarTodosTipoLicitacao () {
      return $http.get(URL + 'buscar-tipo-licitacao');
    }

    function buscarTodosTipoPosse () {
      return $http.get(URL + 'buscar-tipo-posse');
    }

    function buscarTodosTipoModalidade () {
      return $http.get(URL + 'buscar-tipo-modalidade');
    }

    function buscarTodosTiposConcessao () {
      return $http.get(URL + 'buscar-tipo-concessao');
    }

    function buscarTodosTiposInstrumento () {
      return $http.get(URL + 'buscar-tipo-instrumento');
    }

    function buscarTodosTiposDestinacao () {
      return $http.get(URL + 'buscar-tipo-destinacao');
    }

    function buscarTodasUFS() {
      return $http.get(URL + 'buscar-ufs');
    }

    function buscarTipoDocumento() {
      return $http.get(URL + 'buscar-tipo-documento');
    }

    function buscaTodosTiposAtosAdministrativos() {
      return $http.get(URL + 'atoAutorizativo');
    }

    function buscaTodosTipoAfetacao() {
        return $http.get(URL + 'tipoAfetacao');
    }

      function buscaTodosTipoAcao() {
          return $http.get(URL + 'tipoAcao');
      }

      function buscaTodosTipoAto() {
          return $http.get(URL + 'tipoAto');
      }


      function buscarTodosLaudosAvaliacao() {
      return $http.get(URL + 'buscar-laudo-imovel')

    }

    return {
      getFundamentoLegais: getFundamentoLegais,
      buscarTodosTipoPagamentos: buscarTodosTipoPagamentos,
      buscarTodosTipoPeriocidades: buscarTodosTipoPeriocidades,
      buscarTodosTipoMoeda: buscarTodosTipoMoeda,
      buscarTodosTipoReajuste: buscarTodosTipoReajuste,
      buscarTodosTipoJuros: buscarTodosTipoJuros,
      buscarTodosTipoLicitacao: buscarTodosTipoLicitacao,
      buscarTodosTipoPosse:buscarTodosTipoPosse,
      buscarTodosTipoModalidade:buscarTodosTipoModalidade,
      buscarTodosTiposConcessao:buscarTodosTiposConcessao,
      buscarTodosTiposInstrumento:buscarTodosTiposInstrumento,
      buscarTodosTiposDestinacao: buscarTodosTiposDestinacao,
      buscarTodasUFS: buscarTodasUFS,
      buscarTipoDocumento: buscarTipoDocumento,
      buscaTodosTiposAtosAdministrativos: buscaTodosTiposAtosAdministrativos,
      buscarTodasInstituicoesFinanceiras: buscarTodasInstituicaoFinanceiras,
      buscarTodosLaudosAvaliacao: buscarTodosLaudosAvaliacao,
        buscaTodosTipoAfetacao: buscaTodosTipoAfetacao,
        buscaTodosTipoAcao: buscaTodosTipoAcao,
        buscaTodosTipoAto: buscaTodosTipoAto

    };

  }

})();
