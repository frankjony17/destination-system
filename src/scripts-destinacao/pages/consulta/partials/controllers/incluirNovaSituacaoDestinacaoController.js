/**
 * Created by basis on 10/01/17.
 */
(function () {
    'use strict';
    angular.module("su-destinacao").controller("incluirNovaSituacaoDestinacaoController", consultarDestinacaoController);

    function consultarDestinacaoController($mdDialog,
                                           consultarDestinacaoService,
                                           $state,
                                           mensagemDestinacaoService,
                                           imovel,
                                           destinacaoEscopoCompartilhadoService,
                                           $rootScope) {
        var vm = this;

        var rotas = {};

        vm.tipoDestinacoes = [];
        vm.tipoDestinacao = undefined;

        vm.fechar = fechar;
        vm.confirmar = confirmar;

        function init() {
            carregarListaTipoDestincao();
            inicializarRotasInstrumentos();
        }

        init();

        function addRotasInstrumentos(idInstrumento, rota) {
            rotas[idInstrumento] = rota;
        }

        function inicializarRotasInstrumentos() {
            addRotasInstrumentos(1, 'destinacao.doacao');
            addRotasInstrumentos(2, 'destinacao.venda');
            addRotasInstrumentos(3, 'destinacao.posseInformal');
            addRotasInstrumentos(4, 'destinacao.cuem');
            addRotasInstrumentos(5, 'destinacao.cdru');
            addRotasInstrumentos(6, 'destinacao.cessaoGratuita');
        }


        function carregarListaTipoDestincao() {
            consultarDestinacaoService.carregarListaTipoDestincao().then(function (resposta) {
                vm.tipoDestinacoes = resposta.data.resultado;
                vm.tipoDestinacoes = vm.tipoDestinacoes.filter(function (tipoDestinacao) {
                    return tipoDestinacao.codigo !== '12' && $rootScope.usuarioLogado.permissoes.indexOf(tipoDestinacao.permissaoCadastrarEditar.trim()) != -1;
                });
            });
        }

        function fechar() {
            $mdDialog.cancel();
        }

        function confirmar() {
            if (vm.form.$valid) {
                /** DESCOMENTAR CODIGO QUANDO IMPLEMENTAR FUNCIONALIDADE DE MANTER DESTINAÇÃO.
                 * $state.go(vm.tipoDestinacao);
                 */
                destinacaoEscopoCompartilhadoService.setObjetos('imovel', imovel);
                alert('Chamar de destinação quando implementar todo o manter.')
                fechar();
            } else {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
            }

        }



    }
})();
