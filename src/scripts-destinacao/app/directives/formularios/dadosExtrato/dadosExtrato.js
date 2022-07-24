(function () {
  'use-strict'
  angular
      .module('su-destinacao')
      .directive('dadosExtrato', directive);

    function directive (moment) {
        return {
            restrict: 'EA',
            scope: {
              extrato: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosExtrato/templates/dadosExtrato.html',
            link: function ($scope) {

              $scope.montarLinkAto = montarLinkAto;
              $scope.verificarPodeExibirLink = verificarPodeExibirLink;
              $scope.formartarData = formartarData;

              function montarLinkAto () {
                return 'http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=' +
                  $scope.extrato.secao + '&pagina='+ $scope.extrato.secao +
                  '&data=' + formartarData($scope.extrato.dataPublicacao);
              }

              function verificarPodeExibirLink () {
                return $scope.extrato.secao
                  && $scope.extrato.dataPublicacao;
              }

              function formartarData(data) {
                var dataFormatada = '';
                if (data) {
                  dataFormatada = moment(data).format('DD/MM/YYYY');
                }
                return dataFormatada;
              }
          }
    }

}

})();
