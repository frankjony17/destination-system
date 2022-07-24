(function () {

  angular
      .module('su-destinacao')
      .directive('informacoesImovel',directive);

    function directive () {
        return {
            restrict: 'EA',
            templateUrl: 'scripts-destinacao/app/directives/imovel/templates/informacoesImovel.html',
            scope:{
              destinacaoImoveis: '='
            },
            link: function ($scope) {

              $scope.imagens = [];

              function extrairImagensImoveis () {

                $scope.imagens = [];

                if ($scope.imoveis.length == 1) {
                    angular.forEach($scope.imoveis[0].imagens, function (imagem) {
                        $scope.imagens.push(imagem);
                    });
                } else {
                    $scope.imagens = [];
                }

              }

              $scope.$watch('destinacaoImoveis', function (newValue) {
                if (newValue) {
                  $scope.imoveis = [];
                  angular.forEach($scope.destinacaoImoveis, function (destinacaoImovel) {
                    /*if (destinacaoImovel.imovel.imagens) {
                      angular.forEach(destinacaoImovel.imovel.imagens, function (imagem) {
                        delete imagem.id;
                      });
                    }*/
                    $scope.imoveis.push(destinacaoImovel.imovel);
                  });
                  extrairImagensImoveis();
                }
              }, true);


            }
        };
    }


})();
