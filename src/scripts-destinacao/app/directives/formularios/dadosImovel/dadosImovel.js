(function () {

  angular
    .module('su-destinacao')
    .directive('dadosImovel',directive);

  function directive ($mdDialog, destinacaoEscopoCompartilhadoService, mensagemDestinacaoService, $filter,$state) {
    return {
      restrict: 'EA',
      scope: {
          destinacaoImoveis: '=',
          tipoDestinacao: '=',
          bloquear: '=',
          permiteEditar: '=',
          nomeState:'='
      },
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosImovel/templates/dadosImovel.html',
      link: function ($scope) {

        $scope.tabelaImovel = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.abrirModalIncluirImovel = abrirModalIncluirImovel;
        $scope.remover = remover;
        $scope.lpad = lpad;

        function abrirModalIncluirImovel () {
          destinacaoEscopoCompartilhadoService.setObjetos('tipoDestinacao', $scope.tipoDestinacao);
          destinacaoEscopoCompartilhadoService.setDestinacao($scope.destinacaoImoveis, $scope.nomeState);
          $state.go('destinacao.incluirImovel');
        }

          function lpad(parcela) {
            if(angular.isDefined(parcela)){
              var texto = parcela.substring(1, parcela.length);
              var digito = parcela.substring(0, 1);
              return digito + (texto.length >= 4 ? texto : new Array(4 - texto.length + 1).join('0') + texto);
            }
          }

        function remover (imovel) {
          var mensagem = $filter('translate')('msg-confirma-exclusao-imovel');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice;
            for (var i = 0; i < $scope.destinacaoImoveis.length; i++) {
              if ($scope.destinacaoImoveis.destinacaoImoveis[i].imovel.rip === imovel.rip) {
                indice = i;
                break;
              }
            }
            $scope.destinacaoImoveis.destinacaoImoveis.splice(indice, 1);
          });

        }
      }
    };
  }


})();
