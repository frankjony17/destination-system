
(function () {

    angular
        .module('su-destinacao')
        .directive('dadosDocumentos', directive);

    function directive (mensagemDestinacaoService, $filter, arquivoService, $window) {
        return {
            restrict: 'EA',
            scope:{
                listaDocumentos: '=',
                detalhar:'@',
                cancelamento:'=?',
                isSuperintendente:'=?',
                encerramento: '=?'
            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosDocumentos/templates/dadosDocumentos.html',
            link: function ($scope) {

                var vm = $scope;

                vm.documento = {};
                vm.paginacaoDocumentos = [];
                vm.descricao = null;

                var MEDIA_TYPE_PDF = 'application/pdf';
                var MEDIA_TYPE_JPEG = 'image/jpeg';
                var MEDIA_TYPE_JPG = 'image/jpg';
                var MEDIA_TYPE_PNG = 'image/png';

                var count = 0;

                var init = function() {

                    vm.registroInicial = 1;
                    vm.tamanhoLimite = 5;
                    vm.totalItems = 0;
                    gerarUrlArquivos(vm.listaDocumentos);
                    vm.paginarListagem();
                };

                vm.adicionarDocumento = function(file) {
                    if(file && file[0] && (file[0].type == MEDIA_TYPE_PDF || file[0].type == MEDIA_TYPE_JPEG || file[0].type == MEDIA_TYPE_JPG
                        || file[0].type == MEDIA_TYPE_PNG)) {
                        arquivoService.uploadDocumento(file[0], function(arquivo) {
                            vm.documento = arquivo.data.resultado;
                            vm.documento.name = file[0].name;
                            vm.documento.nomeReal = file[0].name;
                            vm.documento.descricao = vm.descricao;
                        });
                    }else if(file !== null){
                        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-formatos-nao-permitidos'));
                    }
                };

                vm.adicionarListaDocumentos = function() {
                    if (!vm.documento || !vm.documento.name || !vm.descricao) {
                        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-campos-obrigatorios'));
                        return;
                    }
                    if (!vm.listaDocumentos) {
                        vm.listaDocumentos = [];
                    }
                    vm.documento.descricao = vm.descricao;
                    vm.documento.contador = count;
                    gerarUrlArquivo(vm.documento);
                    vm.listaDocumentos.push(vm.documento);

                    vm.paginarListagem();
                    vm.documento = {};
                    vm.descricao = null;
                    count++;
                };

                vm.removerDocumento = function(contador, idArquivo) {
                    mensagemDestinacaoService.confirmar($filter('translate')('msg-deseja-realmente-excluir-arquivo'),
                        function() {
                        arquivoService.removerArquivo(idArquivo).then(function() {
                            var listaTemporaria = [];
                            angular.forEach(vm.listaDocumentos, function(doc) {
                                if (doc.contador !== contador) {
                                    listaTemporaria.push(doc);
                                }
                            });
                            vm.listaDocumentos = listaTemporaria;
                            vm.paginarListagem();
                        });
                    }, function() {
                        return;
                    });
                };

                vm.$watch('listaDocumentos', function () {
                    vm.paginarListagem();
                });

                vm.baixarImagem = function(idArquivo) {
                    return arquivoService.baixarArquivo(idArquivo);
                };

                vm.paginarListagem = function() {
                    if (vm.listaDocumentos) {
                        vm.totalItems = vm.listaDocumentos.length;

                        vm.paginacaoDocumentos = [];
                        vm.totalItems = vm.listaDocumentos.length;
                        if (vm.totalItems < vm.tamanhoLimite) {
                            vm.paginacaoDocumentos = vm.listaDocumentos;
                        } else {
                            for (var i = ((vm.registroInicial - 1) * vm.tamanhoLimite); i < vm.totalItems; i++) {
                                vm.paginacaoDocumentos.push(vm.listaDocumentos[i]);
                                if (vm.paginacaoDocumentos.length == vm.tamanhoLimite) {
                                    break;
                                }
                            }
                        }
                    }
                };
                vm.isDetalhar = function () {
                    return vm.detalhar === 'true' || vm.isSuperintendente === true;
                };

                function gerarUrlArquivos (arquivos) {
                    angular.forEach(arquivos, function (arquivo) {
                        gerarUrlArquivo(arquivo);
                    });
                }

                function gerarUrlArquivo (arquivo) {
                    if (arquivo.imagem) {
                        var url = $window.URL || $window.webkitURL;
                        var blob = new Blob([base64ToArrayBuffer(arquivo.imagem)], {type: 'application/octet-stream'});
                        arquivo.url = url.createObjectURL(blob);
                    }
                }

                function base64ToArrayBuffer (base64) {
                    var binaryString = $window.atob(base64);
                    var binaryLen = binaryString.length;
                    var bytes = new Uint8Array(binaryLen);
                    for (var i = 0; i < binaryLen; i++) {
                        var ascii = binaryString.charCodeAt(i);
                        bytes[i] = ascii;
                    }
                    return bytes;
                }

                init();
            }
        };
    }


})();
