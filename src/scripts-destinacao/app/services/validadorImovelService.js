/**
 * Created by Basis Tecnologia on 27/10/2016.
 */
'use strict';
(function () {

  angular
    .module('su-destinacao')
    .factory('validadorImovelService', service);

  function service (usuarioDestinacaoService) {

    function isUFMesmaJuridicaoUsuarioLogado(imovel) {
        var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
        var uf = imovel.endereco.uf;
        return usuarioLogado.jurisdicoes.indexOf(uf)!= -1;
    }

    function isAreaDestinadaMaiorAreaImovel(areaImovel, areaDestinada) {
        return areaDestinada > areaImovel;
    }

    function isAreaConstruidaUtilizarMaiorAreaDisponivel(areaUtilizar, areaDisponivel) {
        return areaUtilizar > areaDisponivel;
    }

    return {
        isUFMesmaJuridicaoUsuarioLogado: isUFMesmaJuridicaoUsuarioLogado,
        isAreaDestinadaMaiorAreaImovel: isAreaDestinadaMaiorAreaImovel,
        isAreaConstruidaUtilizarMaiorAreaDisponivel: isAreaConstruidaUtilizarMaiorAreaDisponivel
    };
  }

}());
