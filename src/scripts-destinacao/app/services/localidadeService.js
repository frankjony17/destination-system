/**
 * Created by Basis Tecnologia on 27/10/2016.
 */

(function () {

  'use strict';
  angular
    .module('su-destinacao')
    .factory('localidadeService', service);

  function service ($http, URL_DESTINACAO) {

    var buscarPaises = function () {
      return $http.get(URL_DESTINACAO + 'localidade/buscar-paises');
    };

    var buscarEnderecoByCep = function (cep) {
      return $http.get('destinacao/api/localidade/buscar-endereco-cep/'+ cep);
   };

    var isCEPGenerico = function(endereco){
     //  return cep.substring(cep.length-3) == '000';
      return endereco.logradouro == undefined;
    };

    function buscarMunicipiosPorUf(uf) {
      return $http.get(URL_DESTINACAO + 'localidade/buscar-municipo-uf/' + uf);
    }

    var buscarAdotarEnderecoEnum = function () {
        return $http.get(URL_DESTINACAO + 'enderecoCorrespondencia/adotar-endereco');
    };


    return {
      buscarEnderecoByCep: buscarEnderecoByCep,
      isCEPGenerico: isCEPGenerico,
      buscarPaises: buscarPaises,
      buscarMunicipiosPorUf: buscarMunicipiosPorUf,
      buscarAdotarEnderecoEnum: buscarAdotarEnderecoEnum

    };
  }
})();

