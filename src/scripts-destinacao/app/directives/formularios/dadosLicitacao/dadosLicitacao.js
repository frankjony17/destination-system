(function () {

  angular
    .module('su-destinacao')
    .directive('dadosLicitacao',directive);

  function directive ($filter, arquivoService, dominioService, mensagemDestinacaoService, moment, atendimentoService) {
    return {
      restrict: 'EA',
      scope: {
        licitacao: '=',
        atendimento: '=',
        bloquear: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosLicitacao/templates/dadosLicitacao.html',
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

        $scope.tiposLicitacao = [];
        $scope.mostrarLinkSei = false;
        $scope.buscarTipoLicitacao = buscarTipoLicitacao;
        $scope.removerArquivo = removerArquivo;
        $scope.gerarPreview = gerarPreview;
        $scope.addArquivo = addArquivo;
        $scope.incluirArquivo = incluirArquivo;
        $scope.buscarPorNumeroProcesso = buscarPorNumeroProcesso;
        $scope.montarLinkSei = montarLinkSei;

        function init(){
          $scope.buscarTipoLicitacao();
        }

        init();

        function montarLinkSei() {
          return 'https://www.google.com.br';
        }

        function buscarPorNumeroProcesso() {
          atendimentoService.buscarPorNumeroProcesso($scope.licitacao.numeroProcesso).then(function (resposta) {
            if (resposta.data.resultado != null) {
              atendimentoService.verificarNumeroProcedimentoSei(resposta.data.resultado.idRequerimento,
                                                                resposta.data.resultado.numeroProcedimento).then(function (resposta) {
                $scope.mostrarLinkSei = resposta.data.resultado;
              });
            } else {
              mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
            }
          });
        }

        function buscarTipoLicitacao (){
          dominioService.buscarTodosTipoLicitacao().then(function (resposta){

            $scope.tiposLicitacao = resposta.data.resultado;

          });
        }

        $scope.$watch('atendimento', function (newValue) {
          if (newValue) {
            if (newValue.numeroProcedimento) {
              $scope.licitacao.numeroProcesso = newValue.numeroProcedimento;
            }
          }
        }, true);

        function removerArquivo(arquivo) {
          var mensagem = $filter("translate")('msg-confirma-exclusao');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice = indexDocumento(arquivo);
            if(angular.isDefined(arquivo)) {
              arquivoService.removerArquivo($scope.licitacao.arquivos[indice].documento.id);
            }
            $scope.licitacao.arquivos.splice(indice, 1);
          });
        }

        function indexDocumento(arquivo) {
          return $scope.licitacao.arquivos.findIndex(function (element) {
            return JSON.stringify(element) === JSON.stringify(arquivo);
          });
        }

        function gerarPreview (arq) {
          arquivoService.gerarPreview(arq);
        }

        function addArquivo($files) {
          if(angular.isDefined($files)){
            arquivoService.validarFormatoArquivo($files[0].type);
            arquivoService.validarTamanhoArquivo($files[0].size);
            $scope.arquivo.documento = $files[0];
          }
        }

        function incluirArquivo(){
          if(angular.isDefined($scope.arquivo.documento)){
            arquivoService.uploadNovo($scope.arquivo.documento,
                                      $scope.arquivo.descricao,
                                      $scope.arquivo.data).then(function (resposta) {
              $scope.arquivo.documento = resposta.data.resultado;
              $scope.arquivo.data = moment($scope.arquivo.data).format('YYYY-MM-DD');
              $scope.arquivo.id = resposta.data.resultado.id;
              $scope.licitacao.arquivos.push(angular.copy($scope.arquivo));
              $scope.arquivo= undefined;
            });
          }
        }
      }
    }
  }
}
)();
