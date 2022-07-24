/**
 * Created by samuel on 30/06/17.
 */
(function () {

  angular
    .module('su-destinacao')
    .directive('fotos',directive);
  function directive ($filter, mensagemDestinacaoService, arquivoService, moment) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/fotos/templates/fotos.html',
      scope: {
        destinacao: '=',
        bloquear: '=',
          editar: '='
      },
      link: function ($scope) {

        $scope.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.arquivo = {
          id: undefined,
          descricao: undefined,
          data: undefined,
          documento: undefined
        };

        $scope.addArquivo = addArquivo;
        $scope.incluirArquivo = incluirArquivo;
        $scope.baixarArquivo = baixarArquivo;
        $scope.removerArquivo = removerArquivo;

        function removerArquivo(arquivo) {
          var mensagem = $filter("translate")('msg-confirma-exclusao-foto');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice = indexDocumento(arquivo);
            if(angular.isDefined(arquivo)) {
              arquivoService.removerArquivo($scope.destinacao.fotos[indice].arquivo.documento.id);
            }
            $scope.destinacao.fotos.splice(indice, 1);
          });
        }

        function indexDocumento(arquivo) {
          return $scope.destinacao.fotos.findIndex(function (element) {
            return JSON.stringify(element) === JSON.stringify(arquivo);
          });
        }

        function baixarArquivo(arq) {
          return arquivoService.baixarArquivo(arq);
        }

        function addArquivo($files) {
          if(angular.isDefined($files)) {
            arquivoService.validarFormatoFoto($files[0].type);
            arquivoService.validarTamanho5MB($files[0].size);
            $scope.arquivo.foto = $files[0];
          }
        }

        function incluirArquivo(){
          if (angular.isDefined($scope.arquivo.foto) && angular.isDefined($scope.arquivo.descricao) && angular.isDefined($scope.arquivo.data)) {
            arquivoService.uploadFotoVideo($scope.arquivo.foto,$scope.arquivo.descricao, $scope.arquivo.data).then(function (resposta) {
              $scope.arquivo.documento = resposta.data.resultado;
              $scope.arquivo.data = moment(resposta.data.resultado.data).format('DD/MM/YYYY');
              $scope.arquivo.id = resposta.data.resultado.id;
              $scope.arquivo.documento.nomeReal = $scope.arquivo.foto.name;
              $scope.destinacao.fotos.push({arquivo: angular.copy($scope.arquivo)});
              $scope.arquivo.foto = undefined;
              $scope.arquivo.descricao = undefined;
              $scope.arquivo.data = undefined;
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
