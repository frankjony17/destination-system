/**
 * Created by diego.alves on 30/06/17.
 */
(function () {

  angular
    .module('su-destinacao')
    .directive('upload',directive);
  function directive ($filter, mensagemDestinacaoService, arquivoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/upload/templates/upload.html',
      scope: {
        arquivos: '=',
        formatosValidos: '=',
        arquivosRemover: '=',
        bloquear: '=',
        uploadFotoVideo: '='
      },
      link: function ($scope) {

        var CONTENT_TYPE_PDF = 'application/pdf';
        var CONTENT_TYPE_MP4 = 'video/mp4';

        $scope.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.arquivo = {
          id: undefined,
          descricao: undefined,
          documento: undefined
        };

        $scope.removerArquivo = removerArquivo;
        $scope.gerarPreview = gerarPreview;
        $scope.addArquivo = addArquivo;
        $scope.incluirArquivo = incluirArquivo;
        $scope.baixarArquivo = baixarArquivo;

        function removerArquivo(arquivo) {
          var mensagem = $filter("translate")('msg-confirma-exclusao-documento');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice = indexDocumento(arquivo);
            if(angular.isDefined(arquivo.id)) {
              $scope.arquivosRemover.push(arquivo.id);
            }
            $scope.arquivos.splice(indice, 1);
          });
        }

        function indexDocumento(arquivo) {
          return $scope.arquivos.findIndex(function (element) {
            return JSON.stringify(element) === JSON.stringify(arquivo);
          });
        }

        function gerarPreview (arq) {
          arquivoService.gerarPreview(arq);
        }

        function baixarArquivo(arq) {
          return arquivoService.baixarArquivo(arq);
        }

        function addArquivo($files) {
          if (angular.isDefined($files) && $files !== null) {

            arquivoService.validarFormatoValido($scope.formatosValidos, $files[0].type);
            if ($files[0].type === CONTENT_TYPE_PDF) {
                arquivoService.validarTamanhoArquivo($files[0].size);
            } else {                
                arquivoService.validarTamanho5MB($files[0].size);
            }

            $files[0].type === CONTENT_TYPE_PDF
            
            $scope.arquivo.documento = $files[0];
            
          }
        }

        function incluirArquivo() {
            if (angular.isDefined($scope.arquivo.descricao) && angular.isDefined($scope.arquivo.documento)) {
                uploadArquivo();
            } else {
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-campos-obrigatorios'));
            }
        }

        function uploadArquivo() {
            if ($scope.uploadFotoVideo === true) {
              uploadFotoVideo();
            } else {
              uploadArquivosComuns();
            }
            
        }

        function uploadFotoVideo() {
          arquivoService.uploadFotoVideo($scope.arquivo.documento, $scope.arquivo.descricao, new Date()).then(function (resposta) {
                $scope.arquivo.documento = resposta.data.resultado;
                $scope.arquivo.id = resposta.data.resultado.id;
                if ($scope.arquivo.documento.contentType === CONTENT_TYPE_MP4) {
                  $scope.arquivo.tipoArquivo = 'VIDEO';
                } else {
                  $scope.arquivo.tipoArquivo = 'IMAGEM';
                }
                
                $scope.arquivo.imagem = resposta.data.resultado.imagem;
                $scope.arquivos.push(angular.copy($scope.arquivo));
                limpar();
            });
        }

        function uploadArquivosComuns() {
          arquivoService.uploadNovo($scope.arquivo.documento, $scope.arquivo.descricao, '').then(function (resposta) {
                if (resposta.data.resultado.contentType === CONTENT_TYPE_PDF) {
                    $scope.arquivo.exibirPreview = true;
                }
                $scope.arquivo.documento = resposta.data.resultado;
                $scope.arquivo.id = resposta.data.resultado.id;
                $scope.arquivos.push(angular.copy($scope.arquivo));
                limpar();
            });
        }

        function limpar() {
          $scope.arquivo.descricao = undefined;
          $scope.arquivo.documento = undefined;
        }
        
      }
    }
  }
})();
