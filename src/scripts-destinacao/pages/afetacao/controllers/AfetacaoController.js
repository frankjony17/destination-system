(function(){
  "use strict";
  angular.module("su-destinacao").controller("AfetacaoController", AfetacaoController);

  function AfetacaoController($rootScope,mensagemDestinacaoService,
                            $q, validadorDestinacaoService,
                            destinacaoServiceUtil,
                            destinacaoEscopoCompartilhadoService,
                            $filter,
                            destinacaoService,
                            $state, dominioService, afetacaoService, tipoUtilizacaoService, subTipoUtilizacaoService, arquivoService) {
    var vm = this;

    vm.afetacao = {
        isImovel: true,
        documento: {},
        documentos:[],
        imoveis:[]
    };

    vm.tabelaDocumentos = {
      limit: 5,
      limitsPage: [5, 10, 15],
      page: 1
    };

    vm.salvar = salvar;
    vm.fechar = fechar;
    vm.verPublicacao = verPublicacao;
    vm.buscarEspecificacoes = buscarEspecificacoes;
    vm.addArquivo = addArquivo;
    vm.gerarPreview = gerarPreview;
    vm.incluirArquivo = incluirArquivo;
    vm.removerArquivo = removerArquivo;

    function init() {
        if(destinacaoEscopoCompartilhadoService.getObjeto('afetacao')){
            vm.afetacao = destinacaoEscopoCompartilhadoService.getObjeto('afetacao');
            destinacaoEscopoCompartilhadoService.limparEscopo();
        }
        buscarTipoAfetacao();
        buscarTipoAcao();
        buscarTipoAto();
        buscarTipoUso();
    }

    init();

    function buscarTipoUso() {
        tipoUtilizacaoService.buscarTodosTiposUtilizacaoAfetacao().then(function (retorno) {
            vm.tiposUso = retorno.data.resultado;
        })
    }

    function buscarEspecificacoes() {
        subTipoUtilizacaoService.buscarTodosSubtiposUtilizacaoAfetacao(vm.afetacao.tipoDeUso).then(function (retorno) {
            vm.listaEspecificacoes = retorno.data.resultado;
        })
    }

    function buscarTipoAfetacao() {
        dominioService.buscaTodosTipoAfetacao().then(function (resultado) {
            vm.listaTipoDeAfetacao = resultado.data.resultado;
        })
    }

    function buscarTipoAcao() {
        dominioService.buscaTodosTipoAcao().then(function (resultado) {
            vm.listaTipoAcao = resultado.data.resultado;
        })
    }

      function buscarTipoAto() {
          dominioService.buscaTodosTipoAto().then(function (resultado) {
              vm.listaTipoAto = resultado.data.resultado;
          })
      }
      function salvar() {
          if (vm.formAfetacao.$invalid) {
              mensagemDestinacaoService.mostrarCamposInvalidos(vm.formAfetacao);
              return;
          }else {
              afetacaoService.salvarAfetacao(vm.afetacao).then(function() {
                  mensagemDestinacaoService.mostrarMensagemSucesso("Dados gravados com sucesso");
                  $state.go('destinacao.consultarDestinacao');
              });
          }
    }

      function addArquivo($files) {
          if(angular.isDefined($files) && $files !== null) {
              arquivoService.validarFormatoDocumento($files[0].type);
              arquivoService.validarTamanho5MB($files[0].size);
              vm.afetacao.documento.arquivo = $files[0];
          }
      }

      function gerarPreview (arq) {
          arquivoService.gerarPreview(arq);
      }


      function fechar() {
        $state.go('destinacao.consultarDestinacao')
    }

      function incluirArquivo() {
          if (angular.isDefined(vm.afetacao.documento.descricao) && angular.isDefined(vm.afetacao.documento.arquivo) && angular.isDefined(vm.afetacao.documento.dataDoDocumento)) {
              arquivoService.uploadNovo(vm.afetacao.documento.arquivo, vm.afetacao.documento.descricao, vm.afetacao.documento.dataDoDocumento).then(function (resposta) {
                  vm.afetacao.documentos.push(resposta.data.resultado);
                  vm.afetacao.documento = {};
              });
          }
          else {
              mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-campos-obrigatorios'));
          }
      }

      function removerArquivo(arquivo) {
          var mensagem = $filter("translate")('msg-confirma-exclusao-documento');
          mensagemDestinacaoService.confirmar(mensagem, function () {
              var indice = indexDocumento(arquivo);
              if(angular.isDefined(arquivo)) {
                  arquivoService.removerArquivo(vm.afetacao.documentos[indice].id);
              }
              vm.afetacao.documentos.splice(indice, 1);
          });
      }

      function indexDocumento(arquivo) {
          return vm.afetacao.documentos.findIndex(function (element) {
              return JSON.stringify(element) === JSON.stringify(arquivo);
          });
      }

    function verPublicacao() {
       var data =  $filter('date')(vm.afetacao.dataPublicacao, 'dd/MM/yyyy');
        var link = "http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal="+vm.afetacao.secao + "&pagina="+vm.afetacao.pagina + "&data="+ data;
        window.open(link, '_blank');
    }
  }
})();
