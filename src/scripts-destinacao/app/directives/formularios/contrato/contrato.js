(function () {

  angular
    .module('su-destinacao')
    .directive('contrato', directive);

  function directive (arquivoService, $filter, mensagemDestinacaoService, destinacaoEscopoCompartilhadoService, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/contrato/templates/contrato.html',
      scope: {
        dadosContrato: '=',
        tipoDestinacao: '=',
        statusDestinacao: '=',
        bloquear: '='
      },
      link: function ($scope) {

        var TIPO_DESTINACAO_VENDA = 'VENDA';
        var TIPO_DESTINACAO_TERMO_ENTREGA = "TERMO_ENTREGA";

        $scope.addContrato = addContrato;
        $scope.remover = remover;
        $scope.gerarPreview = gerarPreview;
        $scope.exibirPorTipoDestinacao = exibirPorTipoDestinacao;
        $scope.validarDataVigencia = validarDataVigencia;

          $scope.atualizaDataFinal = function () {
              destinacaoEscopoCompartilhadoService.setObjetos("dataFinal", $scope.dadosContrato.dataFinal);
              $rootScope.dataFinal = angular.copy($scope.dadosContrato.dataFinal);
              $rootScope.autalizaEncargos();
          };

          function addContrato ($files) {
              if ($files && $files[0]) {
                  arquivoService.validarFormatoArquivo($files[0].type);
                  $scope.dadosContrato.arquivo = $files[0];
                  arquivoService.uploadNovo($scope.dadosContrato.arquivo,null,$scope.dadosContrato.arquivo.lastModifiedDate).then(function (resposta) {
                      $scope.dadosContrato.arquivo = resposta.data.resultado;
                  });
              }
            }

          $rootScope.autalizaEncargos = function(){
                for(var i = 0; i < $rootScope.encargosList.length; i++){
                    if($rootScope.encargosList[i].utilizarData){
                      $rootScope.encargosList[i].dataCumprimento = $rootScope.dataFinal;
                    }
              }
            };

          function remover () {
              mensagemDestinacaoService.confirmar($filter('translate')('msg-confirma-exclusao'), function () {
                  $scope.dadosContrato.arquivo = undefined;
              });
          }

          function validarDataVigencia() {
              var mensagem;
              var dataAtual = Date.now();
              dataAtual = new Date(dataAtual);
              dataAtual.setHours(0);
              dataAtual.setMinutes(0);
              dataAtual.setSeconds(0);
              dataAtual.setMilliseconds(0);
              if ($scope.dadosContrato.dataFinal <= $scope.dadosContrato.dataInicio) {
                  mensagem = $filter('translate')('msg-data-final-vigencia');
                  mensagemDestinacaoService.mostrarMensagemError(mensagem);
                  $scope.dadosContrato.dataFinal = undefined;
                  $scope.dadosContrato.dataInicio = undefined;
                  throw mensagem;
              }
              if ($scope.dadosContrato.dataFinal < dataAtual){
                  mensagem = $filter('translate')('msg-data-final-vigencia-menor-que-hoje');
                  mensagemDestinacaoService.mostrarMensagemError(mensagem);
                  $scope.dadosContrato.dataFinal = undefined;
                  throw mensagem
              }
              if($scope.dadosContrato.dataInicio > dataAtual){
                  mensagem = $filter('translate')('msg-data-inicio-vigencia');
                  mensagemDestinacaoService.mostrarMensagemError(mensagem);
                  $scope.dadosContrato.dataInicio = undefined;
                  throw mensagem;
              }
          }

          function gerarPreview () {
            arquivoService.gerarPreview($scope.dadosContrato.arquivo);
          }

          function exibirPorTipoDestinacao () {
                return $scope.tipoDestinacao === TIPO_DESTINACAO_VENDA || TIPO_DESTINACAO_TERMO_ENTREGA;
          }

      }
    };
  }

})();
