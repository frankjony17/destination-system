(function () {
    'use strict';
    angular.module('su-destinacao').directive('exibirElementoPorPermissaoDestinacao', function ($rootScope) {
        return ({
            restrict: 'EA',
            scope: {
                permissoes:'=',
                permissaoConcedida:"=",
                detalhar:"="
            },
            link: function link($scope, element) {
                angular.element(element).addClass('invisivel');
                var verificarPermissao = function () {
                    var roles = ($scope.permissoes || '').split(',');
                    angular.forEach(roles, function (role, $index) {
                        if(role.indexOf("MANTER") !== -1){
                            roles[$index] = role.split("_").join("");
                        }
                    });
                    var usuarioLogado = $rootScope.usuarioLogado;
                    var possuiPermissoes = usuarioLogado && usuarioLogado.permissoes;
                    for (var i = 0; i < roles.length && possuiPermissoes; i++) {
                        if (usuarioLogado.permissoes.indexOf(roles[i].trim()) != -1 &&
                            ((angular.isDefined($scope.detalhar) && $scope.detalhar) ||
                                (angular.isUndefined($scope.detalhar) || !$scope.detalhar))) {
                            angular.element(element).removeClass('invisivel');
                            return $scope.permissaoConcedida;
                        }
                    }
                    $scope.permissaoConcedida = false;
                    angular.element(element).remove();
                    return $scope.permissaoConcedida;
                };
                $scope.$watch('usuarioLogado', function (values) {
                    if (values || angular.isDefined($rootScope.usuarioLogado)) {
                        verificarPermissao();
                    }
                });
            }
        });
    });
})();
