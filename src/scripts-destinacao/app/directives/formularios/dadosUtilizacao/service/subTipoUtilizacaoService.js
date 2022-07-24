/**
 * Created by haillanderson on 07/04/17.
 */

(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('subTipoUtilizacaoService', service);

  function service($http, caracteresEspeciaisService, URL_DESTINACAO) {
    var URL = URL_DESTINACAO+'/subTipoUtilizacao/';
    var descricaoOutro ='Outro (especificar)';

    function buscarTodosSubtiposUtilizacao() {
      return $http.get(URL + 'buscarTodosSubTiposUtilizacaoAtivos/');
    }

      function buscarTodosSubtiposUtilizacaoAfetacao(tipoDeUso) {
          return $http.post(URL + 'buscarTodosSubTiposUtilizacaoAtivosAfetacao/', tipoDeUso );
      }

    function criarListaSubTipoInicial(listaTodosSubTipos) {

          var resultado = listaTodosSubTipos.filter(function (elemento) {
            return elemento.descricao.indexOf(descricaoOutro) != 0;
          });

        return resultado;
    }

    function filtrarSubTipoUtilizacao(textoTipo, listaFiltradaSubTipoUtilizacao) {
        if(angular.isDefined(textoTipo)) {
            var results = listaFiltradaSubTipoUtilizacao.filter(function(elemento){
                return caracteresEspeciaisService.retirarCaracteresEspeciais(elemento.descricao)
                    .indexOf(caracteresEspeciaisService.retirarCaracteresEspeciais(textoTipo)) === 0;
            });

            return results;
        }
      return listaFiltradaSubTipoUtilizacao;
    }

    return{
      buscarTodosSubtiposUtilizacao: buscarTodosSubtiposUtilizacao,
      criarListaSubTipoInicial: criarListaSubTipoInicial,
      filtrarSubTipoUtilizacao: filtrarSubTipoUtilizacao,
        buscarTodosSubtiposUtilizacaoAfetacao: buscarTodosSubtiposUtilizacaoAfetacao
    };
  }
})();
