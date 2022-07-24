(function(){
    "use strict";
    angular.module("su-destinacao")
        .controller("EncerrarDestinacaoController", function($scope, encerrarDestinacaoService, $rootScope, destinacaoEscopoCompartilhadoService,
                                                                     mensagemDestinacaoService, $filter, $state) {

            var vm = $scope;

            vm.encerramentoDestinacao = {};

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

                encerrarDestinacaoService.buscarPorIdDestinacao(vm.destinacao.id).then(function(resp) {
                    vm.encerramentoDestinacao = resp.data.resultado;
                    if (!vm.encerramentoDestinacao.id) {
                        vm.encerramentoDestinacao.cpfResponsavelTecnico = $rootScope.usuarioLogado.cpf;
                        vm.encerramentoDestinacao.nomeResponsavelTecnico = $rootScope.usuarioLogado.nome;
                    } else {
                        vm.encerramentoDestinacao.dataEncerramentoDestinacao = new Date(vm.encerramentoDestinacao.dataEncerramentoDestinacao);
                        vm.isRetorno = true;
                        vm.encerramentoDestinacao.nomeSuperintendente = $rootScope.usuarioLogado.nome;
                        vm.encerramentoDestinacao.cpfSuperIntendente = $rootScope.usuarioLogado.cpf
                    }
                }, function() {
                    vm.encerramentoDestinacao.cpfResponsavelTecnico = $rootScope.usuarioLogado.cpf;
                    vm.encerramentoDestinacao.nomeResponsavelTecnico = $rootScope.usuarioLogado.nome;
                });

                buscarMotivosEncerrarDestinacao();
                buscarDespachosCancelarEncerrar();
            }

            var buscarMotivosEncerrarDestinacao = function() {
                encerrarDestinacaoService.buscarListaMotivosEnum()
                    .then(function(resp) {
                        vm.listaMotivos = resp.data.resultado;
                    });
            };

            var buscarDespachosCancelarEncerrar = function() {
                encerrarDestinacaoService.buscarListaDespachosEnum()
                    .then(function(resp) {
                        vm.listaDespachos = resp.data.resultado;
                    });
            };

            vm.validarDataEncerramentoDestinacao = function(){
                if (vm.encerramentoDestinacao.dataEncerramentoDestinacao && vm.encerramentoDestinacao.dataEncerramentoDestinacao > new Date()) {
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-data-invalida'));
                    vm.encerramentoDestinacao.dataEncerramentoDestinacao = null;
                }
            };

            var validarMotivoDocumentosInseridos = function() {
                if (vm.encerramentoDestinacao.motivo !== CANCELAMENTO_POR_ERRO
                    && (!vm.encerramentoDestinacao.arquivos || vm.encerramentoDestinacao.arquivos.length === 0)) {
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-necessario-incluir-documento'));
                    throw "";
                }
            };

            vm.fecharEncerramentoDestinacao = function() {
                $state.go('destinacao.consultarDestinacao');
            };

            vm.submeterSuperintendente = function(formularioEncerrarDestinacao) {
                if (formularioEncerrarDestinacao.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(formularioEncerrarDestinacao);
                    return;
                }
                validarMotivoDocumentosInseridos();
                encerrarDestinacaoService.submeterSuperIntendente(vm.destinacao.id, vm.encerramentoDestinacao).then(function(resp) {
                    $state.go('destinacao.consultarDestinacao');
                });
            };

            vm.confirmar = function (formularioEncerrarDestinacao) {
                if (formularioEncerrarDestinacao.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(formularioEncerrarDestinacao);
                    return;
                }
                encerrarDestinacaoService.confirmarEncerramento(vm.destinacao.id, vm.encerramentoDestinacao).then(function () {
                    $state.go('destinacao.consultarDestinacao');
                })

            };

            init();
        });
})();
