(function () {

    angular
        .module('su-destinacao')
        .directive('apresentarDadosCancelamento', directive);

    function directive(cancelarEncerrarUtilizacaoService) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/apresentarDadosCancelamento/templates/apresentarDadosCancelamento.html',
            scope:{
                cancelamentoDestinacao: '='
            },
            link:function ($scope) {



                var init = function () {
                    $scope.buscarPorIdDestinacao();
                };

                $scope.buscarPorIdDestinacao = function () {
                    cancelarEncerrarUtilizacaoService.buscarPorIdDestinacao($scope.cancelamentoDestinacao.id).then(function (resp) {
                        $scope.cancelamentoEncerramento = resp.data.resultado;
                        $scope.cancelamentoEncerramento.motivo = setMotivo($scope.cancelamentoEncerramento.motivo);

                    });
                };

                function setMotivo(motivoKey) {
                    if (motivoKey === "ENCERRAMENTO_POR_NAO_CUMPRIMENTO_DE_ENCARGO") {
                        return "Encerramento por não cumprimento de encargo";
                    }
                    if(motivoKey === "CANCELAMENTO_POR_ERRO"){
                        return "Cancelamento por erro";

                    }  if(motivoKey === "CANCELAMENTO_POR_ANULACAO"){
                        return "Cancelamento por anulação";

                    }  if(motivoKey === "ENCERRAMENTO_POR_INTERESSE_PUBLICO"){
                        return "Encerramento por interesse público";

                    }   if(motivoKey === "ENCERRAMENTO_POR_ACORDO_ENTRE_AS_PARTES"){
                        return "Encerramento por acordo entre as partes";

                    }  if(motivoKey === "ENCERRAMENTO_POR_DEVOLUVAO"){
                        return "Encerramento por devolução";

                    }  if(motivoKey === "ENCERRAMENTO_POR_VENCIMENTO_DO_CONTRATO_TERMO"){
                        return "Encerramento por vencimento do contrato/termo (automático pela rotina)";

                    }if(motivoKey === "ENCERRAMENTO_POR_REINTEGRACAO_DE_POSSE"){
                        return "Encerramento por reintegração de posse";

                    }if(motivoKey === "ENCERRAMENTO_POR_REGULARIZACAO"){
                        return "Encerramento por regularização";

                    }
                }



                init();

            }

        }
    }

})();
