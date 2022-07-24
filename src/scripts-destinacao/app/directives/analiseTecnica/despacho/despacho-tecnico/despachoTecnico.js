(function () {

  angular
    .module('su-destinacao')
    .directive('despachoTecnico',diretiva);

    function diretiva (localStorageService,
                        AGUARDANDO_MANIFESTACAO_CHEFIA,
                        AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE,
                        AGUARDANDO_MANIFESTACAO_SECRETARIO,
                        validadorDesapachoService) {
            return {
                restrict: 'EA',
                templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/despacho/despacho-tecnico/templates/despacho-padrao.html',
                scope: {
                    analiseTecnica: '=',
                    despachos: '=',
                    bloquearFormulario: '='

                },
                link: function ($scope) {

                    $scope.SOLICITA_MANIFESTACAO_OUTRA_AREA = 5;

                    $scope.despacho = {};
                    $scope.justificativaObrigatoria = false;

                    $scope.verificarItensObrigatoriosPreenchidos = verificarItensObrigatoriosPreenchidos;
                    $scope.verificarJustificativaObrigatoria = verificarJustificativaObrigatoria;

                    function verificarItensObrigatoriosPreenchidos() {
                        return validadorDesapachoService
                                    .verificarItensObrigatoriosPreenchidos($scope.analiseTecnica);
                    }

                    function verificarJustificativaObrigatoria(despacho) {
                        $scope.justificativaObrigatoria = validadorDesapachoService.verificarJustificativaObrigatoria(despacho);
                    }

            }

        };

    }

})();
