(function () {

    angular
        .module('su-destinacao')
        .directive('inserirImovelAfetacao',directive);

    function directive ($mdDialog, destinacaoEscopoCompartilhadoService, mensagemDestinacaoService, $filter,$state) {
        return {
            restrict: 'EA',
            scope: {
                afetacao: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/inserirDadosDeImovelAfetacao/templates/inserirImovelAfetacao.html',
            link: function ($scope) {

                $scope.tabelaImovel = {
                    limit: 5,
                    limitsPage: [5, 10, 15],
                    page: 1
                };

                $scope.abrirModalIncluirImovel = abrirModalIncluirImovel;
                $scope.remover = remover;

                function abrirModalIncluirImovel () {
                    destinacaoEscopoCompartilhadoService.setObjetos('afetacao', $scope.afetacao);
                    $state.go('destinacao.incluirImovelAfetacaoPage');
                }


                function remover (imovel) {
                    var mensagem = $filter('translate')('msg-confirma-exclusao-imovel');
                    mensagemDestinacaoService.confirmar(mensagem, function () {
                        var indice;
                        for (var i = 0; i < $scope.afetacao.imoveis.length; i++) {
                            if ($scope.afetacao.imoveis[i].rip === imovel.rip) {
                                indice = i;
                                break;
                            }
                        }
                        $scope.afetacao.imoveis.splice(indice, 1);
                    });

                }
            }
        };
    }


})();
