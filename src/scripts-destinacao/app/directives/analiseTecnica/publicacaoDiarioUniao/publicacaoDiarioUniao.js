(function(){
angular.module('su-destinacao')
  .directive('publicacaoDiarioUniao', diretiva);


function diretiva (analiseTecnicaService, dataUtilService, mensagemDestinacaoService, $state) {
    return {
        restrict: 'EA',
        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/publicacaoDiarioUniao/templates/publicacaoDiarioUniao.html',
        scope: {
            analiseTecnica: '='
        },
        link: function (scope) {

            scope.registrarPublicacaoDiarioUniao = registrarPublicacaoDiarioUniao;
            scope.montarLinkAto = montarLinkAto;
            scope.verificarPodeExibirLink = verificarPodeExibirLink;
            scope.fechar = fechar;

            function registrarPublicacaoDiarioUniao() {
                if(scope.publicacaoDiario.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(scope.publicacaoDiario);
                    return;
                }

                analiseTecnicaService.registrarPublicacaoDiarioUniao(scope.analiseTecnica)
                    .then(function(resposta) {
                        scope.analiseTecnica.publicacao = resposta.data.resultado;
                        $state.go('destinacao.consultarAnaliseTecnica');
                    });
            }

            function montarLinkAto () {
                var publicacao = scope.analiseTecnica.publicacao;
                if (!verificarPodeExibirLink()) {
                    return;
                }
                return 'http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=' +
                publicacao.numeroSecao + '&pagina='+ publicacao.numeroPagina +
                '&data=' + dataUtilService.formatar(publicacao.dataPublicacao, 'DD/MM/YYYY');
            }

            function verificarPodeExibirLink () {
                var publicacao = scope.analiseTecnica.publicacao;
                return publicacao
                        && publicacao.numeroSecao
                        && publicacao.numeroPagina
                        && publicacao.dataPublicacao;
            }

            function fechar() {
                $state.go('destinacao.consultarAnaliseTecnica');
            }

            function iniciaData() {
                if (scope.analiseTecnica && scope.analiseTecnica.publicacao && scope.analiseTecnica.publicacao.dataPublicacao) {
                    scope.analiseTecnica.publicacao.dataPublicacao = new Date(scope.analiseTecnica.publicacao.dataPublicacao);
                }
            }

            iniciaData();

        }

    };
}

})();
