(function () {

    angular
        .module('su-destinacao')
        .directive('apresentarDadosEncerramento', directive);

    function directive(encerrarDestinacaoService) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosEncerrarDestinacao/templates/apresentarDadosEncerramento.html',
            scope:{
                encerramento: '='
            },
            link:function ($scope) {



                var init = function () {
                    $scope.buscarPorIdDestinacao();
                };

                $scope.buscarPorIdDestinacao = function () {
                    encerrarDestinacaoService.buscarPorIdDestinacao($scope.encerramento.id).then(function (resp) {
                        $scope.encerramentoDestinacao = resp.data.resultado;
                        $scope.encerramentoDestinacao.motivo = setMotivo($scope.encerramentoDestinacao.motivo);

                    });
                };

                function setMotivo(motivoKey) {
                    if (motivoKey === "CONCLUSAO_DO_CONTRATO") {
                        return "Conclusão do Contrato";
                    }
                    if(motivoKey === "QUEBRA_DE_CLAUSULA_DO_CONTRATO"){
                        return "Quebra de Cláusula do Contrato";

                    }  if(motivoKey === "INTERESSE_DE_SERVICO_PUBLICO"){
                        return "Interesse de Serviço Público";

                    }  if(motivoKey === "DEVOLUCAO_DO_IMOVEL"){
                        return "Devolução do Imóvel";

                    }   if(motivoKey === "REMICAO"){
                        return "Remição";

                    }  if(motivoKey === "ENCERRAMENTO_POR_REINTEGRACAO_DE_POSSE"){
                        return "Encerramento por Reintegração de Posse";

                    }  if(motivoKey === "ENCERRAMENTO_POR_REGULARIZACAO") {
                        return "Encerramento por Regularização";
                        }
                }


                init();

            }

        }
    }

})();
