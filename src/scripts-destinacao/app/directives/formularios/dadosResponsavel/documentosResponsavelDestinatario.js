(function () {

    angular
        .module('su-destinacao')
        .directive('documentosResponsavelDestinatario', directive);

    function directive () {
        return {
            restrict: 'EA',
            scope:{

            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosResponsavel/templates/documentosResponsavelDestinatario.html',
            link: function ($scope) {

                var vm = $scope;

                var init = function() {

                    vm.registroInicial = 1;
                    vm.tamanhoLimite = 5;
                    vm.totalItems = 0;

                    vm.listaDocumentos = [];
                };



                init();
            }
        };
    }


})();
