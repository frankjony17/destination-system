(function () {

  angular
      .module('su-destinacao')
      .directive('inserirDadosParcelaImovelPage',directive);

    function directive ($mdDialog,
                        mensagemDestinacaoService,
                        $filter,
                        destinacaoEscopoCompartilhadoService,
                        inserirImovelParcelaUtil,
                        $state,
                        $window) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/inserirImovelParcelaPage/template/inserirImovelParcela.html',
            scope: {
                destinacao: '=',
                bloquear: '=',
                edicao: '=',
                rotaDestinacao: '=',
                idModalidade:'='
            },
            link: function (scope) {

                scope.tabela = {
                    limit: 5,
                    limitsPage: [5, 10, 15],
                    page: 1
                };

                scope.abrirTelaInserirImovelParcela = abrirTelaInserirImovelParcela;
                scope.remover = remover;
                scope.editar = editar;
                scope.abrirDetalharParcela = abrirDetalharParcela;
                scope.getTipoUtilizacao = getTipoUtilizacao;
                scope.somarAreaConstruidaUtilizada = somarAreaConstruidaUtilizada;
                scope.formatarCodigoUtilizacao = formatarCodigoUtilizacao;
                scope.calcularFracaoIdeal = calcularFracaoIdeal;

                init();

                function init() {
                    var indice = 0;
                    angular.forEach(scope.parcelas, function(elem) {
                        elem.indice = angular.copy(indice);
                        indice++;
                    });
                }


                function calcularFracaoIdeal(destinacaoImovel) {
                    destinacaoImovel.fracaoIdeal = inserirImovelParcelaUtil.calcularFracaoIdeal(destinacaoImovel);
                    return destinacaoImovel.fracaoIdeal;
                }

                function abrirTelaInserirImovelParcela() {
                    var destinacaoImovel = angular.copy(scope.destinacao.destinacaoImoveis[0]);
                    scope.destinacao.recarregarDadosEscopo = true;
                    scope.destinacao.editar = scope.edicao;
                    scope.destinacao.detalhar = scope.bloquear;
                    inicializarDadosBenfeitoriasDestinacaoSalva(destinacaoImovel);

                    destinacaoEscopoCompartilhadoService.setObjetos('idModalidade', scope.idModalidade);
                    destinacaoEscopoCompartilhadoService.setDestinacao(scope.destinacao, scope.rotaDestinacao);
                    $state.go('destinacao.inserirImovelParcela');
                }

                function inicializarDadosBenfeitoriasDestinacaoSalva(destinacaoImovel) {
                    if (angular.isDefined(destinacaoImovel) && angular.isDefined(destinacaoImovel.id)) {

                        var benfeitorias;
                        var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;
                        if (destinacaoImovel.parcela !== null) {
                            benfeitorias = destinacaoImovel.parcela.benfeitorias;

                            angular.forEach(benfeitorias, function (benfeitoria) {
                                benfeitoria.areaUtilizar = getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                            });
                            destinacaoImovel.imovel.benfeitorias = benfeitorias;

                        } else {
                            angular.forEach(destinacaoImovel.parcelas, function (parcela, id) {
                                var benfeiroriasSelecionada = [];
                                angular.forEach(parcela.benfeitorias, function (benfeitoria) {
                                    if (benfeitoria.ativa === true) {

                                        benfeitoria.areaUtilizar = getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                                        benfeiroriasSelecionada.push(benfeitoria);
                                    }
                                });
                                parcela.benfeitorias = benfeiroriasSelecionada;
                                destinacaoImovel.imovel.benfeitorias = parcela.benfeitorias;
                            })
                        }
                    }
                }


                function remover(destinacaoImovel) {
                    mensagemDestinacaoService.confirmar($filter('translate')('msg-confirmar-exclusao'), function () {
                        var indice = getIndice(destinacaoImovel);
                        scope.destinacao.destinacaoImoveis.splice(indice, 1);
                    });
                }

                function editar(destinacaoImovel) {
                    scope.destiancaoImovel = destinacaoImovel;
                    var indice = getIndice(destinacaoImovel);
                    destinacaoEscopoCompartilhadoService.setObjetos('indice', indice);
                    abrirTelaInserirImovelParcela();
                }

                function getIndice(destinacaoImovel) {
                    var index = scope.destinacao.destinacaoImoveis.findIndex(function (elem) {
                        return elem.imovel.rip === destinacaoImovel.imovel.rip;
                    });

                    if (index >= 0) {
                        return index;
                    }
                    return undefined;
                }

                function abrirDetalharParcela(imovel) {
                    var url = destinacaoEscopoCompartilhadoService.getUrlsPorAmbiente();
                    $window.open(url.su + 'detalharImovel/' + imovel.id,'_blank');
                }

                function getTipoUtilizacao(destinacaoImovel) {
                    return inserirImovelParcelaUtil.getTipoUtilizacao(destinacaoImovel);
                }


                function somarAreaConstruidaUtilizada(destinacaoImovel) {
                    return inserirImovelParcelaUtil.somarAreaConstruidaUtilizada(destinacaoImovel);
                }

                function getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas) {
                    return inserirImovelParcelaUtil.getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                }

                function formatarCodigoUtilizacao(destinacaoImovel) {
                    return inserirImovelParcelaUtil.formatarCodigoUtilizacao(destinacaoImovel);
                }

            }
        };
    }


})();
