'use strict';
angular
  .module('su-destinacao')
  .factory('atendimentoService', function ($http) {

    var buscarPorNumeroAtendimento = function(numeroAtendimento){
      return $http.get('destinacao/api/atendimento/buscar-requerimento?numeroAtendimento=' + numeroAtendimento);
    };

    var buscarPorNumeroProcesso = function(numeroProcesso){
      return $http.get('destinacao/api/atendimento/buscar-requerimento-numero-processo?numeroProcesso=' + numeroProcesso);
    };

    var verificarNumeroProcedimentoSei = function(idRequerimento, idProcedimento){
      return $http.get('destinacao/api/atendimento/verificarNumeroSEI/' +idRequerimento + '/' + idProcedimento);
    };


    return {
      buscarPorNumeroAtendimento:buscarPorNumeroAtendimento,
      buscarPorNumeroProcesso:buscarPorNumeroProcesso,
      verificarNumeroProcedimentoSei:verificarNumeroProcedimentoSei
    };

  });
