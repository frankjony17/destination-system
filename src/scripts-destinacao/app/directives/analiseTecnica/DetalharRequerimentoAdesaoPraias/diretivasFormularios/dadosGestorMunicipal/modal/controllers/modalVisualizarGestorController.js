(function () {

  angular.module('su-destinacao').controller('modalVisualizarGestorController', directive);

  function directive ($mdDialog, destinacaoEscopoCompartilhadoService) {

        var vm = this;

        vm.gestor = destinacaoEscopoCompartilhadoService.getObjeto('gestor');
        vm.requerimento = destinacaoEscopoCompartilhadoService.getObjeto('requerimento');
        vm.bloquearCampos = true;

        vm.fechar = fechar;

        function fechar () {
            $mdDialog.cancel();
        }

  }

})();
