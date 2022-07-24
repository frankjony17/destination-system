/**
 * Created by samuel on 30/06/17.
 */
(function () {

  angular
    .module('su-destinacao')
    .directive('dadosResponsavelUsoProprio',directive);
  function directive (responsavelService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosResponsavelUsoProprio/templates/dadosResponsavelUsoProprio.html',
      scope: {
        usoProprio: '='
      },
      link: function ($scope) {

        $scope.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.tamanhoFlex = 100;

        $scope.$watch('usoProprio.destinacaoImoveis', function (newValue) {
          $scope.usoProprio.responsaveis = [];
          $scope.tamanhoFlex = 100;
          if (newValue.length !== 0) {
            responsavelService.getDadosResponsavel(newValue[0].imovel.idCadastroImovel).then(function (resposta) {
              $scope.usoProprio.responsavel = resposta.data.resultado;
              $scope.tamanhoFlex = 33;
              $scope.usoProprio.idResponsavelCadastro = $scope.usoProprio.responsavel.id;
            });
          }
        },true);
      }
    }
  }
})();
