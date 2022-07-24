(function(){
angular.module('su-destinacao')
  .directive('informacaoComplementar', diretiva);


function diretiva(arquivoService) {
    return {
        restrict: 'EA',
        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/informacaoComplementar/templates/informacaoComplementar.html',
        scope: {
            informacaoComplementar: '=ngModel',
            documentos: '=',
            bloquearFormulario: '='
        },
        link: function (scope) {

            scope.addDocumento = addDocumento;
            scope.remover = remover;

            function addDocumento ($files) {
                if ($files && $files[0]) {
                    arquivoService.validarFormatoArquivoFotoPDF($files[0].type);
                    arquivoService.uploadFotoPdf($files[0]).then(function(resposta) {
                        var arquivo = {name:angular.copy($files[0].name)};
                        arquivo.id = resposta.data.resultado.id;
                        scope.documentos.push({arquivo: arquivo});
                    });
                    /*scope.documentos.push({arquivo: $files[0]});
                    angular.forEach(scope.documentos, function (documento) {
                        if (!documento.arquivo.id) {
                            arquivoService.uploadFotoPdf(documento.arquivo);
                        }
                    });*/
                }
            }

            function remover (indice) {
                scope.documentos.splice(indice, 1);
            }

        }

    };
}
})();
