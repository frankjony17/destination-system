(function () {

  angular
    .module('su-destinacao')
    .directive('despachoSuperintendente',diretiva);

    function diretiva ( AGUARDANDO_MANIFESTACAO_CHEFIA,
                        AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE,
                        AGUARDANDO_MANIFESTACAO_SECRETARIO,
                        validadorDesapachoService,
                        usuarioDestinacaoService) {
            return {
                restrict: 'EA',
                templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/despacho/despacho-superintendente/templates/despacho-superintendente.html',
                scope: {
                    analiseTecnica: '=',
                    despachos: '=',
                    bloquearFormulario: '='

                },
                link: function ($scope) {

                    $scope.SOLICITA_MANIFESTACAO_OUTRA_AREA = 5;
                    $scope.ALTERAR_AVALIACAO_TECNICA = 15;

                    var PERMISSAO_ANALISE_SUPERINTENDENTE = 'DESTINACAO_EXEC_ANALISE_TEC_SUPERINTENDENTE';

                    $scope.despacho = {};
                    $scope.justificativaObrigatoria = false;

                    $scope.visualizarDespacho = visualizarDespacho;
                    $scope.verificarItensObrigatoriosPreenchidos = verificarItensObrigatoriosPreenchidos;
                    $scope.verificarJustificativaObrigatoria = verificarJustificativaObrigatoria;
                    $scope.limparOpcoesAlteracao = limparOpcoesAlteracao;

                    $scope.exibirOpcoesSuperintendente = exibirOpcoesSuperintendente;
                    $scope.exibirOpcoesPadaoSuperintendente = exibirOpcoesPadaoSuperintendente;

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

                    function limparOpcoesAlteracao(depacho) {
                        if (depacho.id != 8 && $scope.despachos[1]) {
                            $scope.despachos.splice(1, 1);
                        }

                    }

                    function exibirOpcoesSuperintendente() {
                        return usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE);
                    }

                    function exibirOpcoesPadaoSuperintendente() {
                        if ($scope.analiseTecnica.despachosChefia.length === 0
                                && $scope.analiseTecnica.despachosTecnico.length === 0) {
                            return true;
                        } else {
                            /*console.log('segundo');
                            var listaDespachosSuperintendente = $scope.analiseTecnica.despachosSuperintendente.filter(function (elem) {
                                return elem.id >= 1 && elem.id <= 5;
                            });

                            if ()

                            return existeRespostaTecnico(listaDespachosSuperintendente)
                                    || existeRespostaChefia(listaDespachosSuperintendente);*/
                                    return false;
                        }

                    }


            }

        };

    }

})();
