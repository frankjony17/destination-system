(function () {

  angular
    .module('su-destinacao')
    .directive('dadosParcelaRemanescente', directive);


  function directive(mensagemDestinacaoService, $filter, arquivoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosParcela/templates/dadosParcelaRemanescente.html',
      scope: {
        parcelaRemanescente: '='
      },
      link: function (scope) {

        var CONTENT_TYPE_ZIP = 'application/zip';
        var CONTENT_TYPE_OCTET = 'application/octet-stream';

        scope.desabilitarMemorialDescritivo = false;

        scope.selecionarTodosCheckboxs = selecionarTodosCheckboxs;
        scope.adicionarArquivos = adicionarArquivos;
        scope.removerArquivo = removerArquivo;

        scope.$watch('parcelaRemanescente.benfeitorias', function () {
            if (angular.isDefined(scope.parcelaRemanescente.benfeitorias)) {
                var quantidadeSelecionados = 0;
                angular.forEach(scope.parcelaRemanescente.benfeitorias, function (benfeitoria) {
                    if (benfeitoria.selecionado === true) {
                        quantidadeSelecionados++;
                    }
                });

                if (quantidadeSelecionados === scope.parcelaRemanescente.benfeitorias.length) {
                    scope.parcelaRemanescente.checkboxAll = true;
                } else {
                    scope.parcelaRemanescente.checkboxAll = false;
                }

            }
        }, true);


        function selecionarTodosCheckboxs() {
            angular.forEach(scope.parcelaRemanescente.benfeitorias, function (benfeitoria) {
                benfeitoria.selecionado = scope.checkboxAll;
            });
        }

        function uploadArquivos(arquivo) {
            arquivoService.uploadComShapeFile(arquivo).then(function (resposta) {
            arquivo.id = resposta.data.resultado.id;
            scope.parcelaRemanescente.arquivos.push(arquivo);
            var contentType = resposta.data.resultado.contentType;
            if (contentType === CONTENT_TYPE_ZIP || contentType === CONTENT_TYPE_OCTET) {
                scope.parcelaRemanescente.memorialDescritivo = resposta.data.resultado.coordenadas;
                scope.desabilitarMemorialDescritivo = true;
            }
            }, function (error) {
                var mensagem = error.data.erros;
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
            });
        }

        function adicionarArquivos($files) {

            if ($files === null) {
                return;
            }

            var quantidadeShapeFile = 0;
            var indexPrimeiroShapeFile = 0;

            if (scope.parcelaRemanescente.arquivos.length !== 0 
                                && angular.isDefined($files) 
                                && arquivoService.validarShapeFile($files[0])) {
                    angular.forEach(scope.parcelaRemanescente.arquivos, function (arquivo, index) {
                        if(arquivo.type === CONTENT_TYPE_ZIP){
                            indexPrimeiroShapeFile = index;
                            quantidadeShapeFile++;
                        }
                    });
                }

            if (quantidadeShapeFile !== 0) {
                var mensagem =('msg-confirma-sobrepor-shapefile');
                mensagemDestinacaoService.confirmarEditandoBotoes($filter('translate')(mensagem), function () {
                    scope.parcelaRemanescente.arquivos.splice(indexPrimeiroShapeFile, 1);
                    uploadArquivos($files[0]);
                });
            } else {
                angular.forEach($files, function (arquivo) {
                    arquivoService.validarFormatoArquivoMemorialDescritivo(arquivo);
                    uploadArquivos(arquivo);
                });
            }
        }

        function removerArquivo(index) {

            mensagemDestinacaoService.confirmar($filter('translate')('msg-remover-arquivo'), function () {
                var arquivo = scope.parcelaRemanescente.arquivos[index];

                if (arquivoService.validarShapeFile(arquivo)) {
                    scope.parcelaRemanescente.memorialDescritivo = undefined;
                    scope.desabilitarMemorialDescritivo = false;
                }

                scope.parcelaRemanescente.arquivos.splice(index, 1);

            });
            
        }

      }
    };
  }

})();