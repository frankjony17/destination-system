(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .controller('ModalVisualizarArquivosController', controller);

        function controller ($mdDialog, destinacaoEscopoCompartilhadoService, arquivoService) {

            var vm = this;
            vm.documento = destinacaoEscopoCompartilhadoService.getObjeto('documento');
            vm.arquivos = destinacaoEscopoCompartilhadoService.getObjeto('arquivos');

            vm.fechar = fechar;
            vm.downloadArquivo = downloadArquivo;

            function downloadArquivo(id) {
                return arquivoService.downloadArquivoRequerimento(id);
            }

            function fechar () {
                $mdDialog.cancel();
            }
        }

})();
