/**
 * Created by basis on 12/12/17.
 */
(function () {
    'use strict';

    angular.module('su-destinacao')
        .controller('enderecoCorrespondenciaResponsavelController', controller);

    function controller($scope, destinacaoEscopoCompartilhadoService, $state) {

        var vm = $scope;

        vm.enderecoCorrespondencia = null;

        function init() {
            if (destinacaoEscopoCompartilhadoService.getDestinacao()) {

                vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                vm.nomeState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
                vm.responsavel = destinacaoEscopoCompartilhadoService.getObjeto('responsavel');
                destinacaoEscopoCompartilhadoService.limparEscopo();

                vm.enderecoCorrespondencia = vm.responsavel.enderecoCorrespondencia;
            } else {
                window.history.back();
            }
        }

        vm.fecharEnderecoCorrespondecia = function() {
            redirecionarPaginaAnterior();
        };

        vm.salvarEnderecoCorrepondencia = function() {
            vm.responsavel.enderecoCorrespondencia = vm.enderecoCorrespondencia;
            redirecionarPaginaAnterior();
        };

        function redirecionarPaginaAnterior() {
            vm.destinacao.recarregarDadosEscopo = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
            destinacaoEscopoCompartilhadoService.setObjetos('responsavel', vm.responsavel);
            $state.go('destinacao.incluirResponsavelDestinatario');
        }

        init();

    }

})();



