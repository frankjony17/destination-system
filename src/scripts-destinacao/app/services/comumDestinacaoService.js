/**
 * Created by Basis Tecnologia on 27/10/2016.
 */
(function () {
    'use strict';
    angular
      .module('su-destinacao')
      .factory('comumDestinacaoService', comumDestinacaoService);

    function comumDestinacaoService ($http) {

     var buscarUrlsMenusPorAmbiente = function () {
        return $http.get('destinacao/api/comum/url-menu');
      };

      var obterPermissoes = function (cpf, modulo) {
        return $http.get('destinacao/api/comum/buscar-permissoes/' + cpf + '/' + modulo);
      };

      var buscarIdSistema = function () {
        return $http.get('destinacao/api/comum/buscar-id-sistema');
      };

      var buscarUrlHome = function () {
        return $http.get('destinacao/api/comum/buscar-url-home')
      };

      return {
          buscarUrlsMenusPorAmbiente: buscarUrlsMenusPorAmbiente,
          obterPermissoes: obterPermissoes,
          buscarIdSistema: buscarIdSistema,
          buscarUrlHome: buscarUrlHome
      };
    }
})();
