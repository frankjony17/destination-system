/**
 * Created by Basis Tecnologia on 11/10/2016.
 */
(function(){
  'use strict';

  angular
    .module('su-destinacao')
    .factory('responsavelService', service);

  function service ($http) {
    var URL = 'destinacao/api/responsavel/';

    function getDadosPessoaFisica (cpfCnpj) {
      return $http.get(URL + 'buscar/'+ cpfCnpj);
    }

    function getDadosResponsavel (id){
      return $http.get(URL + 'buscarResponsavelImovel/'+id);
    }
    function destinacaoPorResponsavel(cpf) {
        return $http.get(URL + 'destinacoes/' + cpf);
    }

    function buscarTiposPosseOcupacaoEnum() {
        return $http.get(URL + 'tipo-posse-ocupacao');
    }

    function buscarTiposRepresentacaoEnum() {
        return $http.get(URL + 'tipo-representacao');
    }

    function buscarEstadosCivilEnum() {
        return $http.get(URL + 'estado-civil');
    }

    function buscarOpcoesPadraoEnum() {
        return $http.get(URL + 'opcoes-padrao');
    }

    function buscarDescricaoParentescoEnum() {
        return $http.get(URL + 'descricao-parentesco');
    }

    return {
        getDadosResponsavel: getDadosResponsavel,
        getDadosPessoaFisica: getDadosPessoaFisica,
        destinacaoPorResponsavel: destinacaoPorResponsavel,
        buscarTiposPosseOcupacaoEnum: buscarTiposPosseOcupacaoEnum,
        buscarTiposRepresentacaoEnum: buscarTiposRepresentacaoEnum,
        buscarEstadosCivilEnum: buscarEstadosCivilEnum,
        buscarOpcoesPadraoEnum: buscarOpcoesPadraoEnum,
        buscarDescricaoParentescoEnum: buscarDescricaoParentescoEnum
    };

  }
})();
