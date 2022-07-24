(function () {

    angular.module('su-destinacao')
        .directive('documentoRequerimento',directive);

    function directive (comumDestinacaoService, 
                        arquivoService, 
                        $filter, 
                        $http, 
                        $mdDialog, 
                        documentoService, 
                        mensagemDestinacaoService, 
                        $document) {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                idServico: '=',
                documento: '=documento',
                requerimento: '=requerimento',
                naoRemoverAntigos: '=',
                requerimentoConsultarDominialidade: '=',
                bloquearCampos: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/DetalharRequerimentoAdesaoPraias/diretivasFormularios/dadosDocumentosRequerimento/dadosDocumentoRequerimento.html',
            //controller: controllerFunction, //Embed a custom controller in the directive
            link: function ($scope) {

                var vm = $scope;
                vm.documentoService = documentoService;

                vm.bloquearCampos = ($scope.bloquearCampos === true);

                vm.documentos = $filter('translate')('label-documentos');

                var NAO_POSSUO = 'NAO_POSSUO';
                var POSSO_CONSEGUIR = 'POSSO_CONSEGUIR';
                var POSSUO = 'POSSUO';

                var init = function () {
                    buscarTipoSolicitante();
                    vm.obrigatorio = true;
                };


                var buscarTipoSolicitante = function(){
                    comumDestinacaoService.listarTipoSolicitante(vm.idServico).then(function(resp){
                        vm.listaTipoSolicitante = resp.data.resposta;

                    });
                };


                vm.$watch('requerimento.requerente.tipoSolicitante.id', function (newValue) {
                   if (newValue && $scope.idServico) {
                       comumDestinacaoService.pesquisarDocumentos(vm.idServico, newValue).then(function (resultado) {
                           vm.documento.documentosObrigatorios = [];
                           vm.documento.documentosComplementares = [];

                           angular.forEach(resultado.data.resposta, function (documento) {
                               if (documento.tipo == 'OBRIGATORIO') {
                                   vm.documento.documentosObrigatorios.push(documento);
                               } else if (documento.tipo == 'COMPLEMENTAR') {
                                   vm.documento.documentosComplementares.push(documento);
                               }
                           });
                           getDocumentosSalvos();
                   });
                   }
                });

                vm.addDocumentos = function ($files, documento, validarExtencao) {
                    angular.forEach($files, function (file) {
                        arquivoService.addArquivo(file, documento, validarExtencao);
                    });

                };

                vm.open = function(documento){
                   comumDestinacaoService.visualizarArquivo(documento);
                };

                var getDocumentosSalvos = function () {
                   if (vm.requerimento.id) {
                        $http.get('api/public/arquivo-requerimento/requerimento/' + vm.requerimento.id).then(function (response) {
                            var arquivos = response.data.resposta;
                            getOutrosDocumentosSalvos(arquivos);
                            carregarDocumentos(arquivos, vm.documento.documentosObrigatorios);
                            carregarDocumentos(arquivos, vm.documento.documentosComplementares);
                        });
                    }
                };

                var getOutrosDocumentosSalvos = function(arquivos) {
                    if (vm.requerimento.id) {
                        $http.get('api/public/arquivo-requerimento/outrosDocumentos/requerimento/' + vm.requerimento.id).then(function (response) {
                            var documentos = response.data.resposta;
                            if (documentos && documentos.length > 0) {
                                vm.documento.outrosDocumentos = _.uniqBy(documentos, 'id');
                                carregarDocumentos(arquivos, vm.documento.outrosDocumentos);
                            }
                        });
                    }
                };

                var carregarDocumentos = function(arquivos, documentos) {
                    angular.forEach(documentos, function (documento) {
                        if(arquivos) {
                            documento.files = [];
                            angular.forEach(arquivos, function (arquivo) {
                                if (arquivo.idDocumento == documento.id) {
                                    documento.situacaoDocumentoComplementar = arquivo.situacaoDocumentoComplementar;
                                    if (arquivo.situacaoDocumentoComplementar == NAO_POSSUO
                                          || arquivo.situacaoDocumentoComplementar == POSSO_CONSEGUIR) {
                                      documento.idRequerimentoArquivo = arquivo.id;
                                    } else {
                                      /**
                                       * Na edição do requerimento, os documentos adicionados na edição poderão ser removidos
                                       */
                                      documento.files.push({id: arquivo.id, idArquivo: arquivo.idArquivo, name: arquivo.name, naoRemover : true});
                                  }
                                }
                            });
                        }
                    });
                };

                var getIdRequerimentoArquivo = function (files) {
                  if (files && files.length > 0) {
                    if(files[0].idArquivo)
                      return files[0].id;
                  }
                  return undefined;
                };

                vm.removerDocComplSituacao = function (documento) {
                  if (documento.situacaoDocumentoComplementar != POSSUO && documento.files) {
                    if (documento.files && documento.files.length > 0) {
                      documento.filesTmp = angular.copy(documento.files);
                      documento.idRequerimentoArquivo = getIdRequerimentoArquivo(documento.filesTmp);
                      documento.arquivosRequerimentoExcluir = angular.copy(documento.files);
                      documento.files = [];
                    }
                  } else {
                    documento.files = documento.filesTmp ? angular.copy(documento.filesTmp) : [];
                    if (documento.idRequerimentoArquivo) {
                      documento.arquivosRequerimentoExcluir = [{id: angular.copy(documento.idRequerimentoArquivo)}];
                      documento.idRequerimentoArquivo = undefined;
                    }

                  }
                };

                vm.download = function (id) {
                    return arquivoService.download(id);
                };

                var apagarOutrosDocumentos = function (index, documento, apagarTodosArquivos) {
                    if (documento.id) {
                        vm.documentoService.apagar(documento.id).then(function () {
                            apagarTodosArquivos(documento);
                            vm.documento.outrosDocumentos.splice(index, 1);
                        });
                    } else {
                        vm.documento.outrosDocumentos.splice(index, 1);
                    }
                };

                var apagarTodosArquivos = function (documento) {
                    angular.forEach(documento.files, function (elem) {
                        arquivoService.apagar(elem.id);
                    });
                };

                vm.removerOutrosDocumentos = function ($event, index, documento) {
                    mensagemDestinacaoService.modalConfirmacao(event,
                        $filter('translate')('label-alerta'),
                        $filter('translate')('mensagem-conf-exclusao-outro-documento', {parametro: documento.nome}), function () {
                            apagarOutrosDocumentos(index, documento, apagarTodosArquivos);
                        }, function () {
                            $mdDialog.cancel();
                        });
                };

                vm.abrirListaDocumentos = function ($event, documento) {

                    $mdDialog.show({
                        controller: function ($scope) {

                            $scope.documento = documento;
                            $scope.naoRemoverAntigos = vm.naoRemoverAntigos;

                            $scope.baixar = function (file) {
                              if (file.idArquivo)
                                return arquivoService.download(file.idArquivo);
                              else
                                return arquivoService.download(file.id);
                            };

                            $scope.fechar = function () {
                                $mdDialog.cancel();
                            };

                            $scope.removerArquivo = function (event, documento, arquivo) {
                                mensagemDestinacaoService.modalConfirmacao(event,
                                    $filter('translate')('label-alerta'),
                                    $filter('translate')('mensagem-confirmar-exclusao'), function () {

                                        var index = documento.files.findIndex(function (elem) {
                                            return arquivo.name == elem.name
                                        });
                                        var arquivoTmp = documento.files[index];
                                        arquivoService.apagar(arquivoTmp.id).then(function () {
                                            documento.files.splice(index, 1);
                                            vm.abrirListaDocumentos(event, $scope.documento);
                                        }, function (erro) {
                                            mensagemDestinacaoService.exibirErro(erro.data.mensagem);
                                            vm.abrirListaDocumentos(event, $scope.documento);
                                        });

                                    }, function () {
                                        $mdDialog.cancel();
                                        vm.abrirListaDocumentos(event, $scope.documento);
                                    });
                            };
                        },
                        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/diretivasFormularios/dadosDocumentosRequerimento/modal/modalDocumentos.html',
                        parent: angular.element($document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false
                    });

                };

                vm.adicionarOutrosDocumentos = function ($event, documentoAnterior) {

                    $mdDialog.show({
                        controller: function ($scope) {

                            $scope.documento = documentoAnterior;


                            var init = function ()  {
                                if (!documentoAnterior) {
                                    $scope.documento = {tipo: 'OUTROS', status: true};
                                }

                            };

                            $scope.baixar = function (id) {
                                return arquivoService.download(id);
                            };

                            $scope.fechar = function () {
                                $mdDialog.cancel();

                                angular.forEach($scope.documento.files, function (elem) {
                                    arquivoService.apagar(elem.id);
                                });

                            };

                            $scope.addDocumentos = function ($files, documento, validarExtencao) {
                                angular.forEach($files, function (file) {
                                    arquivoService.addArquivo(file, documento, validarExtencao);
                                });
                            };

                            $scope.salvar = function () {
                                if (!$scope.documento.nome || $scope.documento.nome == '') {
                                  mensagemDestinacaoService.mostrarMensagemInfoError(mensagemDestinacaoService.getMensagemFilter('mensagem-nome-documento'), 'html');
                                    return;
                                }
                                documentoService.salvar($scope.documento).then(function (response) {
                                    angular.extend($scope.documento, response.data.resposta[0]);
                                    $mdDialog.hide($scope.documento);
                                });
                            };

                            var confirmacaoExclusaoDocumeto = function (event, documento) {

                                if (documento.files == 0) {
                                    mensagemDestinacaoService.modalConfirmacao(event,
                                        $filter('translate')('label-alerta'),
                                        $filter('translate')('mensagem-conf-exc-outro-documento', {parametro: documento.nome}), function () {

                                        var index = vm.documento.outrosDocumentos.findIndex(function (elem) {
                                            return documento.nome == elem.nome;
                                        });
                                        if (documento && documento.id) {
                                            vm.documentoService.apagar(documento.id).then(function () {                                                    vm.documento.outrosDocumentos(index, 1);
                                                $mdDialog.cancel();
                                            }, function (erro) {
                                                mensagemDestinacaoService.exibirErro(erro.data.mensagem);
                                            });
                                        } else {
                                            vm.documento.outrosDocumentos.splice(index, 1);
                                            $mdDialog.cancel();
                                        }

                                    }, function () {
                                        $mdDialog.cancel();
                                        vm.adicionarOutrosDocumentos(event, documento);
                                    });
                                } else {
                                    vm.adicionarOutrosDocumentos(event, documento);
                                }

                            };

                            $scope.removerArquivo = function (event, documento, index) {

                                mensagemDestinacaoService.modalConfirmacao(event,
                                    $filter('translate')('label-alerta'),
                                    $filter('translate')('mensagem-confirmar-exclusao'), function () {
                                        var arquivo = documento.files[index];
                                        arquivoService.apagar(arquivo.id).then(function () {
                                            documento.files.splice(index, 1);
                                            confirmacaoExclusaoDocumeto(event, documento);
                                        }, function (erro) {
                                            mensagemDestinacaoService.exibirErro(erro.data.mensagem);
                                        });

                                    }, function () {
                                        vm.adicionarOutrosDocumentos(event, documento);
                                    });

                            };

                            init();
                        },
                        templateUrl: 'scripts-destinacao/app/directives/analiseTecnica/diretivasFormularios/dadosDocumentosRequerimento/modal/modalOutrosDocumentos.html',
                        parent: angular.element($document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false
                    }).then(function(documento){
                        if (documento) {
                            var index = $scope.documento.outrosDocumentos.findIndex(function (elem) {
                                return elem.nome == documento.nome;
                            });

                            if (index > 0) {
                                $scope.documento.outrosDocumentos[index] = documento;
                            } else {
                                $scope.documento.outrosDocumentos.push(documento);
                            }
                        }
                    });

                };

                init();

            }
        };
    }

})();
