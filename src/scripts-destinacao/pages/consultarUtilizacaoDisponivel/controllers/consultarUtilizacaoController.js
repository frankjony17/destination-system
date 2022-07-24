(function(){
    "use strict";
    angular.module("su-destinacao").controller("consultarUtilizacaoController", consultarUtilizacaoController);

    function consultarUtilizacaoController(localidadeService, mensagemDestinacaoService, destinacaoService,destinacaoEscopoCompartilhadoService, $state, $filter,
                            destinacaoServiceUtil, validadorDestinacaoService,$rootScope, consultaUtilizacaoService) {

        var vm = this;

        vm.tabelaUtilizacoes = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        vm.destinacaoServiceUtil = destinacaoServiceUtil;
        vm.municipios = [];
        vm.utilizacaoFiltro = {pais:'Brasil'};
        vm.bloquearCep = false;
        vm.utilizacoes = [];

        function init() {
            if (destinacaoEscopoCompartilhadoService.getDestinacao()) {
                vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                vm.destinacaoState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
                destinacaoEscopoCompartilhadoService.limparEscopo();

                buscarPaises();
            }else {
                window.history.back();
            }
        }
        init();

        function buscarPaises() {
            localidadeService.buscarPaises().then(function(resposta) {
                vm.paises = resposta.data.resultado;
            });
        }

        vm.fechar = function() {
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.destinacaoState);
            window.history.back();
        };

        function buscarUfs() {
            vm.ufs = $rootScope.usuarioLogado.jurisdicoes.sort();
        }

        $rootScope.$watch('usuarioLogado', function(){
            if($rootScope.usuarioLogado){
                buscarUfs();
            }
        }, true);

        vm.buscarMunicipios = function() {
            if (vm.utilizacaoFiltro.uf) {
                localidadeService.buscarMunicipiosPorUf(vm.utilizacaoFiltro.uf).then(function(resposta) {
                    vm.municipios = resposta.data.resultado;
                });
            } else {
                vm.municipios = [];
            }

        };

        vm.limparPesquisa = function(){
            vm.utilizacaoFiltro = {pais:'Brasil'};
            vm.utilizacoes = [];
            vm.municipios = [];
            vm.bloquearCep = false;
        };

        vm.buscarPeloCep = function(){
            if(angular.isDefined(vm.utilizacaoFiltro.cep) && vm.utilizacaoFiltro.cep !== ''){
                localidadeService.buscarEnderecoByCep(vm.utilizacaoFiltro.cep).then(function (resposta) {
                    vm.utilizacaoFiltro.uf = resposta.data.resultado.uf;
                    vm.buscarMunicipios();
                    vm.utilizacaoFiltro.municipio = resposta.data.resultado.municipio;
                    vm.bloquearCep = true;

                }, function (error) {
                })
            }else {
                vm.utilizacaoFiltro.uf = '';
                vm.municipios = [];
                vm.utilizacaoFiltro.municipio = '';
                vm.bloquearCep = false;
            }
        };
        vm.atualizarTabela = function() {
            vm.utilizacaoFiltro.offset = angular.copy(vm.tabelaUtilizacoes.page) - 1;
            vm.utilizacaoFiltro.limit = angular.copy(vm.tabelaUtilizacoes.limit);
            vm.buscar();
        };

        vm.buscar = function () {
            vm.utilizacaoFiltro.offset = angular.copy(vm.tabelaUtilizacoes.page) - 1;
            vm.utilizacaoFiltro.limit = angular.copy(vm.tabelaUtilizacoes.limit);
            vm.utilizacaoFiltro.fundamentoLegal = vm.destinacao.codFundamentoLegal;
            separarDadosUtilizacao();
            if(vm.form.$valid){
                consultaUtilizacaoService.consultar(vm.utilizacaoFiltro).then(function (retorno) {
                    vm.utilizacoes = retorno.data.resultado;
                    if(vm.utilizacoes.length === 0){
                        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-nem-resultado'))
                    }
                    vm.utilizacaoFiltro.rip = null;
                    vm.utilizacaoFiltro.codigoUtilizacao = null;
                    vm.utilizacaoFiltro.codigoParcela = null;
                })
            }else {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
            }
        };

        function separarDadosUtilizacao() {
            if (angular.isDefined(vm.utilizacaoFiltro.dadosUtilizacao)) {
                var dadosConsulta = vm.utilizacaoFiltro.dadosUtilizacao.split('/');
                extrairRip(dadosConsulta);
                if (dadosConsulta.length > 1) {
                    var dadosUtilizacao = dadosConsulta[1].split('P');
                    extrairCodigoUtilizacaoDestinacao(dadosUtilizacao);
                    extrairParcela(dadosUtilizacao);

                }
            }
        }

        function extrairRip(dadosConsulta) {
            if (dadosConsulta.length >= 1 && dadosConsulta[0] !== '') {
                vm.utilizacaoFiltro.rip = dadosConsulta[0];
            }
        }

        function extrairCodigoUtilizacaoDestinacao(dadosUtilizacao) {
            if (dadosUtilizacao.length >= 1) {
                vm.utilizacaoFiltro.codigoUtilizacao = dadosUtilizacao[0];
            }
        }
        function extrairParcela(dadosUtilizacao) {
            if (dadosUtilizacao.length > 1) {
                vm.utilizacaoFiltro.codigoParcela = 'P' + parseInt(dadosUtilizacao[1]);
            }
        }

        vm.selecionarEstaUtilizacao = function (utilizacao) {
            destinacaoEscopoCompartilhadoService.setObjetos('utilizacao', utilizacao);
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.destinacaoState);
            window.history.back();
        }

    }

})();
