/**
 * Created by haillanderson on 25/07/17.
 */

(function () {

  angular
    .module('su-destinacao')
    .directive('botoesRodape', directive);

  function directive () {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/botoesRodape/templates/botoesRodape.html',
      scope: {
        gravar: '&',
        avancar: '&',
        voltar: '&',
        fechar: '&',
        cancelar: '&',
        enviar: '&',
        gerarMinuta: '=',
        bloquear: '=',
        botaoEditar: '&',
        salvarRascunho: '&',
        tipoDestinacaoEnum: '=',
        acao: '=',
        pendente: '=',
        cancelamentoEncerramento:'=?'
      },
      link: function ($scope) {
          $scope.permissaoBotaoEditar = 'DESTINACAOMANTERCESSAOONEROSA';
          $scope.permissaoBotaoCancelar = 'DESTINACAO_CANCELAR_' + $scope.tipoDestinacaoEnum;
      }
    };
  }

})();
