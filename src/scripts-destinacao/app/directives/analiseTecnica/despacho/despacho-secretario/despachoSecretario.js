(function () {

  angular
    .module('su-destinacao')
    .directive('despachoSecretario',diretiva);

    function diretiva (localStorageService,
                        AGUARDANDO_MANIFESTACAO_SECRETARIO,
                        usuarioDestinacaoService) {
            return {
                restrict: 'EA',
                templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/despacho/despacho-secretario/templates/despacho-secretario.html',
                scope: {
                    analiseTecnica: '=',
                    despachos: '=',
                    bloquearFormulario: '='

                },
                link: function ($scope) {

                    var PERMISSAO_ANALISE_SECRETARIO = 'DESTINACAO_EXEC_ANALISE_TEC_SECRETARIO';
                    var APROVA_ADESAO = 9;
                    var RETORNAR_SUPERINTENDENTE = 11;
                    var NAO_ATENDE_REQUISITOS = 2;
                    /*var INDEFERIDO = 11;
                    var ENVIADO_PUBLICACAO = 7;*/

                    $scope.justificativaObrigatoria = false;
                    $scope.mostrarMinuta = false;

                    $scope.exibirDespacho = exibirDespacho;
                    $scope.exibirMinuta = exibirMinuta;
                    $scope.verificarJustificativaObrigatoria = verificarJustificativaObrigatoria;
                    $scope.removerAprovoIndeferimento = removerAprovoIndeferimento;

                    function exibirDespacho() {
                        /*return (PERFIL_SECRETARIO === usuarioService.getPerfilUsuarioLogado()
                            && $scope.analiseTecnica.statusAnaliseTecnica.id == AGUARDANDO_MANIFESTACAO_SECRETARIO)
                            || (PERFIL_SECRETARIO === usuarioService.getPerfilUsuarioLogado()
                            && $scope.analiseTecnica.statusAnaliseTecnica.id == INDEFERIDO)
                            || (PERFIL_SECRETARIO === usuarioService.getPerfilUsuarioLogado()
                            && $scope.analiseTecnica.statusAnaliseTecnica.id == ENVIADO_PUBLICACAO)*/
                           return (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO)
                            && $scope.despachos.length >= 0)
                            || (!usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO)
                            && $scope.despachos.length > 0);
                    }

                    function exibirMinuta(despacho) {
                        $scope.mostrarMinuta = despacho.id == APROVA_ADESAO;
                    }

                    function verificarJustificativaObrigatoria(despacho) {
                        $scope.justificativaObrigatoria = despacho.id == RETORNAR_SUPERINTENDENTE;
                    }

                    function removerAprovoIndeferimento() {
                        try {
                            var naoAtendeRequistos = false;
                            angular.forEach($scope.analiseTecnica.despachosSuperintendente, function(item) {
                                if (item.id == NAO_ATENDE_REQUISITOS)
                                    naoAtendeRequistos = true;
                            });
                            return naoAtendeRequistos;
                        } catch(error) {
                            return false;
                        }
                    }

            }

        };

    }

})();
