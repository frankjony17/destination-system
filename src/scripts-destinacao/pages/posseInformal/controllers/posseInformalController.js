(function(){
  "use strict";
  angular.module("su-destinacao").controller("PosseInformalController", posseInformalController);

  function posseInformalController(destinacaoService,
                                   $state,
                                   mensagemDestinacaoService,
                                   destinacaoEscopoCompartilhadoService,
                                   $filter,
                                   destinacaoServiceUtil,
                                   $q,
                                   procurarDadosImovelService) {

    var TIPO_DESTINACAO = 'POSSE_INFORMAL';

    var vm = this;

    vm.salvar = salvar;
    vm.fechar = fechar;
      vm.botaoEditar = botaoEditar;
      vm.cancelar = cancelar;

    vm.PERMISSOES = '';
    vm.permissaoConcedida = true;
      vm.carregarDadosUtilizacao = false;

    vm.posseInformal = {
      imovel: {},
      utilizacao: {},
      destinacaoImoveis: [],
      tipoDestinacaoEnum: TIPO_DESTINACAO,
      destinacoes: [],
      documentosArquivo: [],
      responsaveis: [],
      fotos: [],
      ocupantes: [],
      tipoPosse: {},
      recarregarDadosEscopo: false,
        editar: false,
        detalhar: false
    };
    var objetoOriginal = {};
    vm.nomeState = 'destinacao.posseInformal';

    function init() {
      var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('destinacao'));

        if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERPOSSEINFORMAL'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_POSSE_INFORMAL';
        }

        objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));
        destinacaoEscopoCompartilhadoService.limparEscopo();

        destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

        $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, undefined)]).then(function (retorno) {
            if (angular.isDefined(retorno[0])) {
                vm.posseInformal = retorno[0].destinacao;
                if(angular.isUndefined(vm.posseInformal.cnpj) || vm.posseInformal.cnpj === ''){
                    vm.posseInformal.semCnpj = true;
                }
                procurarDadosImovelService.prepararDadosDestinacao(vm.posseInformal);
                angular.forEach(vm.posseInformal.fotos, function (foto) {
                    foto.documento = undefined;
                    foto.arquivo.documento = {};
                    foto.arquivo.documento.id = foto.arquivo.id;
                    foto.arquivo.documento.nomeReal = foto.arquivo.nomeReal;
                });

                angular.forEach(vm.posseInformal.documentosArquivo, function (documentoArquivo) {
                    documentoArquivo.documento = undefined;
                    documentoArquivo.arquivo.documento = {};
                    documentoArquivo.arquivo.documento.id = documentoArquivo.arquivo.id;
                    documentoArquivo.arquivo.documento.nomeReal = documentoArquivo.arquivo.nomeReal;
                });

                angular.forEach(vm.posseInformal.documentosArquivo, function (documento, index) {
                    if(documento.arquivo.contentType = 'application/pdf'){
                        vm.posseInformal.documentosArquivo[index].arquivo.exibirPreview = true;
                    }
                });

                angular.forEach(vm.posseInformal.destinacaoImoveis, function (destinacao, index) {
                    vm.posseInformal.destinacaoImoveis[index].imovel.enderecoCorreto = vm.posseInformal.enderecoCorreto;
                    vm.posseInformal.destinacaoImoveis[index].imovel.numeroProcesso = vm.posseInformal.numeroProcesso;
                    vm.posseInformal.destinacaoImoveis[index].imovel.tipoDestinacao = vm.posseInformal.tipoDestinacao;
                    vm.posseInformal.destinacaoImoveis[index].imovel.responsavelCorreto = vm.posseInformal.responsavelCorreto;
                    vm.posseInformal.destinacaoImoveis[index].imovel.usoOficial = vm.posseInformal.usoOficial;
                });
                vm.imagens = retorno[0].imagens;
                vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.posseInformal, objetoOriginal);
            }
            else {
                vm.carregarDadosUtilizacao = true;
            }
        });
    }

    init();

      function fechar () {
          var mensagem;
          if(!vm.posseInformal.detalhar){
              if (vm.posseInformal.editar) {
                  mensagem = $filter('translate')('msg-mensagem-fechar-editar');
              } else {
                  mensagem = $filter('translate')('msg-mensagem-fechar');
              }

              mensagemDestinacaoService.confirmar(mensagem, function () {
                  $state.go('destinacao.consultarDestinacao');
              });
          }else {
              $state.go('destinacao.consultarDestinacao')
          }
      }

    function salvar() {
      if (vm.form.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        return;
      }
      verificarOcupante();
        angular.forEach(vm.posseInformal.fotos, function (foto, $index) {
            vm.posseInformal.fotos[$index].idArquivo = vm.posseInformal.fotos[$index].arquivo.id;
            vm.posseInformal.fotos[$index].arquivo = vm.posseInformal.fotos[$index].arquivo.documento;
            vm.posseInformal.fotos[$index].arquivo.imagem = undefined;
            vm.posseInformal.fotos[$index].arquivo.documento = {};
            vm.posseInformal.fotos[$index].arquivo.documento.id = vm.posseInformal.fotos[$index].arquivo.id;
        });
      if(vm.posseInformal.destinacaoImoveis.length !== 0){
        vm.posseInformal.imovel= vm.posseInformal.destinacaoImoveis[0].imovel;
        vm.posseInformal.destinacaoImoveis[0].parcelas = vm.posseInformal.imovel.parcelas;
      }

      destinacaoService.salvarPosseInformal(vm.posseInformal).then(function (resposta) {

        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
        $state.go('destinacao.consultarDestinacao');
      }, function (erro) {
        if (erro.data.erros) {
          mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
        }
      });
    }

    function verificarOcupante(){
      if(vm.posseInformal.dadosResponsavel.tipoPosseOcupacao.id !== 4 && vm.posseInformal.dadosResponsavel.length === 0){
        var mensagem = $filter('translate')('msg-incluir-ocupante');
        mensagemDestinacaoService.mostrarMensagemError(mensagem);
        throw mensagem;
      }
    }

      function botaoEditar() {
          vm.posseInformal.detalhar = false;
          vm.posseInformal.editar = true;
      }

      function cancelar () {
          vm.posseInformal.cancelar = true;
          destinacaoEscopoCompartilhadoService.setDestinacao(vm.posseInformal, 'destinacao.posseInformal');
          $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
      }

  }

})();
