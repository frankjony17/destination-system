/**
 * Created by haillanderson on 07/04/17.
 */

(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('tipoUtilizacaoService', service);

  function service($http, caracteresEspeciaisService, URL_DESTINACAO) {

    var URL = URL_DESTINACAO+'/tipoUtilizacao/';

    function buscarTodosTiposUtilizacao() {
      return $http.get(URL + 'buscarTodosTiposUtilizacaoAtivos/');
    }

      function buscarTodosTiposUtilizacaoAfetacao() {
          return $http.get(URL + 'buscarTodosTiposUtilizacaoAtivosAfetacao/');
      }

    function filtrarTipoUtilizacao(textoTipo, listaFiltradaTipoUtilizacao) {
        if(angular.isDefined(textoTipo)) {
          var results = listaFiltradaTipoUtilizacao.filter(function(elemento){
              return caracteresEspeciaisService.retirarCaracteresEspeciais(elemento.descricao)
                  .indexOf(caracteresEspeciaisService.retirarCaracteresEspeciais(textoTipo)) === 0;
          });
          return results;
        }
        return listaFiltradaTipoUtilizacao;
    }

    function formatarUso(tipoUtilizacao, subTipoUtilizacao) {
        if (angular.isDefined(subTipoUtilizacao.descricao) && subTipoUtilizacao.descricao !== null) {
            return tipoUtilizacao.descricao + ' > ' + subTipoUtilizacao.descricao;
        } else if (angular.isDefined(tipoUtilizacao.descricao) && tipoUtilizacao.descricao !== null) {
            return tipoUtilizacao.descricao;
        }
        return ' - ';
    }

    return {
      buscarTodosTiposUtilizacao: buscarTodosTiposUtilizacao,
      filtrarTipoUtilizacao: filtrarTipoUtilizacao,
      formatarUso: formatarUso,
        buscarTodosTiposUtilizacaoAfetacao: buscarTodosTiposUtilizacaoAfetacao
    };

  }
})();
