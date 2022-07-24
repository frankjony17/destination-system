(function () {

    angular.module('su-destinacao').directive('dadosGestorMunicipal', directive);

        function directive ($mdDialog, destinacaoEscopoCompartilhadoService) {
            return {
                restrict: 'EA', //E = element, A = attribute, C = class, M = comment
                scope: {
                    //@ reads the attribute value, = provides two-way binding, & works with functions
                    requerimento: '=',
                    bloquearCampos: '='
                },
                templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosGestorMunicipal/dadosGestorMunicipal.html',
                //controller: controllerFunction, //Embed a custom controller in the directive
                link: function (scope) {

                    scope.abrirModalDadosGestorMunicipal = abrirModalDadosGestorMunicipal;

                    function abrirModalDadosGestorMunicipal (ev, gestor) {

                        destinacaoEscopoCompartilhadoService.setObjetos('gestor', gestor);
                        destinacaoEscopoCompartilhadoService.setObjetos('requerimento', scope.requerimento);
                        $mdDialog.show({
                            controller: 'modalVisualizarGestorController',
                            controllerAs: 'modalVisualizarGestorCtrl',
                            templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosGestorMunicipal/modal/views/modalVisualizarGestor.html',
                            targetEvent: ev
                        });

                    }

                }
        };
    }

})();
