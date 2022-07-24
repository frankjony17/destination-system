(function () {

  angular
      .module('su-destinacao')
      .directive('fundamentoLegal',directive);

    function directive (fundamentoLegalServiceDestinacao, $filter, mensagemDestinacaoService) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/fundamentoLegal/templates/fundamentoLegal.html',
            scope: {
              fundamento: '=',
              tipoDestinacao: '=',
              bloquear: '=',
              editar:'=',
              destinacao: '='
            },
            link: function (scope) {

              function init() {
                  String.prototype.removerHTML = function() {
                    return this.replace(/<.*?>/g, '');
                  };
                  recuperaData();

                  carregarFundamentosLegais(scope.tipoDestinacao);

              }

              function recuperaData() {
                  if((scope.bloquear === true && angular.isDefined(scope.destinacao.dataInicioFundamento) &&
                      angular.isDefined(scope.destinacao.dataFinalFundamento)) || (scope.editar === true && angular.isDefined(scope.destinacao.dataInicioFundamento) &&
                          angular.isDefined(scope.destinacao.dataFinalFundamento))) {
                      scope.destinacao.dataInicioFundamento = new Date(scope.destinacao.dataInicioFundamento);
                      scope.destinacao.dataFinalFundamento = new Date(scope.destinacao.dataFinalFundamento);
                  }
              }
                scope.validarDataFundamento = function () {
                    var mensagem;

                    if(scope.destinacao.dataFinalFundamento && scope.destinacao.dataInicioFundamento === undefined){
                        mensagem= $filter('translate')('msg-necessita-data-inicial')
                        mensagemDestinacaoService.mostrarMensagemError(mensagem);
                        throw mensagem;
                    }
                    if (scope.destinacao.dataFinalFundamento < scope.destinacao.dataInicioFundamento) {
                        mensagem = $filter('translate')('msg-data-final-fundamento');
                        mensagemDestinacaoService.mostrarMensagemError(mensagem);
                        scope.destinacao.dataFinalFundamento = undefined;
                        scope.destinacao.dataInicioFundamento = undefined;
                        throw mensagem;
                    }
                };

              function selecionarFundamento() {
                  angular.forEach(scope.fundamentosLegais, function (fundamentoLegal) {
                      if(fundamentoLegal.id === scope.fundamento){
                          scope.fundamento = fundamentoLegal;
                      }
                  })
              }

              scope.$watch('fundamento', function(newValue){
                  if(newValue){
                      selecionarFundamento();
                  }
              });

              init();

              scope.fundamentosLegais = [];

              function carregarFundamentosLegais(tipoDestinacao) {

                  fundamentoLegalServiceDestinacao.getFundamentosLegais(tipoDestinacao).then(function(retorno){
                      scope.fundamentosLegais = retorno.data.resultado;
                      selecionarFundamento();
                  });
              }

              scope.tipoTransferencia = function () {
                    return scope.tipoDestinacao === 'TRANSFERENCIA';
              };


            }
        };
    }


})();
