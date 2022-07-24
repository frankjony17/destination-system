/**
 * Created by basis on 10/01/17.
 */
(function () {
  'use strict';
  angular
    .module('su-destinacao')
    .factory('consultarDestinacaoService', service);

  function service($http){

    var contexto = 'destinacao/api';

    var carregarListaTipoDestincao = function(){
      return $http.get(contexto+'/destinacao/buscar-tipo-destinacao');
    };


      var carregarListaVersoes = function(){
          return $http.get(contexto+'/destinacao/buscar-tipo-destinacao');
      };


      var consultarDestinacaoPorPendencia = function (pendencia) {
      return $http.get(contexto+ '/destinacao/consultar-pendencia?pendencia=' + pendencia);
    };

    return {
        carregarListaTipoDestincao: carregarListaTipoDestincao,
        consultarDestinacaoPorPendencia: consultarDestinacaoPorPendencia,
        carregarListaVersoes : carregarListaVersoes
    };
  }


})();
