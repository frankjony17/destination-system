(function(){
angular.module('su-destinacao')
  .directive('itemAnaliseTecnicaEspecifico', diretiva);


function diretiva (dominioService, fundamentoLegalServiceDestinacao, itemVerificacaoCheckListService) {
    return {
        restrict: 'EA',
        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/itemAnaliseTecnicaEspecifico/templates/itemAnaliseTecnicaEspecifico.html',
        scope: {
            analiseTecnica: '=',
            tipoDestinacao: '=',
            bloquearFormulario: '='
        },
        link: function (scope) {

            var TIPO_DESTINACAO_PRAIA = 'GESTAO_PRAIA';
            var ID_TIPO_DESTINACAO_PRAIA = 6;

            scope.itensVerificacao = [];
            scope.informacaoComplementar = {arquivos: []};

            scope.desabilitarTipoDestinacao = desabilitarTipoDestinacao;
            scope.carregarFundamentoLegal = carregarFundamentoLegal;
            scope.carregarItensAnalisteTecnica = carregarItensAnalisteTecnica;

            function init () {
                getTiposDestinacoes();
                carregarFundamentoLegal();
            }

            function carregarFundamentoLegal() {
                fundamentoLegalServiceDestinacao.getFundamentosLegais(scope.tipoDestinacao).then(function(retorno){
                  scope.fundamentosLegais = retorno.data.resultado;
                });
            }

            function getTiposDestinacoes() {
                dominioService.buscarTodosTiposDestinacao().then(function(retorno){
                  scope.tiposDestinacoes = retorno.data.resultado;
                });
            }

            function desabilitarTipoDestinacao() {
                return scope.tipoDestinacao === TIPO_DESTINACAO_PRAIA;
            }

            function carregarItensAnalisteTecnica() {
                itemVerificacaoCheckListService.listarItensPorIdFundamentoLegal(scope.analiseTecnica.fundamentoLegal.id).then(function (resposta) {
                    scope.itensVerificacao = resposta.data.resultado;
                });
            }

            scope.$watch('tipoDestinacao', function (newValue) {
                if (newValue && newValue === TIPO_DESTINACAO_PRAIA) {
                    scope.analiseTecnica.tipoDestinacao.id = ID_TIPO_DESTINACAO_PRAIA;
                }
            });

            init();

            scope.$watch('analiseTecnica.fundamentoLegal', function (newValue) {
                if (newValue && newValue.id) {
                    carregarItensAnalisteTecnica();
                }
            });


        }

    };
}
})();
