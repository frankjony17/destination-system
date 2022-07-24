(function () {

  angular
      .module('su-destinacao')
      .directive('inserirDadosParcelaImovel',directive);

    function directive ($mdDialog, mensagemDestinacaoService, $filter, $window, destinacaoEscopoCompartilhadoService) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/formularios/inserirDadosParcelaImovel/templates/inserirDadosParcelaImovel.html',
            scope: {
              destinacaoImoveis: '=',
              tipoDestinacao: '=',
              bloquear: '=',
              permiteEditar: '='
            },
            link: function (scope) {

                scope.tabela = {
                    limit: 5,
                    limitsPage: [5, 10, 15],
                    page: 1
                };

                scope.abrirModalIncluirParcelaImovel = abrirModalIncluirParcelaImovel;
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
                    var totalAreaConstruida = 0;
                    var totalAreaDisponivel = 0;
                    var totalAreaUtilizar = 0;
                    var benfeitorias = destinacaoImovel.imovel.benfeitorias;
                    var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;

                    if (angular.isDefined(benfeitorias)) {

                        angular.forEach(benfeitorias, function (benfeitoria) {
                            totalAreaConstruida += benfeitoria.areaConstruida;
                            totalAreaDisponivel += benfeitoria.areaDisponivel;
                            totalAreaUtilizar += getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                        });
                        destinacaoImovel.fracaoIdeal = (totalAreaUtilizar / totalAreaConstruida) * destinacaoImovel.imovel.parcela.areaTerreno;
                    }
                    return destinacaoImovel.fracaoIdeal;
                }

                function getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas) {
                    var areaUtilizada = 0;
                    for (var i = 0; i < benfeitoriasDestinadas.length; i++) {
                        if (benfeitoriasDestinadas[i].idBenfeitoria === benfeitoria.id) {
                            areaUtilizada = benfeitoriasDestinadas[i].areaUtilizar;
                            break;
                        }
                    }
                    return areaUtilizada;
                }

                function abrirModalIncluirParcelaImovel(ev) {
                    var destinacaoImovel = angular.copy(scope.destiancaoImovel);
                    inicializarDadosBenfeitoriasDestinacaoSalva(destinacaoImovel);


                    scope.esconderTabela = marcarEsconderTabela(scope.permiteEditar, scope.bloquear);

                    scope.destiancaoImovel = undefined;
                    var edicao = angular.copy(scope.edicao);
                    scope.edicao = false;
                    $mdDialog.show({
                        controller: 'IncluirDadosImovelParcelaController',
                        controllerAs: 'incluirDadosImovelParcelaCtrl',
                        templateUrl: 'scripts-destinacao/app/directives/formularios/inserirDadosParcelaImovel/partials/views/incluirDadosImovelParcela.html',
                        targetEvent: ev,
                        locals: {
                            destinacaoImoveis: angular.copy(scope.destinacaoImoveis),
                            tipoDestinacao: angular.copy(scope.tipoDestinacao),
                            destinacaoImovel: destinacaoImovel,
                            edicao: edicao,
                            permiteEditar: scope.permiteEditar,
                            bloquear: scope.bloquear,
                            esconderTabela: scope.esconderTabela
                        }
                    }).then(function (destinacaoImoveis) {
                        scope.destinacaoImoveis = destinacaoImoveis;
                    });
                }

                function marcarEsconderTabela(permiteEditar, bloquear) {
                    return permiteEditar === true || bloquear === true;
                }

                function inicializarDadosBenfeitoriasDestinacaoSalva(destinacaoImovel) {
                    if (angular.isDefined(destinacaoImovel) && angular.isDefined(destinacaoImovel.id)) {
                        var benfeitorias = destinacaoImovel.imovel.benfeitorias;
                        var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;
                        angular.forEach(benfeitorias, function(benfeitoria) {
                            benfeitoria.areaUtilizar = getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                        });
                    }
                }

                function remover(destinacaoImoveis) {
                    mensagemDestinacaoService.confirmar($filter('translate')('msg-confirmar-exclusao'), function () {
                        scope.destinacaoImoveis.splice(destinacaoImoveis.indice, 1);
                    });
                }

                function editar(destinacaoImovel, ev) {
                    scope.destiancaoImovel = destinacaoImovel;
                    scope.edicao = true;
                    abrirModalIncluirParcelaImovel(ev);
                }

                function abrirDetalharParcela(imovel) {
                    var url = destinacaoEscopoCompartilhadoService.getUrlsPorAmbiente();
                    $window.open(url.su + 'detalharImovel/' + imovel.id,'_blank');
                }

                function getTipoUtilizacao(destinacaoImovel) {
                    var parcela = extrairParcela(destinacaoImovel);
                    if (Math.round(destinacaoImovel.fracaoIdeal) === Math.round(parcela.areaTerreno)) {
                        return 'Total';
                    }
                    return 'Parcial';
                }

                function extrairParcela(destinacaoImovel) {
                    var parcela;

                    if (angular.isDefined(destinacaoImovel.id)) {
                        parcela = destinacaoImovel.imovel.parcelas[0];
                    } else {
                        parcela = destinacaoImovel.imovel.parcela;
                    }
                    return parcela;
                }

                function somarAreaConstruidaUtilizada(destinacaoImovel) {
                    var total = 0;
                    var benfeitorias = destinacaoImovel.imovel.benfeitorias;
                    var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;

                    angular.forEach(benfeitorias, function (benfeitoria) {
                        total += getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                    });
                    return total;
                }


                function formatarCodigoUtilizacao(destinacaoImovel) {
                    var codigoUtilizacao = '-';
                    if (angular.isDefined(destinacaoImovel)
                        && angular.isDefined(destinacaoImovel.imovel)) {
                        extrairDadosImovel(destinacaoImovel);
                        codigoUtilizacao = ' ' + destinacaoImovel.imovel.rip
                                            + '/' + destinacaoImovel.imovel.codigoUtilizacao
                                            + '/' + destinacaoImovel.imovel.parcela.sequencial;
                    }
                    return codigoUtilizacao;
                }

                function extrairDadosImovel(destiancaoImovel) {
                    if (angular.isDefined(destiancaoImovel.id)) {
                        destiancaoImovel.imovel.codigoUtilizacao = destiancaoImovel.codigoUtilizacao;
                        destiancaoImovel.imovel.parcela = destiancaoImovel.imovel.parcelas[0];
                    }
                }

            }
        };
    }


})();
