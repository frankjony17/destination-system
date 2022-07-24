(function () {
  'use strict';

  angular
    .module('su-destinacao')
    .controller('incluirImovelController', controller);

  function controller ($state,
                       destinacaoEscopoCompartilhadoService,
                       imovelDestinacaoService,
                       mensagemDestinacaoService,
                       $filter,
                       usuarioDestinacaoService,
                       $window) {

    var vm = this;


    vm.tabelaImovel = {
      limit: 5,
      limitsPage: [5, 10, 15],
      page: 1
    };

    vm.imovel = {
    };
    vm.fechar = fechar;
    vm.confirmar = confirmar;
    vm.buscar = buscar;
    vm.incluir = incluir;
    vm.remover = remover;
    vm.consultarRip = consultarRip;
    vm.abrirDetalharImovel = abrirDetalharImovel;



    function init() {
        vm.destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
        vm.tipoDestinacao = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('tipoDestinacao'));
        vm.nomeStateDestinacao = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
        vm.destinacaoImoveis = vm.destinacao.destinacaoImoveis;
    }
    init();

    function buscar () {

      imovelDestinacaoService.consultarPorRip(vm.imovel.rip, vm.tipoDestinacao, vm.destinacao.codFundamentoLegal).then(function (resposta) {

        if (resposta.data.erros && resposta.data.erros.length > 0) {
          mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
        } else if (resposta.data.mensagens && resposta.data.mensagens.length > 0) {
          mensagemDestinacaoService.mostrarMensagemError(resposta.data.mensagens);
        } else {
          vm.imovel = resposta.data.resultado;
        }
      });
    }

      function inserirParcela(parcela) {
          var descImovelParcela = [];
          for (var i = 0; i < vm.destinacaoImovel.parcelas.length; i++) {
              if (parcela.id === vm.destinacaoImovel.parcelas[i].id) {
                  descImovelParcela.push(angular.copy(parcela));
              }
          }
          vm.destinacaoImovel.parcelas = descImovelParcela;
      }

    function fechar() {
        vm.destinacao.destinacaoImoveis = vm.destinacaoImoveis;
        vm.destinacao.recarregarDadosEscopo = true;
        destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeStateDestinacao);
        $state.go(vm.nomeStateDestinacao)
    }

    function confirmar() {
        vm.destinacao.recarregarDadosEscopo = true;
        destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeStateDestinacao);
        $state.go(vm.nomeStateDestinacao);
    }

    function incluir() {
      if (vm.imovel.rip && vm.imovel.areaTerreno) {
        if (validarUFMesmaJuridicaoUsuarioLogado()) {
          if (verificaImovelMesmaUF()) {
            var destinacaoImovel = {imovel: vm.imovel, codigoUtilizacao: vm.imovel.codigoUtilizacao, destinacao: vm.imovel.destinacao, parcelas: vm.imovel.parcelas};
            vm.destinacao.destinacaoImoveis.push(destinacaoImovel);
            vm.imovel = {};
          } else {
            mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-uf-imovel-diferentes'));
          }

        } else {
          mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-uf-juridicao-diferentes'))
        }
      } else {
        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-imovel-obrigatorio'));
      }

    }

    function remover (imovel) {
      var indice;
      for (var i = 0; i < vm.destinacao.destinacaoImoveis.length; i++) {
        if (imovel.codigoUtilizacao == vm.destinacao.destinacaoImoveis[i].codigoUtilizacao) {
          indice = i;
        }
      }
      vm.destinacao.destinacaoImoveis.splice(indice, 1);
    }

    function consultarRip () {
      mensagemDestinacaoService.mostrarMensagemError('Funcionalidade não implementada.');
    }

    function verificaImovelMesmaUF(){
      var ufIguais = true;
      var uf = vm.imovel.endereco.uf;
      for (var i = 0; i < vm.destinacao.destinacaoImoveis.length; i++) {
        if (uf != vm.destinacao.destinacaoImoveis[i].imovel.endereco.uf) {
          ufIguais = false;
          break;
        }
      }
      return ufIguais;
    }

    function validarUFMesmaJuridicaoUsuarioLogado() {
      var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
      var uf = vm.imovel.endereco.uf;
      return usuarioLogado.jurisdicoes.indexOf(uf)!= -1;
    }

    function abrirDetalharImovel(imovel) {
      var url = destinacaoEscopoCompartilhadoService.getUrlsPorAmbiente();
      $window.open(url.su + 'detalharImovel/' + imovel.id,'_blank');
    }

  }
})();
