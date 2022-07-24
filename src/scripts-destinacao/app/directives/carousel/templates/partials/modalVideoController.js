(function () {
  'use strict';
  angular
    .module('su-destinacao')
    .controller('modalVideoController', controller);

  function controller ($mdDialog, video, arquivoService) {
    var vm = this;
    vm.exibirVideo = exibirVideo;
    vm.fechar = fechar;

    function fechar() {
      $mdDialog.cancel();
    }

    function exibirVideo() {
      return arquivoService.baixarArquivo(video);
    }
  }

})();
