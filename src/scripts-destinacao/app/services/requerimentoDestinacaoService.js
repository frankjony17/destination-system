(function(){
'use strict';
angular
  .module('su-destinacao')
  .factory('requerimentoDestinacaoService', service);

function service ($http) {

  function consultaRequerimentoEAnaliseTecnica (filtro) {
    return $http.get('destinacao/api/requerimento/consultar/analise-tecnica',{params: filtro}
    );
  }

  function buscarRequerimento (id) {
    return $http.get('destinacao/api/requerimento/' + id);
  }

  function buscarAnaliseTecnicaRequerimento (id) {
    return $http.get('destinacao/api/requerimento/requerimento-analise-tecnica/' + id);
  }

  function buscarHistoricoPorRequerimentoId (offset, limit, requerimentoId) {
    return $http.get('destinacao/api/requerimento/requerimento-pendencia/' + requerimentoId + '?offset=' + offset + '&limit=' + limit);
  }

  function alterarStatusRequerimento (status, requerimentoId) {
    return $http.put('destinacao/api/requerimento/alterar-status/' + status + '/' + requerimentoId);
  }

  function listarTituloServicos() {
    return $http.put('destinacao/api/requerimento/listar-titulo-servicos');
  }

  function adicionarAnotacoes (requerimento) {
    return $http.put('destinacao/api/requerimento/alterar-status/' + status + '/' + requerimento);
  }

  function buscarTodosStatusAnaliseTecnica() {
    return $http.get('destinacao/api/requerimento/buscar-tipo-status-analise-tecnica');
  }

  return {
    buscarRequerimento: buscarRequerimento,
    consultaRequerimentoEAnaliseTecnica: consultaRequerimentoEAnaliseTecnica,
    buscarAnaliseTecnicaRequerimento:buscarAnaliseTecnicaRequerimento,
    buscarHistoricoPorRequerimentoId:buscarHistoricoPorRequerimentoId,
    alterarStatusRequerimento:alterarStatusRequerimento,
    listarTituloServicos:listarTituloServicos,
    adicionarAnotacoes: adicionarAnotacoes,
    buscarTodosStatusAnaliseTecnica: buscarTodosStatusAnaliseTecnica

  };
}

})();
