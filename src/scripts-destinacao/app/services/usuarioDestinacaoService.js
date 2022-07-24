/**
 * Created by Basis Tecnologia on 27/10/2016.
 */
'use strict';
(function () {

  angular
    .module('su-destinacao')
    .factory('usuarioDestinacaoService', service);

  function service ($http, $rootScope) {

    var getUsuarioLogado = function () {
      return $rootScope.usuarioLogado;
    };

    function isPossuiPermissao(permissao) {
      var usuarioLogado = getUsuarioLogado();
      var permissoes = usuarioLogado.permissoes;
      var possuiPermissao = false;
      for (var i = 0; i < permissoes.length; i++) {
        if (permissoes[i] === permissao) {
          possuiPermissao = true;
          break;
        }
      }

      return possuiPermissao;
    }

    function getPermissaoAnaliseTecnica(permissoes) {
      var permissao;
      for (var i = 0; i < permissoes.length; i++) {
        if (isPossuiPermissao(permissoes[i])) {
          permissao = permissoes[i];
          break;
        }
      }
      return permissao;
    }

    return {
      getUsuarioLogado: getUsuarioLogado,
      isPossuiPermissao: isPossuiPermissao,
      getPermissaoAnaliseTecnica: getPermissaoAnaliseTecnica
    };
  }

}());
