(function() {
'use strict';

    angular
        .module('su-destinacao')
        .controller('BeneficiarioModalController', controller);

    function controller($filter, $mdDialog, destinacaoEscopoCompartilhadoService, mensagemDestinacaoService, responsavelService) {

        var vm = this;

        var TIPO_REPOSPOSAVEL = 'RESPONSAVEL';

        vm.familiasBeneficiadas = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('familiasBeneficiadas'));
        vm.coletivo = destinacaoEscopoCompartilhadoService.getObjeto('coletivo');
        var areaTotalImovel = destinacaoEscopoCompartilhadoService.getObjeto('areaTotalImovel');
        var familiaBeneficiada = destinacaoEscopoCompartilhadoService.getObjeto('familiaBeneficiada');

        vm.sequencial = getProximoSequencial();
        vm.familiaBeneficiada = {};

        vm.tabelaBeneficiario = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        vm.init = init;
        vm.fechar = fechar;
        vm.confirmar = confirmar;
        vm.incluir = incluir;
        vm.remover = remover;
        vm.editar = editar;
        vm.buscarPessoaPorCpf = buscarPessoaPorCpf;

        function init () {

            if (familiaBeneficiada) {
                vm.familiaBeneficiada = familiaBeneficiada;
            }
        }

        function fechar () {
            $mdDialog.cancel();
        }

        function confirmar () {
            $mdDialog.hide(vm.familiasBeneficiadas);
        }

        function incluir () {
            if (vm.form.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
                return;
            }
            if (!vm.coletivo && vm.familiasBeneficiadas.length >= 1 && !vm.familiaBeneficiada.sequencial) {
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-mais-um-beneficiario-tipo-individual'));
                return;
            }
            addBeneficiario();

            vm.familiaBeneficiada = {};
        }

        function addBeneficiario () {

            if (!vm.familiaBeneficiada.sequencial) {
                vm.familiaBeneficiada.sequencial = getProximoSequencial ();
                vm.sequencial = getProximoSequencial () + 1;
                addAreaUtilizada(vm.familiaBeneficiada)
                vm.familiasBeneficiadas.push(vm.familiaBeneficiada);
            } else {
                var indice;
                for (var i = 0; i < vm.familiasBeneficiadas.length; i++) {
                    if (vm.familiasBeneficiadas[i].sequencial === vm.familiaBeneficiada.sequencial) {
                        indice = i;
                        break;
                    }
                }
                addAreaUtilizada(vm.familiaBeneficiada)
                vm.familiasBeneficiadas[indice] = vm.familiaBeneficiada;
            }
        }

        function addAreaUtilizada (familia) {
            if (!vm.coletivo) {
                familia.areaUtilizada = areaTotalImovel;
            }
        }

        function remover (beneficiario) {

            var indice;
            for (var i = 0; i < vm.familiasBeneficiadas.length; i++) {
                if (vm.familiasBeneficiadas[i].sequencial === beneficiario.sequencial) {
                    indice = i;
                    break;
                }
            }
            vm.familiasBeneficiadas.splice(indice, 1);

        }

        function editar (beneficiario) {
            vm.familiaBeneficiada = angular.copy(beneficiario);
            vm.sequencial = vm.familiaBeneficiada.sequencial;
        }

        function getProximoSequencial () {
            return vm.familiasBeneficiadas.length + 1;
        }

        function buscarPessoaPorCpf(tipo) {
            var cpf;
            if (tipo === TIPO_REPOSPOSAVEL) {
                cpf = vm.familiaBeneficiada.cpfResponsavel;
            } else {
                cpf = vm.familiaBeneficiada.cpfConjuge;
            }
            if (cpf && cpf.length == 11) {
                responsavelService.getDadosPessoaFisica(cpf).then(function (resposta) {
                    if (tipo === TIPO_REPOSPOSAVEL) {
                        vm.familiaBeneficiada.nomeResponsavel = resposta.data.resultado.nomeRazaoSocial;
                    } else {
                        vm.familiaBeneficiada.nomeConjuge = resposta.data.resultado.nomeRazaoSocial;
                    }
                });
            } else {
                limparBeneficiario(tipo);
            }
        }

        function limparBeneficiario (tipo) {
            if (tipo === TIPO_REPOSPOSAVEL && angular.isUndefined(vm.familiaBeneficiada.cpfResponsavel)) {
                vm.familiaBeneficiada.nomeResponsavel = undefined;
            } else if (angular.isUndefined(vm.familiaBeneficiada.cpfConjuge)) {
                vm.familiaBeneficiada.nomeConjuge = undefined;
            }
        }
    }

})();
