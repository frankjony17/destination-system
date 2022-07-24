(function () {
    'use strict';

    angular
        .module('su-destinacao')
        .directive('dadosEnderecoRequerimento', directive);

    function directive() {
        return {
            restrict: 'EA',
            scope: {
                endereco: '=',
                utilizarEnderecoRequerente: '=',
                nomeCampo: '=',
                obrigatorio: '=',
                bloquearCampos: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosEndereco/dadosEnderecoRequerimento.html',
            link: function ($scope) {
                $scope.bloquearCampos = ($scope.bloquearCampos === true);
            }
        };
    }

})();
