(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('analiseTecnicaService', service);

  function service ($http) {

    var URL = 'destinacao/api/analise-tecnica';

    function salvar(analiseTecnica) {
        if (analiseTecnica.id) {
            return $http.put(URL, analiseTecnica);
        } else {
            return $http.post(URL, analiseTecnica);
        }
    }

    function salvarRascunho(analiseTecnica) {
        if (analiseTecnica.id) {
            return $http.put(URL + '/salvarRascunho', analiseTecnica);
        } else {
            return $http.post(URL + '/salvarRascunho', analiseTecnica);
        }
    }

    function buscarPorId(analiseId) {
        return $http.get(URL + "/" + analiseId);
    }

    function buscarAnalisePorRequerimento(requerimentoId) {
        return $http.get(URL + "/requerimento/" + requerimentoId);
    }

    function registrarPublicacaoDiarioUniao(analiseTecnica) {
        if (analiseTecnica.publicacao.id) {
            return $http.put(URL + '/registrarPublicacaoDiarioUniao', analiseTecnica);
        } else {
            return $http.post(URL + '/registrarPublicacaoDiarioUniao', analiseTecnica);
        }
    }

    return {
      salvar: salvar,
      salvarRascunho: salvarRascunho,
      buscarPorId: buscarPorId,
      buscarAnalisePorRequerimento: buscarAnalisePorRequerimento,
      registrarPublicacaoDiarioUniao: registrarPublicacaoDiarioUniao
    };

  }

})();
