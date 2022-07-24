(function () {

  'use strict';

    angular.module('su-destinacao')
      .directive('dadosDestinacao', diretiva);

    function diretiva (destinacaoEscopoCompartilhadoService, $mdDialog) {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/dadosDestinacao/templates/dadosDestinacao.html',
            scope: {
                analiseTecnica: '='
            },
            link: function (scope) {

                scope.visualizarMinuta = visualizarMinuta;

                function visualizarMinuta (ev) {
                    destinacaoEscopoCompartilhadoService.setObjetos('idRequerimento', '');
                    $mdDialog.show({
                        controller: 'ModalMinutaController',
                        controllerAs: 'modalMinutaCtrl',
                        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/dadosDestinacao/partials/views/modalMinuta.html',
                        targetEvent: ev
                    });

                  }

            }

        };
    }

})();