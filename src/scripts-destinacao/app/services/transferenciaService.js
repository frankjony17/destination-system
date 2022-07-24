(function(){
'use strict';
angular
  .module('su-destinacao')
  .factory('transferenciaService', service);

function service ($http) {

  function carregarListaTipoTransferencia() {
    return $http.get('destinacao/api/transferencia/tipo-transferencia');
  }

  function carregarListaTipoDestinatario() {
    return $http.get('destinacao/api/transferencia/tipo-destinatario');
  }

  function carregarListaBaseLegal() {
    return $http.get('destinacao/api/transferencia/base-legal');
  }

  function gravarTransferencia(transferencia) {
    return $http.post('destinacao/api/transferencia',transferencia);
  }

  function buscarListaAutarquias() {
      return $http.get('destinacao/api/transferencia/buscar-autarquias')
  }

  return {
      carregarListaTipoTransferencia: carregarListaTipoTransferencia,
      carregarListaTipoDestinatario: carregarListaTipoDestinatario,
      gravarTransferencia: gravarTransferencia,
      carregarListaBaseLegal: carregarListaBaseLegal,
      buscarListaAutarquias: buscarListaAutarquias
  };
}

})();
