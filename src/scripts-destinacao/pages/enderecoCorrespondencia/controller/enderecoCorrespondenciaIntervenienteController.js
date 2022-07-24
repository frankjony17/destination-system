/**
 * Created by basis on 12/12/17.
 */
(function () {
    'use strict';

    angular.module('su-destinacao')
        .controller('enderecoCorrespondenciaIntervenienteController', controller);

    function controller($scope, destinacaoEscopoCompartilhadoService, $state) {

        var vm = $scope;

        vm.enderecoCorrespondencia = null;

        function init() {
            if (destinacaoEscopoCompartilhadoService.getDestinacao()) {

                vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                vm.nomeState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
                vm.interveniente = destinacaoEscopoCompartilhadoService.getObjeto('interveniente');
                destinacaoEscopoCompartilhadoService.limparEscopo();

                vm.enderecoCorrespondencia = vm.interveniente.enderecoCorrespondencia;
            } else {
                window.history.back();
            }
        }

        vm.fecharEnderecoCorrespondecia = function() {
            redirecionarPaginaAnterior();
        };

        vm.salvarEnderecoCorrepondencia = function() {
            vm.interveniente.enderecoCorrespondencia = vm.enderecoCorrespondencia;
            redirecionarPaginaAnterior();
        };

        function redirecionarPaginaAnterior() {
            vm.destinacao.recarregarDadosEscopo = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
            destinacaoEscopoCompartilhadoService.setObjetos('interveniente', vm.interveniente);
            $state.go(vm.nomeState);
        }

        init();

    }

})();



