(function () {

    angular
        .module('su-destinacao')
        .directive('acessoNegado',directive);

    function directive () {
        return{
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/utilitarios/acessoNegado/templates/acessoNegado.html',

            link: function () {

            }
        };
    }

})();
