(function () {
  'use strict';

  angular
    .module('su-destinacao')
    .controller('incluirInteressadoController', controller);

  function controller ($mdDialog, mensagemDestinacaoService, destinacaoEscopoCompartilhadoService, arquivoService){

    var vm = this;

    vm.addArquivo = addArquivo;
    vm.incluir = incluir;
    vm.fechar = fechar;
    vm.limpar = limpar;
    vm.confirmar = confirmar;
    vm.remover = remover;
    vm.verificaCnpj = verificaCnpj;

    vm.mostraUg = false;
    vm.interessados = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('interessados'));
    vm.interessado = {
      fotos: []
    };

    function verificaCnpj () {
      try {
        return vm.interessado.cpfCnpj.length == 14;
      } catch(erro) {
        return false;
      }
    }

    function addArquivo ($files) {
      if ($files && $files[0]) {
        arquivoService.validarFormatoArquivoFotoPDF($files[0].type);
        var foto = $files[0];
        vm.interessado.fotos.push(foto);
        arquivoService.upload(foto);
      }
    }

    function fechar() {
      $mdDialog.cancel();
    }

    function confirmar () {
      $mdDialog.hide(vm.interessados);
      destinacaoEscopoCompartilhadoService.limparEscopo();
    }


    function incluir () {
      if (vm.formInteressado.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.formInteressado);
        return
      }
      vm.interessados.push(vm.interessado);
      limpar();
    }

    function limpar () {
      vm.interessado = {};
    }

    function remover (interessado) {
      var indice;
      for (var i = 0; i < vm.interessados.length; i++) {
        if (vm.interessados[i].cpfCnpj == interessado.cpfCnpj) {
          indice = i;
          break;
        }
      }
      vm.interessados.splice(indice, 1);
    }

  }
})();
