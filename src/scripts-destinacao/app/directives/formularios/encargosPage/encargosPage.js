(function () {

  angular
    .module('su-destinacao')
    .directive('encargosPage',directive);

  function directive ($mdDialog, destinacaoEscopoCompartilhadoService, $rootScope, $state) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/encargosPage/templates/encargosPage.html',
      scope: {
        destinacaoTransito: '=',
        bloquear: '=',
        rotaDestinacao: '='
      },
      link: function (scope) {

        scope.tabelaEncargos = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        scope.abrirModalIncluirEncargo = abrirModalIncluirEncargo;
        scope.remover = remover;
        scope.editar = editar;
        scope.fechar = fechar;
        scope.cancelar = cancelar;
        scope.init  = init;

        function init(){
            scope.destinacaoTransito.encargos = $rootScope.listaComEncargos;
            scope.listaEncargos = scope.destinacaoTransito.encargos;

            $rootScope.initEncargo= scope;
        }

        init();

        function abrirModalIncluirEncargo () {

          $rootScope.autalizaEncargos();
          scope.destinacaoTransito.recarregarDadosEscopo = true;
          destinacaoEscopoCompartilhadoService.setDestinacao(scope.destinacaoTransito, scope.rotaDestinacao);
          $state.go('destinacao.encargosPage');

        }

        function editar (encargo,ev){
          destinacaoEscopoCompartilhadoService.setObjetos('encargo', encargo);
          abrirModalIncluirEncargo();
        }
        function fechar() {
          $mdDialog.cancel();
        }

        function cancelar() {
          fechar();
        }


        function remover (encargo, ev) {
          var confirm = $mdDialog.confirm()
            .title('Remover Encargo')
            .textContent('Tem certeza que deseja remover este encargo?')
            .targetEvent(ev)
            .ok('Sim')
            .cancel('Não');
          $mdDialog.show(confirm).then(function() {
            var indice;
            for (var i = 0; i < scope.listaEncargos.length; i++) {
              if (scope.listaEncargos[i].nome == encargo.nome) {
                indice = i;
                break;
              }
            }
            scope.listaEncargos.splice(indice, 1);
          }, function() {
            cancelar();
          });

        }

      }
    };
  }


})();
