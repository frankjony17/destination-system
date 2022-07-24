(function(){
    "use strict";
    angular.module("su-destinacao")
        .controller("cancelarEncerrarUtilizacaoController", function($scope, cancelarEncerrarUtilizacaoService, $rootScope, destinacaoEscopoCompartilhadoService,
                                                                     mensagemDestinacaoService, $filter, $state) {

            var vm = $scope;

            vm.cancelamentoEncerramento = {};

            vm.listaMotivos = [];

            var CANCELAMENTO_POR_ERRO = 'CANCELAMENTO_POR_ERRO';

            vm.isPosse = false;
            vm.bloquear = false;
            vm.isRetorno = false;
            vm.isSuperintendente = false;

            vm.INDEFERO_CANCELAMENTO_ENCERRAMENTO = 'INDEFERO_CANCELAMENTO_ENCERRAMENTO';
            vm.RETORNAR_PARA_COMPLEMENTACAO = 'RETORNAR_PARA_COMPLEMENTACAO';

            function init() {
                vm.destinacao = destinacaoEscopoCompartilhadoService.getObjeto('destinacao');
                if (!vm.destinacao || !vm.destinacao.id || !vm.destinacao.cancelar) {
                    window.history.back();
                }
                if(vm.destinacao.tipoDestinacao.descricao === 'Posse Informal'){
                    vm.isPosse = true;
                }

                if (destinacaoEscopoCompartilhadoService.getObjeto('isSuperintendente')){
                    vm.isSuperintendente = destinacaoEscopoCompartilhadoService.getObjeto('isSuperintendente');
                }

                cancelarEncerrarUtilizacaoService.buscarPorIdDestinacao(vm.destinacao.id).then(function(resp) {
                    vm.cancelamentoEncerramento = resp.data.resultado;
                    if (!vm.cancelamentoEncerramento.id) {
                        vm.cancelamentoEncerramento.cpfResponsavelTecnico = $rootScope.usuarioLogado.cpf;
                        vm.cancelamentoEncerramento.nomeResponsavelTecnico = $rootScope.usuarioLogado.nome;
                    } else {
                        vm.cancelamentoEncerramento.dataCancelamentoEncerramento = new Date(vm.cancelamentoEncerramento.dataCancelamentoEncerramento);
                        vm.isRetorno = true;
                        vm.cancelamentoEncerramento.nomeSuperintendente = $rootScope.usuarioLogado.nome;
                        vm.cancelamentoEncerramento.cpfSuperIntendente = $rootScope.usuarioLogado.cpf
                    }
                }, function() {
                    vm.cancelamentoEncerramento.cpfResponsavelTecnico = $rootScope.usuarioLogado.cpf;
                    vm.cancelamentoEncerramento.nomeResponsavelTecnico = $rootScope.usuarioLogado.nome;
                });

                buscarMotivosCancelarEncerrar();
                buscarDespachosCancelarEncerrar();
            }

            var buscarMotivosCancelarEncerrar = function() {
                cancelarEncerrarUtilizacaoService.buscarListaMotivosEnum()
                        .then(function(resp) {
                    vm.listaMotivos = resp.data.resultado;
                });
            };

            var buscarDespachosCancelarEncerrar = function() {
                cancelarEncerrarUtilizacaoService.buscarListaDespachosEnum()
                        .then(function(resp) {
                    vm.listaDespachos = resp.data.resultado;
                });
            };

            vm.validarDataCancelamentoEncerramento = function(){
                if (vm.cancelamentoEncerramento.dataCancelamentoEncerramento && vm.cancelamentoEncerramento.dataCancelamentoEncerramento > new Date()) {
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-data-invalida'));
                    vm.cancelamentoEncerramento.dataCancelamentoEncerramento = null;
                }
            };

            var validarMotivoDocumentosInseridos = function() {
                if (vm.cancelamentoEncerramento.motivo !== CANCELAMENTO_POR_ERRO
                    && (!vm.cancelamentoEncerramento.arquivos || vm.cancelamentoEncerramento.arquivos.length === 0)) {
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-necessario-incluir-documento'));
                    throw "";
                }
            };

            vm.fecharCancelamentoEncerramentoUtilizacao = function() {
                $state.go('destinacao.consultarDestinacao');
            };

            vm.submeterSuperintendente = function(formularioCancelarEncerrar) {
                if (formularioCancelarEncerrar.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(formularioCancelarEncerrar);
                    return;
                }
                validarMotivoDocumentosInseridos();
                cancelarEncerrarUtilizacaoService.submeterSuperIntendente(vm.destinacao.id, vm.cancelamentoEncerramento).then(function(resp) {
                    $state.go('destinacao.consultarDestinacao');
                });
            };

            vm.confirmar = function (formularioCancelarEncerrar) {
                if (formularioCancelarEncerrar.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(formularioCancelarEncerrar);
                    return;
                }
                cancelarEncerrarUtilizacaoService.confirmarCancelamento(vm.destinacao.id, vm.cancelamentoEncerramento).then(function () {
                    $state.go('destinacao.consultarDestinacao');
                })

            };

            init();
    });
})();
