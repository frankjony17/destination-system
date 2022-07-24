/**
 * Created by Basis Tecnologia on 07/11/2016.
 */
(function(){
  "use strict";
  angular.module("su-destinacao").controller("CUEMController", CUEMController);

  function CUEMController(mensagemDestinacaoService, destinacaoService,destinacaoEscopoCompartilhadoService, $state, $filter,
                          destinacaoServiceUtil, validadorDestinacaoService,$rootScope, $q) {

    var vm = this;
    var TIPO_DESTINACAO = 'CUEM';

    vm.bloqueiaDadosUtilizacao = false;
    vm.exibirMinuta = false;
    vm.avancar = avancar;
    vm.voltar = voltar;
    vm.gravar = gravar;
    vm.botaoEditar = botaoEditar;
    vm.atendimento = {};
    vm.fechar = fechar;
    vm.salvarRascunho = salvarRascunho;
    vm.rascunho = false;
    vm.carregarDadosUtilizacao = false;
    vm.nomeState = 'destinacao.cuem';
    vm.cancelar = cancelar;

    vm.PERMISSOES = '';
    vm.permissaoConcedida = true;

    vm.cuem = {
      contrato: {},
      documentos:[],
      encargos: [],
      utilizacao: {},
        dadosResponsavel: {},
      destinacaoImoveis: [],
      tipoDestinacaoEnum: TIPO_DESTINACAO,
      recarregarDadosEscopo: false,
      detalhar: false,
      editar:false
    };
    var objetoOriginal= {};

    function init() {
      var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());

      if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERCUEM'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_CUEM';
        }

      criarObjetoOriginal();
      var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
      var atendimento= angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
        destinacaoEscopoCompartilhadoService.limparEscopo();

      destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);
      $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
        destinacaoServiceUtil.tabRetorno(indiceRetorno)])
        .then(function (retorno) {
          if (angular.isDefined(retorno[0])) {
            vm.cuem = retorno[0].destinacao;
            vm.imagens = retorno[0].imagens;
            vm.atendimento = retorno[0].atendimento;
            vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
          }
          else{
            vm.carregarDadosUtilizacao = true;
          }

          if (angular.isDefined(retorno[1])) {
            vm.bloqueiaDadosUtilizacao = retorno[1].bloqueiaDadosUtilizacao;
            vm.indiceTabs = retorno[1].indiceTabs;
          }
        }, function(erro) {
            return;
        });
    }

    function criarObjetoOriginal() {
      objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));
      if (angular.isUndefined(objetoOriginal)) {
        objetoOriginal = {};
      }
      return objetoOriginal;
    }

    init();

    function salvarRascunho() {

      if(!vm.bloqueiaDadosUtilizacao){
        if (vm.formUtilizacao.$invalid) {
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
          return;
        }
        vm.cuem.statusDestinacao = {id:4, descricao:'Rascunho'};
      }

      vm.rascunho = true;

      salvar();

    }

    function gravar () {
      if(!vm.bloqueiaDadosUtilizacao) {
        if (vm.formUtilizacao.$invalid) {
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
          return;
        } else if (vm.cuem.destinacaoImoveis.length == 0) {
          mensagemDestinacaoService.mostrarMensagemError("Não existe imovel para a destinação");
          return;
        }
      }
      else{
        if(vm.formContrato.$invalid){
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
          return;
        }
      }

      validadorDestinacaoService.verificarExisteAditivo(vm.objetoOriginal, vm.cuem);
      vm.cuem.tipoModalidade = vm.atendimento.tipoModalidade;
      vm.cuem.numeroAtendimento = vm.atendimento.numeroAtendimento;
      vm.cuem.numeroProcesso = vm.atendimento.numeroProcedimento;


        //setando o id do fundamento legal
        vm.cuem.codFundamentoLegal = vm.cuem.codFundamentoLegal.id;

      salvar();
    }

    function salvar() {
      vm.cuem.destinacaoImoveis[0].parcelas = vm.cuem.destinacaoImoveis[0].imovel.parcelas;

      destinacaoService.salvarCUEM(vm.cuem).then(function (resposta) {
        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
        vm.cuem = destinacaoService.prepararDadosParaUpdate(vm.cuem, resposta);

        if (vm.rascunho === false) {
          $state.go('destinacao.consultarDestinacao');
        } else {
          vm.responsavelMinuta = $rootScope.usuarioLogado.cpf+' - '+$rootScope.usuarioLogado.nome;
          vm.dataMinuta = $filter('date')(vm.dataMinuta, 'dd/MM/yyyy');
          vm.exibirMinuta = false;
        }
      }, function (erro) {
        if (erro.data.erros) {
          mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
        }
      });
    }

     function fechar () {
       var mensagem;
       if(!vm.cuem.detalhar){
         if (vm.cuem.editar) {
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

    function avancar() {
      if (vm.formUtilizacao.$invalid) {
       mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
       return;
       }
       vm.cuem.tipoModalidade = vm.atendimento.tipoModalidade;
       vm.cuem.numeroAtendimento = vm.atendimento.numeroAtendimento;
       vm.cuem.numeroProcesso = vm.atendimento.numeroProcedimento;
      vm.bloqueiaDadosUtilizacao = true;
      vm.indiceTabs = vm.indiceTabs + 1;
    }

    function voltar() {
      vm.bloqueiaDadosUtilizacao = false;
      vm.indiceTabs = vm.indiceTabs - 1;
    }

    function botaoEditar() {
      vm.cuem.detalhar = false;
      vm.cuem.editar = true;
    }
    function cancelar () {
        vm.cuem.cancelar = true;
        destinacaoEscopoCompartilhadoService.setDestinacao(vm.cuem, 'destinacao.cuem');
        $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
    }
  }

})();
