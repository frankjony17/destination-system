(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .controller('incluirEncargoPageController', controller);

        function controller ($mdDialog, destinacaoEscopoCompartilhadoService, mensagemDestinacaoService, $rootScope, $state, destinacaoServiceUtil) {

            var indice;
            var vm = this;

            var destinacaoTmp;

            $rootScope.encargosList = [];

            vm.tabelaEncargos = {
                limit: 5,
                limitsPage: [5, 10, 15],
                page: 1
            };

            init();
            vm.fechar = fechar;
            vm.confirmar = confirmar;
            vm.incluir = incluir;
            vm.limparPrazoCumprimento = limparPrazoCumprimento;
            vm.remover = remover;
            vm.editar = editar;
            vm.indexEncargo = indexEncargo;

            function init() {
              var encargo = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('encargo'));

              destinacaoTmp = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
              vm.rotaRetorno = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
              destinacaoServiceUtil.retornarConsultaDestiancaoVazia(destinacaoTmp);
              vm.encargos = angular.copy(destinacaoTmp.encargos);
              vm.encargo = {cumprimentoEncargo: false};
              vm.modoEdicao = false;

              if(angular.isDefined(encargo)) {
                indice = indexEncargo(encargo);
                vm.modoEdicao = true;
                vm.encargo = angular.copy(vm.encargos[indice]);

                if (vm.encargo.dataCumprimento) {
                  vm.encargo.dataCumprimento = new Date(vm.encargo.dataCumprimento);
                }

              }

            }

            function fechar () {
              $state.go(vm.rotaRetorno);

            }

            function confirmar () {

              destinacaoTmp.encargos = vm.encargos;

                $rootScope.listaComEncargos = destinacaoTmp.encargos;
              destinacaoTmp.recarregarDadosEscopo = true;
              destinacaoEscopoCompartilhadoService.setDestinacao(destinacaoTmp, vm.rotaRetorno);
              $state.go(vm.rotaRetorno);

            }

            function incluir () {
              if (vm.formEncargo.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formEncargo);
                return;
              }
              verificarSeExistesNaLista();
              limpar();
              confirmar();
            }

            function limparPrazoCumprimento () {
              if (vm.encargo.utilizarData) {
                vm.encargo.dataCumprimento = $rootScope.dataFinal;
                $rootScope.autalizaEncargos();
              }
            }

            limparPrazoCumprimento();

            function limpar () {
              vm.encargo = {cumprimentoEncargo: false};
              indice = undefined;
              vm.modoEdicao = false;
            }

            function editar(encargo){
              vm.modoEdicao = true;
              indice = indexEncargo(encargo);
              vm.encargo = angular.copy(encargo);
              vm.nome = vm.encargo.nome;
            }

            function remover(encargo) {
              var indice = indexEncargo(encargo);
              vm.encargos.splice(indice, 1);
            }

            function indexEncargo(encargo) {
              var indice;
              for (var i = 0; i < vm.encargos.length; i++) {
                if (vm.encargos[i].nome == encargo.nome) {
                  indice = i;
                  break;
                }
              }
              return indice;

            }

            function verificarSeExistesNaLista() {
              if(angular.isUndefined(indice)){
                vm.encargos.push(vm.encargo);
              } else {
                vm.encargos[indice]= vm.encargo;
              }
              $rootScope.encargosList = vm.encargos;
              $rootScope.listaComEncargos =  $rootScope.encargosList;
            }

        }

})();
