(function () {

    angular
        .module('su-destinacao')
        .directive('demaisResidentesResponsavel', directive);

    function directive (mensagemDestinacaoService, responsavelService, destinacaoService, $filter, $rootScope) {
        return {
            restrict: 'EA',
            scope:{
                listaResidentes:'=',
                tipoDestinacao: '=',
                editar: '=',
                detalhar: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosResponsavel/templates/demaisResidentesResponsavel.html',
            link: function ($scope) {
                var vm = $scope;

                vm.residente = {};
                vm.paginacaoResidentes = [];

                vm.listaDescricoesParentesco = [];
                var TAMANHO_CPF = 11;
                var funcionalidadeConsultura = 'SU_DESTINAÇÃO/';
                var PERIODO_MINIMO = 8760;

                vm.OUTRO = 'OUTRO';

                var count = 1;

                var init = function() {
                    vm.registroInicial = 1;
                    vm.tamanhoLimite = 5;
                    vm.totalItems = 0;

                    if (!vm.listaResidentes) {
                        vm.listaResidentes = [];
                    }
                    buscarDescricoesParentesco();
                    vm.paginarListaResidentes();
                };

                var buscarDescricoesParentesco = function() {
                    responsavelService.buscarDescricaoParentescoEnum().then(function(resp) {
                        vm.listaDescricoesParentesco = resp.data;
                    });
                };

                vm.incluirResidenteLista = function() {
                    if (vm.residente.cpf) {
                        vm.residente.sequencial = count;
                        vm.listaResidentes.push(vm.residente);
                        vm.residente = {};
                        count++;
                        vm.paginarListaResidentes();
                    }
                };

                vm.formatarDescricaoParentesco = function(nome) {
                    var desc = '';
                    angular.forEach(vm.listaDescricoesParentesco, function(descricaoParentesco) {
                        if (descricaoParentesco.nome==nome) {
                            desc = descricaoParentesco.descricao;
                        }
                    });
                    return desc;
                };

                vm.removerResidente = function(sequencial) {
                    mensagemDestinacaoService.confirmar($filter('translate')('msg-deseja-remover-residente'),
                        function () {
                            var listaTemporaria = [];
                            angular.forEach(vm.listaResidentes, function (pessoa) {
                                if (pessoa.sequencial != sequencial) {
                                    listaTemporaria.push(pessoa);
                                }
                            });
                            vm.listaResidentes = listaTemporaria;
                            vm.paginarListaResidentes();
                        }, function () {
                            return;
                        })
                };

                vm.$watch('listaResidentes', function() {
                    if (!vm.listaResidentes) {
                        vm.listaResidentes = [];
                    }
                    vm.paginarListaResidentes();
                });

                vm.paginarListaResidentes = function() {
                    vm.paginacaoResidentes = [];
                    vm.totalItems = vm.listaResidentes.length;
                    if (vm.totalItems < vm.tamanhoLimite) {
                        vm.paginacaoResidentes = vm.listaResidentes;
                    } else {
                        for (var i = ((vm.registroInicial - 1) * vm.tamanhoLimite); i < vm.totalItems; i++) {
                            vm.paginacaoResidentes.push(vm.listaResidentes[i]);
                            if (vm.paginacaoResidentes.length == vm.tamanhoLimite) {
                                break;
                            }
                        }
                    }
                };

                vm.$watch('residente.cpf', function() {
                    if (vm.residente.cpf && (vm.residente.cpf.length==TAMANHO_CPF)) {
                        funcionalidadeConsultura += vm.tipoDestinacao;
                        var campo = null;
                        var obj = {};
                        var i = 0;
                        var cpfUsuarioConsultor = $rootScope.usuarioLogado.cpf;
                        destinacaoService.buscarPessoaFisica(cpfUsuarioConsultor, vm.residente.cpf, funcionalidadeConsultura, PERIODO_MINIMO).then(function (retorno) {
                            if(retorno.data.erros && retorno.data.erros.length > 0){
                                mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                            } else {
                                vm.residente = retorno.data.resultado;
                            }
                        });
                        /*campo = ['cpf','situacaoCadastral', 'nome', 'dataNascimento', 'anoObito', 'nomeMae', 'sexo', 'estrangeiro', 'tituloEleitor', 'endereco'];
                        obj = {};
                        i = 0;
                        angular.forEach(campo, function (campo) {
                            destinacaoService.buscarHistoricoPessoaFisica(campo, vm.residente.cpf).then(function (retorno) {
                                if(retorno.data.erros && retorno.data.erros.length > 0){
                                    mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                                } else {
                                    obj[campo] = retorno.data.resultado;
                                    if (i==9) {
                                        obj = {};
                                    }
                                }
                                i++;
                            });
                        });*/
                    }
                });

                init();
            }
        };
    }


})();
