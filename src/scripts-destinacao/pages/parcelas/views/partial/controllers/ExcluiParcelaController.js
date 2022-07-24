/**
 * Created by guilherme on 03/03/17.
 */
(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .controller('ExcluirParcelaController', ExcluirParcelaController);

  function ExcluirParcelaController ($mdDialog, parcelaModal,rip,
                                     benfeitorias,
                                     parcelaService,
                                     mensagemDestinacaoService,
                                     destinacaoImovelService,
                                     $filter,
                                     idDestinacaoImoveis) {

    var vm = this;
    vm.parcelas = [];
    vm.parcelaModal = parcelaModal;
    vm.benfeitorias = benfeitorias;
    vm.parcelaSelecionda = {};
    vm.codigoUtilizacao= undefined;
    vm.rip = rip;

    vm.fechar = fechar;
    vm.confirmar = confirmar;
    vm.popularParcela = popularParcela;
    vm.formatarAreaBenfeitoria = formatarAreaBenfeitoria;

    function init() {
        vm.parcelaModal.rip = vm.rip;
        vm.parcelaModal.idDestinacaoImoveis = idDestinacaoImoveis;
        destinacaoImovelService.buscarDadosUtilizacao(rip, vm.parcelaModal.id).then(function (resposta) {
            vm.codigoUtilizacao = resposta.data.resultado.codigoUtilizacao;
            buscarParcelasSemUtilizacao(vm.rip, vm.codigoUtilizacao);
        });
    }

    init();

    function buscarParcelasSemUtilizacao(rip, codigoUtilizacao) {
        parcelaService.buscarParcelasSemUtilizacao(rip, codigoUtilizacao).then(function (resposta) {
            var todasParcelas = resposta.data.resultado;
            vm.parcelas = todasParcelas.filter(function(element) {
                return parcelaModal.sequencial !== element.sequencial;
            }); 
        });
    }

    function popularParcela(parcela) {
      vm.parcelaSelecionda = angular.copy(parcela);
      vm.parcelaSelecionada.rip = vm.rip;
      vm.parcelaSelecionada.idDestinacaoImoveis = idDestinacaoImoveis;
    }

    function confirmar(){

      var listaParcela = [];
      
      if (vm.parcelaSelecionada == undefined) {
        mensagemDestinacaoService.mostrarMensagemError("Favor informar uma parcela destino");
      } else {
        listaParcela.push(vm.parcelaModal);
        listaParcela.push(vm.parcelaSelecionada);  
        parcelaService.excluir(listaParcela).then(function () {
            mensagemDestinacaoService.mostrarMensagemSucesso("Parcela Excluida com Sucesso");
            $mdDialog.hide();
        });
      }
    }

    function fechar () {
      $mdDialog.cancel();
    }

    function formatarAreaBenfeitoria(area) {
          if (area) {
            return $filter('number')(area);
          }
          return '-';
      }

  }

})();
