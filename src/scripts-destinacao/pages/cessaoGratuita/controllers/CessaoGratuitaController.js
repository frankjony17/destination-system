(function() {
  "use strict";
  angular.module("su-destinacao").controller("CessaoGratuitaController", CessaoGratuitaController);

  function CessaoGratuitaController($rootScope,
                                    mensagemDestinacaoService,
                                    $filter,
                                    destinacaoService,
                                    $state,
                                    destinacaoEscopoCompartilhadoService,
                                    validadorDestinacaoService,
                                    destinacaoServiceUtil, $q) {
    var vm = this;

    var TIPO_DESTINACAO = 'CESSAO_GRATUITA';

    vm.bloqueiaDadosUtilizacao = false;
    vm.exibirMinuta = false;
    vm.dataMinuta = new Date();
    vm.responsavelMinuta = undefined;
    vm.avancar = avancar;
    vm.voltar = voltar;
    vm.gravar = gravar;
    vm.fechar = fechar;
    vm.cancelar = cancelar;
    vm.rascunho = false;
    vm.botaoEditar = botaoEditar;
    vm.salvarRascunho = salvarRascunho;
    vm.carregarDadosUtilizacao = false;
    vm.init = init;

    vm.existeFotoVideo = existeFotoVideo;
    vm.converterListaArquivoImagem = converterListaArquivoImagem;

    vm.atendimento = {};
    vm.imagens = [];

    vm.PERMISSOES = '';
    vm.permissaoConcedida = true;

    vm.cessaoGratuita = {
        cancelamentoEncerramento:{},
        contrato:{},
        responsavel: {},
        utilizacao: {},
        dadosResponsavel: {},
        destinacaoImoveis: [],
        tipoDestinacaoEnum: TIPO_DESTINACAO,
        finalidade: '',
        encargos:[],
        documentos: [],
        recarregarDadosEscopo: false
    };
    vm.objetoOriginal = {};
      vm.nomeState = 'destinacao.cessaoGratuita';


      function init() {
        var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
        if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERCESSAOGRATUITA'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_CESSAO_GRATUITA';
        }

        var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
        var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
        var objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));

        destinacaoEscopoCompartilhadoService.limparEscopo();
        destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.cessaoGratuita');

        destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

        $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
                destinacaoServiceUtil.tabRetorno(indiceRetorno)])
        .then(function (retorno) {
            if (angular.isDefined(retorno[0])) {
                vm.cessaoGratuita = retorno[0].destinacao;
                vm.imagens = retorno[0].imagens;
                vm.atendimento = retorno[0].atendimento;
                vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                vm.objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.cessaoGratuita, objetoOriginal);
            } else {
              vm.carregarDadosUtilizacao = true;
            }

            if (angular.isDefined(retorno[1])) {
                vm.bloqueiaDadosUtilizacao = retorno[1].bloqueiaDadosUtilizacao;
                vm.indiceTabs = retorno[1].indiceTabs;
            }
        });
    }

    init();

    function salvarRascunho() {

        if(!vm.bloqueiaDadosUtilizacao){
            if (vm.formUtilizacao.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
                return;
            }
            vm.cessaoGratuita.statusDestinacao = {id:4, descricao:'Rascunho'};
        }

        destinacaoService.validarExisteDestinacaoImovel(vm.cessaoGratuita);

        vm.cessaoGratuita.numeroAtendimento = vm.atendimento.numeroAtendimento;
        vm.cessaoGratuita.numeroProcesso = vm.atendimento.numeroProcedimento;
        vm.salvarRascunho = true;

        salvar();

    }

    function gravar() {
      if(!vm.bloqueiaDadosUtilizacao){
        if (vm.formUtilizacao.$invalid) {
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
          return;
        }
        vm.cessaoGratuita.statusDestinacao = {id:4, descricao:'Rascunho'};
      } else{
        if(vm.formContrato.$invalid){
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
          return;
        }
        vm.cessaoGratuita.statusDestinacao = {id:1, descricao:'Ativo'};
      }

      validadorDestinacaoService.verificarExisteAditivo(vm.objetoOriginal, vm.cessaoGratuita);

      vm.cessaoGratuita.numeroAtendimento = vm.atendimento.numeroAtendimento;
      vm.cessaoGratuita.numeroProcesso = vm.atendimento.numeroProcedimento
      vm.rascunho = false;

        //setando o id do fundamento legal
        vm.cessaoGratuita.codFundamentoLegal = vm.cessaoGratuita.codFundamentoLegal.id;
        salvar();

    }

    function salvar () {

      destinacaoService.salvarCessaoGratuita(vm.cessaoGratuita).then(function (resposta) {
        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);

        vm.cessaoGratuita = destinacaoService.prepararDadosParaUpdate(vm.cessaoGratuita, resposta);
        if (vm.rascunho === false) {
          $state.go('destinacao.consultarDestinacao');
        }

      }, function (erro) {
        if (erro.data.erros) {
          mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
        }
      });

    }


    function fechar () {
      destinacaoService.fechar(vm.bloquear, vm.cessaoGratuita);
    }

    function avancar() {

        var resposta = destinacaoService.avancar(vm.formUtilizacao,
                                                    vm.cessaoGratuita,
                                                    vm.atendimento,
                                                    vm.bloqueiaDadosUtilizacao,
                                                    vm.indiceTabs);
        vm.indiceTabs = resposta.indiceTabs;
        vm.bloqueiaDadosUtilizacao = resposta.bloqueiaDadosUtilizacao;

    }

    function voltar() {
        vm.bloqueiaDadosUtilizacao = false;
        vm.indiceTabs = vm.indiceTabs - 1;
    }

    function botaoEditar() {
        vm.cessaoGratuita.detalhar = false;
        vm.cessaoGratuita.editar = true;
    }

    function existeFotoVideo(destinacaoImoveis) {
      return destinacaoService.existeFotoVideo(destinacaoImoveis);
    }

    function converterListaArquivoImagem() {
        if (angular.isDefined(vm.cessaoGratuita) && angular.isDefined(vm.cessaoGratuita.destinacaoImoveis)) {
            vm.imagens = destinacaoService.converterListaArquivoImagem(vm.cessaoGratuita.destinacaoImoveis);
        }
    }

      function cancelar () {
          vm.cessaoGratuita.cancelar = true;
          destinacaoEscopoCompartilhadoService.setDestinacao(vm.cessaoGratuita, 'destinacao.cessaoGratuita');
          $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
      }

  }

  })();
