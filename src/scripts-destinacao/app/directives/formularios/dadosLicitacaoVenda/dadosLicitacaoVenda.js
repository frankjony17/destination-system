(function () {

   angular
     .module('su-destinacao')
     .directive('dadosLicitacaoVenda', directive);

   function directive( dominioService, mensagemDestinacaoService, atendimentoService) {
     return {

       restrict: 'EA',
       scope: {
         licitacaoVenda: '=',
         atendimento: '='
       },
       templateUrl: 'scripts-destinacao/app/directives/formularios/dadosLicitacaoVenda/templates/dadosLicitacaoVenda.html',
       link: function ($scope) {

         $scope.tiposLicitacao = [];
         $scope.mostrarLinkSei = false;
         $scope.buscarTipoLicitacao = buscarTipoLicitacao;
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
           atendimentoService.buscarPorNumeroProcesso($scope.licitacaoVenda.numeroProcesso).then(function (resposta) {
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
         init();

         function buscarTipoLicitacao (){
           dominioService.buscarTodosTipoLicitacao().then(function (resposta){

             $scope.tiposLicitacao = resposta.data.resultado;

           });
         }
         $scope.$watch('atendimento', function (newValue) {
           if (newValue) {
             if (newValue.numeroProcedimento) {
               $scope.licitacaoVenda.numeroProcesso = newValue.numeroProcedimento;
             } else {
               $scope.licitacaoVenda.numeroProcesso = undefined;
             }
           }
         }, true);
       }

     }

   }

}
)();
