(function(){
  "use strict";
  angular.module("su-destinacao")
    .controller("ConsultarRequerimentoController", consultarRequerimentoController);

  function consultarRequerimentoController(dominioService, requerimentoDestinacaoService, destinacaoEscopoCompartilhadoService,$state,$mdDialog) {
    var vm = this;
    var TIPO_STATUS_EM_ANALISE_TECNICA = 'EM_ANALISE_TECNICA';
    vm.filtro ={
      limit: 5,
      limitsPage: [5, 10, 15],
      page: 1,
      total: 0
    };


     var buscarStatusAnaliseTecnica = function() {
      requerimentoDestinacaoService.buscarTodosStatusAnaliseTecnica()
        .then(function (resposta) {
          vm.situacao = resposta.data.resultado;
        });
    };
    var buscarTodasUFS = function() {
      dominioService.buscarTodasUFS()
        .then(function (resposta) {
          vm.ufs = resposta.data.resultado;
        });
    };

    var buscarTiposDestinacao = function() {
      dominioService.buscarTodosTiposDestinacao()
        .then(function (resposta) {
          vm.tipoDestinacao = resposta.data.resultado;
        })
    };

    var listarTituloRequerimento = function() {
      requerimentoDestinacaoService.listarTituloServicos()
        .then(function (resposta) {
          vm.listaTitulosRequerimento = resposta.data.resultado;
        })

    };

    vm.filterFindAll = function() {
      requerimentoDestinacaoService.consultaRequerimentoEAnaliseTecnica(vm.filtro)
        .then(function (resposta) {
          vm.requerimentos = resposta.data.resultado[0].content;
          vm.filtro.total = resposta.data.resultado[0].totalElements;
          vm.formatDate();
        })
    };

    vm.realizarAnaliseTecnica = function(requerimentoId) {
      destinacaoEscopoCompartilhadoService.setObjetos("requerimentoId", requerimentoId);
      $state.go('destinacao.analiseTecnica');
    };

      vm.abrirModalAnotacoes = function(item){
      $mdDialog.show({
        controller: function($scope){

          $scope.requerimento = item;

          $scope.confirmar = function () {
            $mdDialog.hide($scope.requerimento);
          };

          $scope.fechar = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'scripts-destinacao/pages/analiseTecnica/views/partials/anotacoes.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true
      }).then(function(requerimento){


      });
    };

    vm.exibirCampoNomeResponsavel = function() {
      try{
        return vm.filtro.situacao == TIPO_STATUS_EM_ANALISE_TECNICA;
      }catch (error){
        return false;
      }
    };

    vm.limparPesquisa = function() {
      vm.filtro ={
        limit: 5,
        limitsPage: [5, 10, 15],
        page: 1,
        total: 0
      };
    };

    vm.formatDate = function() {
      angular.forEach(vm.requerimentos, function(item){
        if(item.dataEnvio){
          item.dataEnvio = new Date(item.dataEnvio);
        }
      });
    };



    var init = function(){
      buscarStatusAnaliseTecnica();
      buscarTiposDestinacao();
      listarTituloRequerimento();
      buscarTodasUFS();

    };

    init();

  }
})();
