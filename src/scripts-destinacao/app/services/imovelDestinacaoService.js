(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('imovelDestinacaoService', service);

    function service ($http) {

      var URL = 'destinacao/api/imovel/';

      var IMOVEL_BRASIL = 'BRASIL';

      function consultarDestinacao (params) {
        return $http.get(URL + 'consultarDestinacao',  {params: params});
      }

      function buscarDadosRipUtilizacao (rip) {
        return $http.get(URL + 'buscarDadosRipUtilizacao/'+ rip);
      }


      function buscarDadosBenfeitorias (rip) {
          return $http.get(URL + 'buscarDadosBenfeitorias/'+ rip);
      }


        function consultarPorRip (rip,tipoDestinacao, fundamentoLegal) {
        return $http.post(URL + 'consultarPorRip/', {rip: rip,
            tipoDestinacao: tipoDestinacao,
            fundamentoLegal: fundamentoLegal});
      }

      function consultarPorRipCUEM(rip,codigoUtilizacao,sequencialParcela,tipoDestinacao, idModalidade) {
        return $http.get(URL + 'consultarPorRipCUEM/'+ rip + '/' + codigoUtilizacao + '/' + sequencialParcela + '/' + tipoDestinacao +'/'+idModalidade);
      }

      function consultarPorRipEDestinacao (rip,tipoDestinacao) {
        return $http.get(URL + 'consultarPorRipEDestinacao/'+ rip+'/'+tipoDestinacao);
      }

      function consultarDadosPosseInformal(rip,codigoUtilizacao,sequencialParcela) {
        return $http.get(URL + 'consultarDadosPosseInformal/' +rip+ '/' +codigoUtilizacao+ '/' +sequencialParcela);
      }

      function buscarValorAvaliacao (id) {
        return $http.get(URL + 'buscarValorAvaliacao/' + id);
      }

      function consultarUtilizacao(rip, codigoUtilizacao, sequencialParcela, tipoDestinacao) {
        return $http.get(URL + 'consultarPorRipEDestinacao/' + rip + '/' + codigoUtilizacao + '/' + sequencialParcela + '/' + tipoDestinacao);
      }

      function consultarPorRipParcela(rip, sequancialParcela, tipoDestinacao, fundamentoLegal, idModalidade) {
          return $http.post(URL + 'consultarPorRipEParcela',  {rip: rip, sequencialParcela: sequancialParcela, tipoDestinacao: tipoDestinacao, fundamentoLegal: fundamentoLegal, idModalidade:idModalidade });
      }

      function verificaImovelNoBrasil (imovel) {
        try {
          return imovel.endereco.pais.toUpperCase() === IMOVEL_BRASIL;
        } catch (error) {
          return true;
        }
      }

      function buscarPorRip(rip) {
          return $http.get(URL + "buscarPorRip/" + rip);
      }

      return {
          consultarPorRip: consultarPorRip,
          buscarValorAvaliacao: buscarValorAvaliacao,
          verificaImovelNoBrasil: verificaImovelNoBrasil,
          consultarPorRipEDestinacao:consultarPorRipEDestinacao,
          consultarDestinacao: consultarDestinacao,
          buscarDadosRipUtilizacao: buscarDadosRipUtilizacao,
          consultarPorRipCUEM: consultarPorRipCUEM,
          consultarUtilizacao: consultarUtilizacao,
          consultarDadosPosseInformal: consultarDadosPosseInformal,
          consultarPorRipParcela: consultarPorRipParcela,
          buscarDadosBenfeitorias: buscarDadosBenfeitorias,
          buscarPorRip: buscarPorRip
      };

    }

})();
