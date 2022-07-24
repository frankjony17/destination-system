/**
 * Created by samuel on 30/06/17.
 */
(function () {

  angular
    .module('su-destinacao')
    .directive('documentos',directive);
  function directive ($filter, mensagemDestinacaoService, arquivoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/documentos/templates/documentos.html',
      scope: {
        destinacao: '=',
          bloquear: '=',
          editar: '='
      },
      link: function ($scope) {

          $scope.CONTENT_TYPE_PDF = 'application/pdf';

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
            if(angular.isDefined(arquivo)) {
              arquivoService.removerArquivo($scope.destinacao.documentosArquivo[indice].arquivo.documento.id);
            }
            $scope.destinacao.documentosArquivo.splice(indice, 1);
          });
        }

        function indexDocumento(arquivo) {
          return $scope.destinacao.documentosArquivo.findIndex(function (element) {
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
          if(angular.isDefined($files) && $files !== null){
            arquivoService.validarFormatoDocumento($files[0].type);
            arquivoService.validarTamanho5MB($files[0].size);
            $scope.arquivo.documento = $files[0];
          }
        }

        function incluirArquivo(){
          if(angular.isDefined($scope.arquivo.descricao) && angular.isDefined($scope.arquivo.documento)) {
              arquivoService.uploadNovo($scope.arquivo.documento, $scope.arquivo.descricao, '').then(function (resposta) {
                if (resposta.data.resultado.contentType === $scope.CONTENT_TYPE_PDF) {
                  $scope.arquivo.exibirPreview = true;
                }
                $scope.arquivo.documento = resposta.data.resultado;
                $scope.arquivo.id = resposta.data.resultado.id;
                $scope.destinacao.documentosArquivo.push({arquivo: angular.copy($scope.arquivo)});
                $scope.arquivo.descricao = undefined;
                $scope.arquivo.documento = undefined;
                  $scope.arquivo.exibirPreview = undefined;
              });
          }
          else{
            mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-campos-obrigatorios'));
          }
        }
      }
    }
  }
})();
