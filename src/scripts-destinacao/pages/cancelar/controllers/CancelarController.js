(function () {
    "use strict";
    angular.module("su-destinacao").controller("CancelarController", CancelarController);

    function CancelarController($rootScope,
                                motivoCancelamentoService,
                                destinacaoEscopoCompartilhadoService,
                                mensagemDestinacaoService,
                                $filter,
                                arquivoService) {
        var vm = this;

        vm.responsavelTecnico = $rootScope.usuarioLogado.cpf + ' - ' + $rootScope.usuarioLogado.nome;
        vm.motivosCancelamento = [];

        vm.cancelar = {
            arquivos: [],
            dataCancelamento: undefined,
            motivoCancelamento: undefined,
            observacao: undefined
        };

        vm.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        vm.arquivo = {
          id: undefined,
          nome: undefined,
          documento: undefined
        };

        vm.removerArquivo = removerArquivo;
        vm.gerarPreview = gerarPreview;
        vm.addArquivo = addArquivo;
        vm.incluirArquivo = incluirArquivo;
        vm.baixarArquivo = baixarArquivo;

        function init() {''
            motivoCancelamentoService.buscarTodos().then(function (resposta) {
                vm.motivosCancelamento = resposta.data.resultado.filter(function (element) {
                    if(tipoPosseInformal()){
                        return element.id === 1 || element.id === 8 || element.id === 9;
                    }
                    else{
                        return element.id !== 8 && element.id !==9;
                    }
                });
            });
        }

        init();

        function tipoPosseInformal () {
            return vm.destinacao.tipoDestinacaoEnum === 'POSSE_INFORMAL';
        }

        function removerArquivo(arquivo) {
          var mensagem = $filter("translate")('msg-confirma-exclusao');
          mensagemDestinacaoService.confirmar(mensagem, function () {
            var indice = indexDocumento(arquivo);
            if(angular.isDefined(arquivo)) {
              arquivoService.removerArquivo(vm.cancelar.arquivos[indice].documento.id);
            }
            vm.cancelar.arquivos.splice(indice, 1);
          });
        }

        function indexDocumento(arquivo) {
          return vm.cancelar.arquivos.findIndex(function (element) {
            return JSON.stringify(element) === JSON.stringify(arquivo);
          });
        }

        function gerarPreview (arq) {
            arquivoService.gerarPreview(arq);
        }

        function baixarArquivo(arq) {
          return arquivoService.baixarArquivo(arq);
        }

        function addArquivo($files) {
          if(angular.isDefined($files)){
            arquivoService.validarFormatoArquivoFotoPDF($files[0].type);
            arquivoService.validarTamanhoArquivo($files[0].size);
            vm.arquivo.documento = $files[0];
          }
        }

        function incluirArquivo(){
            if(vm.formDocumentos.$invalid){
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formDocumentos);
                return;
            }
            else{
                if(angular.isDefined(vm.arquivo.documento)){
                    vm.arquivo.exibirPreview = false;
                    arquivoService.uploadNovo(vm.arquivo.documento,
                        vm.arquivo.descricao,
                        vm.arquivo.data).then(function (resposta) {
                        if(resposta.data.resultado.extensao === '.pdf'){
                            vm.arquivo.exibirPreview = true;
                        }
                        vm.arquivo.documento = resposta.data.resultado;
                        vm.arquivo.id = resposta.data.resultado.id;
                        vm.cancelar.arquivos.push(angular.copy(vm.arquivo));
                        vm.arquivo.nome = undefined;
                        vm.arquivo.documento = undefined;
                    });
                }
            }
        }
    }
})();
