
(function () {

    angular
        .module('su-destinacao')
        .directive('dadosTelefone', directive);

    function directive (mensagemDestinacaoService, $filter) {
        return {
            restrict: 'EA',
            scope:{
                listaTelefone:"=",
                contadorTelefone: '=',
                editar: '=',
                detalhar:'=',
                isInterveniente: '='

            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosResponsavel/templates/dadosTelefone.html',
            link: function ($scope) {

                var vm = $scope;

                vm.telefone = {};
                vm.telefonePrincipal = null;
                vm.paginacaoTelefones = [];

                var init = function() {

                    vm.registroInicial = 1;
                    vm.tamanhoLimite = 5;
                    vm.totalItems = 0;

                    if (!vm.listaTelefone) {
                        vm.listaTelefone = [];
                    }
                    vm.paginarListaTelefones();
                    telefonePrincipalInit();
                };

                vm.$watch('listaTelefone', function() {
                    vm.paginarListaTelefones();
                });

                vm.incluirTelefoneLista = function() {
                    if (vm.telefone.numero) {
                        vm.listaTelefone.push({
                            tel: 'Telefone ' + vm.contadorTelefone,
                            ddd: vm.telefone.numero.substring(0,2),
                            numero: vm.telefone.numero.substring(2),
                            isPrincipal: false,
                            contador: vm.contadorTelefone
                        });
                        vm.telefone = {};
                        vm.contadorTelefone++;
                        vm.paginarListaTelefones();
                    }
                };

                var telefonePrincipalInit = function () {
                    angular.forEach(vm.listaTelefone, function (telefone) {
                        if(telefone.isPrincipal){
                            vm.telefonePrincipal = telefone.numero;
                        }
                    })
                };

                vm.selecionarTelefonePrincipal = function() {
                    angular.forEach(vm.listaTelefone, function(tel) {
                        if (tel.numero==vm.telefonePrincipal) {
                            tel.isPrincipal = true;
                        } else {
                            tel.isPrincipal = false;
                        }
                    });
                };

                vm.removerTelefone = function(contador) {
                    mensagemDestinacaoService.confirmar($filter('translate')('msg-deseja-remover-telefone'),
                        function() {
                            var listaTemporaria = [];
                            angular.forEach(vm.listaTelefone, function(tel){
                                if (tel.contador!=contador) {
                                    listaTemporaria.push(tel);
                                }
                            });
                            vm.listaTelefone = listaTemporaria;
                            recontarListagemTelefones();
                            vm.paginarListaTelefones();
                        }, function() {
                            return;
                        });
                };

                var recontarListagemTelefones = function() {
                    vm.contadorTelefone = 1;
                    angular.forEach(vm.listaTelefone, function(telefone) {
                        telefone.tel = 'Telefone ' + vm.contadorTelefone;
                        telefone.contador = vm.contadorTelefone;
                        vm.contadorTelefone++;
                    });
                };

                vm.paginarListaTelefones = function() {
                    vm.paginacaoTelefones = [];
                    vm.totalItems = vm.listaTelefone.length;
                    if (vm.totalItems < vm.tamanhoLimite) {
                        vm.paginacaoTelefones = vm.listaTelefone;
                    } else {
                        for (var i = ((vm.registroInicial - 1) * vm.tamanhoLimite); i < vm.totalItems; i++) {
                            vm.paginacaoTelefones.push(vm.listaTelefone[i]);
                            if (vm.paginacaoTelefones.length == vm.tamanhoLimite) {
                                break;
                            }
                        }
                    }
                };

                init();
            }
        };
    }


})();
