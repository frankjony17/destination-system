(function () {
    'use strict';

    angular.module('su-destinacao')
        .controller('enderecoCorrespondenciaController', controller);

    function controller($scope, destinacaoEscopoCompartilhadoService, $state,$filter, mensagemDestinacaoService,localidadeService ) {

        var vm = $scope;

        vm.enderecoCorrespondencia = null;

        function init() {
            if (destinacaoEscopoCompartilhadoService.getDestinacao()) {

                vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                vm.nomeState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
                destinacaoEscopoCompartilhadoService.limparEscopo();

                if(vm.destinacao.tipoDestinacaoEnum === "TRANSFERENCIA"){
                    vm.enderecoCorrespondencia = vm.destinacao.destinatario.enderecoCorrespondencia;

                }else{
                    vm.enderecoCorrespondencia = vm.destinacao.dadosResponsavel.enderecoCorrespondencia;

                }
            } else {
                window.history.back();
            }
        }

        vm.fecharEnderecoCorrespondecia = function() {
            redirecionarPaginaAnterior();
        };

        vm.salvarEnderecoCorrepondencia = function() {
            if(!vm.formularioEnderecoCorrespondencia.$invalid) {
                if (vm.destinacao.tipoDestinacaoEnum === "TRANSFERENCIA"){
                    vm.destinacao.destinatario.enderecoCorrespondencia = vm.enderecoCorrespondencia;
                }else{
                    vm.destinacao.dadosResponsavel.enderecoCorrespondencia = vm.enderecoCorrespondencia;
                }
                mensagemDestinacaoService.mostrarMensagemSucesso($filter('translate')('mensagem-sucesso-endereco'));
                redirecionarPaginaAnterior();
            }else {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formularioEnderecoCorrespondencia);

            }
        };




        function redirecionarPaginaAnterior() {
            vm.destinacao.recarregarDadosEscopo = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
            $state.go(vm.nomeState);
        }

        init();

    }

})();



