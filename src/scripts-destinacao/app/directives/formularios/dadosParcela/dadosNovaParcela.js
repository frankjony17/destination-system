(function () {

  angular
    .module('su-destinacao')
    .directive('dadosNovaParcela', directive);


  function directive(mensagemDestinacaoService, $filter, arquivoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosParcela/templates/dadosNovaParcela.html',
      scope: {
        parcelaNova: '=',
        parcelaRemanescente: '=',
        parcelaSelecionada: '=',
        ultimaParcelaCriada: '=',
        editar: '='
      },
      link: function (scope) {

        var CONTENT_TYPE_ZIP = 'application/zip';
        var CONTENT_TYPE_OCTET = 'application/octet-stream';

        scope.desabilitarMemorialDescritivo = false;

        scope.validarAreaInserida = validarAreaInserida;
        scope.verificarTodosSelecionados = verificarTodosSelecionados;
        scope.selecionarTodosCheckboxs = selecionarTodosCheckboxs;
        scope.setarDadoParcelaRemanescente = setarDadoParcelaRemanescente;
        scope.adicionarArquivos = adicionarArquivos;
        scope.removerArquivo = removerArquivo;
        scope.marcarDesmarcarBenfeitoriasParcelaRemanescente = marcarDesmarcarBenfeitoriasParcelaRemanescente;

        scope.$watch('parcelaNova.arquivos', function () {
            scope.desabilitarMemorialDescritivo = false;
            for (var i = 0; i < scope.parcelaNova.arquivos.length; i++) {
                var arquivo = scope.parcelaNova.arquivos[i];
                if (arquivoService.validarShapeFile(arquivo)) {
                    scope.desabilitarMemorialDescritivo = true;
                    break;
                }
            }
        }, true);

        scope.$watch('parcelaSelecionada', function () {
             scope.parcelaNova.sequencial = extrarProximoSequencial(scope.ultimaParcelaCriada);
        }, true);

        function extrarProximoSequencial(ultimaParcelaCriada) {
            var sequencial = ultimaParcelaCriada.substring(1, ultimaParcelaCriada.length);
            return 'P' + (parseInt(sequencial) + 1);
        }

        function validarAreaInserida() {
            if(scope.parcelaNova.areaTerreno <= 0 
                || scope.parcelaNova.areaTerreno >= scope.parcelaSelecionada.areaTerreno){
                scope.parcelaNova.areaTerreno = undefined;
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-area-parcela-invalida'));
            }
        }

        function verificarTodosSelecionados() {
            var qtdSelecionados = scope.parcelaNova.benfeitorias.filter(function (benfeitoria) {
                return benfeitoria.selecionado === true;
            });
            if (qtdSelecionados.length === scope.parcelaNova.benfeitorias.length) {
                scope.parcelaNova.checkboxAll = true;
            } else {
                scope.parcelaNova.checkboxAll = false;
            }
        }

        function selecionarTodosCheckboxs() {
            angular.forEach(scope.parcelaNova.benfeitorias, function (benfeitoria) {
                benfeitoria.selecionado = scope.parcelaNova.checkboxAll;
            });
            desmarcarTodasBenfeitoriasParcelasRemanecentes(!scope.parcelaNova.checkboxAll);
        }

        function desmarcarTodasBenfeitoriasParcelasRemanecentes(selecionado) {
            angular.forEach(scope.parcelaRemanescente.benfeitorias, function(benfeitoria) {
                benfeitoria.selecionado = selecionado;
            });
        }

        function setarDadoParcelaRemanescente() {
            if (angular.isDefined(scope.parcelaNova.areaTerreno) && scope.parcelaNova.areaTerreno > 0) {
                var areaRestante = scope.parcelaSelecionada.areaTerreno - scope.parcelaNova.areaTerreno;
                scope.parcelaRemanescente.areaTerreno = areaRestante;
                var benfeitorias = angular.copy(scope.parcelaNova.benfeitorias);
                scope.parcelaRemanescente.benfeitorias = benfeitorias;
                marcarBenfeitoriasSemUtilizacao(scope.parcelaNova.benfeitorias);
                scope.parcelaRemanescente.sequencial = extrarProximoSequencial(scope.parcelaNova.sequencial);
            } else {
                limparDadosParcelaRemanescente();
            }
        }

        function marcarBenfeitoriasSemUtilizacao(benfeitorias) {
            for (var i = 0; i < benfeitorias.length; i++) {
                if (benfeitorias[i].selecionado === true) {
                    scope.parcelaRemanescente.benfeitorias[i].selecionado = false;
                } else {
                    scope.parcelaRemanescente.benfeitorias[i].selecionado = true;
                }
            }
        }

        function limparDadosParcelaRemanescente() {
            scope.parcelaRemanescente = {
                    benfeitorias: [],
                    arquivos: [],
                    checkboxAll: false
                   };
        }

        function uploadArquivos(arquivo) {
            arquivoService.uploadComShapeFile(arquivo).then(function (resposta) {
            arquivo.id = resposta.data.resultado.id;
            scope.parcelaNova.arquivos.push(arquivo);
            var contentType = resposta.data.resultado.contentType;
            if (contentType === CONTENT_TYPE_ZIP || contentType === CONTENT_TYPE_OCTET) {
                scope.parcelaNova.memorialDescritivo = resposta.data.resultado.coordenadas;
                scope.desabilitarMemorialDescritivo = true;
            }
            }, function (error) {
                var mensagem = error.data.erros;
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
            });
        }

        function adicionarArquivos($files) {

            if ($files === null) {
                return;
            }

            var quantidadeShapeFile = 0;
            var indexPrimeiroShapeFile = 0;

            if (scope.parcelaNova.arquivos.length !== 0 
                                && angular.isDefined($files) 
                                && arquivoService.validarShapeFile($files[0])) {
                    angular.forEach(scope.parcelaNova.arquivos, function (arquivo, index) {
                        if(arquivoService.validarShapeFile(arquivo)){
                            indexPrimeiroShapeFile = index;
                            quantidadeShapeFile++;
                        }
                    });
                }

            if (quantidadeShapeFile !== 0) {
                var mensagem =('msg-confirma-sobrepor-shapefile');
                mensagemDestinacaoService.confirmarEditandoBotoes($filter('translate')(mensagem), function () {
                    scope.parcelaNova.arquivos.splice(indexPrimeiroShapeFile, 1);
                    uploadArquivos($files[0]);
                });
            } else {
                angular.forEach($files, function (arquivo) {
                    arquivoService.validarFormatoArquivoMemorialDescritivo(arquivo);
                    uploadArquivos(arquivo);
                });
            }
        }

        function removerArquivo(index) {

            mensagemDestinacaoService.confirmar($filter('translate')('msg-remover-arquivo'), function () {
                var arquivo = scope.parcelaNova.arquivos[index];

                if (arquivoService.validarShapeFile(arquivo)) {
                    scope.parcelaNova.memorialDescritivo = undefined;
                    scope.desabilitarMemorialDescritivo = false;
                }
                var arquivoRemover = scope.parcelaNova.arquivos[index];
                scope.parcelaNova.arquivosExcluir.push(arquivoRemover);
                scope.parcelaNova.arquivos.splice(index, 1);

            });
            
        }

        function marcarDesmarcarBenfeitoriasParcelaRemanescente(benfeitoria) {
            var benfeitorias = scope.parcelaNova.benfeitorias;
            var index = benfeitorias.findIndex(function (element) {
                return element.id === benfeitoria.id;
            });

            if (index !== -1 && scope.parcelaRemanescente.benfeitorias.length > index) {
                scope.parcelaRemanescente.benfeitorias[index].selecionado = !benfeitoria.selecionado;
            }
            
        }

      }
    };
  }

})();