(function () {

  angular
    .module('su-destinacao')
    .directive('incluirDocumento',directive);

  function directive ($mdDialog,$state, destinacaoEscopoCompartilhadoService, moment) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/incluirDocumento/templates/incluirDocumento.html',
      scope: {
        destinacao: '=',
        rotaRetorno: '=',
        bloquear: '='
      },
      link: function ($scope) {


        $scope.tabelaDocumentos = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.abrirIncluirDocumento = abrirIncluirDocumento;
        $scope.remover = remover;
        $scope.editar = editar;
        $scope.fechar = fechar;
        $scope.cancelar = cancelar;
        $scope.montarLink = montarLink;

        function abrirIncluirDocumento() {
          $scope.destinacao.recarregarDadosEscopo = true;
          destinacaoEscopoCompartilhadoService.setObjetos('bloquear', $scope.bloquear);
          destinacaoEscopoCompartilhadoService.setObjetos('indiceRetorno', 2);
          destinacaoEscopoCompartilhadoService.setDestinacao($scope.destinacao, $scope.rotaRetorno);
          $state.go('destinacao.incluirDocumento');

        }

        function editar (documento,ev){
          destinacaoEscopoCompartilhadoService.setObjetos('documento', documento);
          abrirIncluirDocumento(ev);

        }
        function fechar() {
          $mdDialog.cancel();
        }

        function cancelar() {
          fechar()
        }


        function remover (documento, ev) {
          var confirm = $mdDialog.confirm()
            .title('Remover Documento')
            .textContent('Tem certeza que deseja remover este documento?')
            .targetEvent(ev)
            .ok('Confirmar')
            .cancel('Cancelar');
          $mdDialog.show(confirm).then(function() {
            var indice;
            for (var i = 0; i < $scope.destinacao.documentos.length; i++) {
              if ($scope.destinacao.documentos[i].tipoDocumentoSelecionado == documento.tipoDocumentoSelecionado) {
                indice = i;
                break;
              }
            }
            $scope.destinacao.documentos.splice(indice, 1);
          }, function() {
            cancelar();
          });

        }

        function montarLink(documento) {
          if (documento.dataPublicacao) {
            var link = 'http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=' +
            documento.secao + '&pagina='+ documento.pagina +
            '&data=' + formartarData(documento.dataPublicacao);
            return link;
          }

        }

        function formartarData(data) {
          var dataFormatada = '';
          if (data) {
            dataFormatada = moment(data).format('DD/MM/YYYY');
          }
          return dataFormatada;
        }

      }
    };
  }


})();
