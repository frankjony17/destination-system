(function () {

  angular
    .module('su-destinacao')
    .directive('despachoChefia',diretiva);

    function diretiva ( AGUARDANDO_MANIFESTACAO_CHEFIA,
                        AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE,
                        AGUARDANDO_MANIFESTACAO_SECRETARIO,
                        validadorDesapachoService,
                        usuarioDestinacaoService) {
            return {
                restrict: 'EA',
                templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/despacho/despacho-chefia/templates/despacho-chefia.html',
                scope: {
                    analiseTecnica: '=',
                    despachos: '=',
                    bloquearFormulario: '='

                },
                link: function ($scope) {

                    $scope.SOLICITA_MANIFESTACAO_OUTRA_AREA = 5;
                    $scope.ALTERAR_AVALIACAO_TECNICA = 8;

                    var PERMISSAO_ANALISE_SECRETARIO = 'DESTINACAO_EXEC_ANALISE_TEC_SECRETARIO';
                    var PERMISSAO_ANALISE_CHEFIA = 'DESTINACAO_EXEC_ANALISE_TEC_CHEFIA';
                    var PERMISSAO_ANALISE_SUPERINTENDENTE = 'DESTINACAO_EXEC_ANALISE_TEC_SUPERINTENDENTE';

                    $scope.despacho = {};
                    $scope.justificativaObrigatoria = false;

                    $scope.visualizarDespacho = visualizarDespacho;
                    $scope.visualizarDespachoChefia = visualizarDespachoChefia;
                    $scope.visualizarDespachoSuperintendente = visualizarDespachoSuperintendente;
                    $scope.visualizarDespachoSecretario = visualizarDespachoSecretario;
                    $scope.verificarItensObrigatoriosPreenchidos = verificarItensObrigatoriosPreenchidos;
                    $scope.verificarJustificativaObrigatoria = verificarJustificativaObrigatoria;
                    $scope.limparOpcoesAlteracao = limparOpcoesAlteracao;

                    $scope.exibirOpcoesChefia = exibirOpcoesChefia;
                    $scope.exibirOpcoesPadaoChefia = exibirOpcoesPadaoChefia;

                    function verificarItensObrigatoriosPreenchidos() {
                        return validadorDesapachoService.verificarItensObrigatoriosPreenchidos($scope.analiseTecnica);
                    }

                    function verificarJustificativaObrigatoria(despacho) {
                        $scope.justificativaObrigatoria = validadorDesapachoService.verificarJustificativaObrigatoria(despacho);
                    }

                    function visualizarDespacho(status) {
                        try {
                            return $scope.analiseTecnica.statusAnaliseTecnica.id === status;
                        } catch (error) {
                            return false;
                        }
                    }

                    function visualizarDespachoChefia() {
                        return visualizarDespacho(AGUARDANDO_MANIFESTACAO_CHEFIA) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA);
                    }

                    function visualizarDespachoSuperintendente() {
                        return visualizarDespacho(AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE);
                    }

                    function visualizarDespachoSecretario() {
                        return visualizarDespacho(AGUARDANDO_MANIFESTACAO_SECRETARIO) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO) ;
                    }

                    function limparOpcoesAlteracao(depacho) {
                        if (depacho.id != 8 && $scope.despachos[1]) {
                            $scope.despachos.splice(1, 1);
                        }

                    }

                    function exibirOpcoesChefia() {
                        return usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA);
                    }

                    function exibirOpcoesPadaoChefia() {

                        if ($scope.analiseTecnica.despachosTecnico.length == 0) {
                            return true;
                        } else {
                            /*var listaDespachosChefia = $scope.analiseTecnica.despachosChefia.filter(function (elem) {
                                return elem.id >= 1 && elem.id <= 5;
                            });
                            return PERFIL_CHEFIA === getPerfilUsuarioLogado()
                                && (listaDespachosChefia.length > 0
                                    || $scope.analiseTecnica.despachosTecnico.length == 0)
                                && $scope.analiseTecnica.despachosTecnico.length == 0;*/
                                return false;
                        }
                    }

            }

        };

    }

})();
