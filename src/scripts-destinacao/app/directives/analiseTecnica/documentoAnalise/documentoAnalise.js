(function(){
angular.module('su-destinacao')
  .directive('documentoAnalise', diretiva);

function diretiva(arquivoService, destinacaoEscopoCompartilhadoService, $mdDialog) {
  return {
    restrict: 'EA',
    templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/documentoAnalise/template/documentoAnalise.html',
    scope: {
      documentosAnalise: '=',
      documentosRequerimento: '=',
      bloquearFormulario: '=',
      titulo: '=',
      obrigatorio: '=',
      analiseTecnica: '=',
      tipoComplementar: '='
    },
    link: function (scope) {

      scope.documentosObrigatorios = [];

      scope.downloadArquivo = downloadArquivo;
      scope.abrirModalVisualizarDocumentos = abrirModalVisualizarDocumentos;

      function downloadArquivo(id) {
        return arquivoService.downloadArquivoRequerimento(id);
      }

      function abrirModalVisualizarDocumentos(ev, documento) {
        destinacaoEscopoCompartilhadoService.setObjetos('arquivos', documento.arquivos);
        destinacaoEscopoCompartilhadoService.setObjetos('documento', documento);
        $mdDialog.show({
          controller: 'ModalVisualizarArquivosController',
          controllerAs: 'modalVisualizarArquivosCtrl',
          templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/documentoAnalise/partials/views/modalVisualizarArquivos.html',
          targetEvent: ev
        });
      }

    }

  };
}

})();
