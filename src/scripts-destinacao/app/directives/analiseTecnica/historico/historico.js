
(function(){
angular.module('su-destinacao')
  .directive('historico', diretiva);


function diretiva ($http) {
    return {
        restrict: 'EA',
        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/historico/template/historico.html',
        scope: {
            analiseTecnica: '='
        },
        link: function (scope) {

            var URL = 'destinacao/api/historicoAnaliseTecnica';

            scope.tabelaHistoricos = {
                        limit: 5,
                        limitsPage: [5, 10, 20],
                        page: 1,
                        total: 0
            };

            scope.historicos = [];

            scope.listarHistoricos = listarHistoricos;

            function init () {
                if (scope.analiseTecnica && scope.analiseTecnica.id)
                    listarHistoricos ();
            }

            function listarHistoricos () {
                $http.get(URL + '/' + scope.analiseTecnica.id +
                                '/' + (scope.tabelaHistoricos.page - 1)+
                                '/' + scope.tabelaHistoricos.limit)
                .then(function (resposta) {
                    var resultado = resposta.data.resultado;
                    scope.historicos = resultado.content;
                    scope.tabelaHistoricos.total = resultado.totalElements;
                });
            }

            scope.$watch('analiseTecnica', function (newValue) {
                if (newValue) {
                    init();
                }
            }, true);


        }

    };
}
})();
