(function () {
  "use strict";
  angular.module("su-destinacao").controller("UsoProprioController", UsoProprioController);

  function UsoProprioController(mensagemDestinacaoService, $filter, destinacaoService, $state,
                                destinacaoEscopoCompartilhadoService, destinacaoServiceUtil, $q) {
    var vm = this;

    var TIPO_DESTINACAO ='USO_PROPRIO';

    vm.editar = false;
    vm.gravar = gravar;
    vm.fechar = fechar;
    vm.botaoEditar = botaoEditar;
    vm.atendimento = {};
    vm.imagens = {};
    vm.carregarDadosUtilizacao = false;
    vm.bloqueiaDadosUtilizacao = false;
    vm.isDetalharComObservacao = isDetalharComObservacao;
    vm.isObservacaoInformada   = isObservacaoInformada;
    vm.cancelar = cancelar;
    vm.PERMISSOES = '';
    vm.permissaoConcedida = true;

    vm.usoProprio = {
      fotos:[],
      documentos: [],
      finalidade: '',
      utilizacao: {},
      responsaveis: [],
      destinacaoImoveis: [],
      tipoDestinacaoEnum: TIPO_DESTINACAO,
      editar: false,
      detalhar: false,
      observacao: ''
    };
    vm.nomeState = 'destinacao.usoProprio';

    function init(){
      var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
        if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERUSOPROPRIO'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_USO_PROPRIO';
        }
      var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
      var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));

      destinacaoEscopoCompartilhadoService.limparEscopo();
      destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.usoProprio');

      $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
        destinacaoServiceUtil.tabRetorno(indiceRetorno)])
        .then(function (retorno) {
          if (angular.isDefined(retorno[0])) {
            vm.usoProprio = retorno[0].destinacao;
            vm.imagens = retorno[0].imagens;
            vm.atendimento = retorno[0].atendimento;
            vm.usoProprio.fotos = retorno[0].destinacao.fotos;
            vm.usoProprio.observacao = retorno[0].destinacao.observacao;
            if(angular.isDefined(retorno[0].destinacao.utilizacao.dataUtilizacao)){
                vm.usoProprio.utilizacao.dataUtilizacao = new Date(retorno[0].destinacao.utilizacao.dataUtilizacao);
            }
            vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
          } else {
            vm.carregarDadosUtilizacao = true;
          }

          if (angular.isDefined(retorno[1])) {
            vm.bloqueiaDadosUtilizacao = retorno[1].bloqueiaDadosUtilizacao;
          }
        });
    }

    init();

    function gravar() {
      if (vm.form.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        return;
      } else if (vm.usoProprio.destinacaoImoveis.length == 0) {
        mensagemDestinacaoService.mostrarMensagemError("Não existe imovel para a destinação");
        return;
      }

      vm.usoProprio.numeroProcesso = vm.atendimento.numeroProcedimento;

      for (var i = 0; i < vm.usoProprio.fotos.length; i++){
          vm.usoProprio.fotos[i].arquivo = vm.usoProprio.fotos[i].documento;
      }

      vm.usoProprio.homologado = false;
      vm.usoProprio.statusDestinacao = {"id":"3"};
      vm.usoProprio.pendencias = undefined;


        //setando o id do fundamento legal
        vm.usoProprio.codFundamentoLegal = vm.usoProprio.codFundamentoLegal.id;

      destinacaoService.salvarUsoProprio(vm.usoProprio).then(function (resposta) {
        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
        $state.go('destinacao.consultarDestinacao');
      }, function (erro) {
          if (erro.data && erro.data.erros) {
              mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
          } else if (erro.message){
              mensagemDestinacaoService.mostrarMensagemError(erro.message);
          }
      });
    }

    function fechar () {
      var mensagem = $filter('translate')('msg-confirmar-fechar');
      if(vm.usoProprio.detalhar || vm.usoProprio.editar){
        $state.go('destinacao.consultarDestinacao');
      } else {
        mensagemDestinacaoService.confirmar(mensagem, function () {
          $state.go('destinacao.consultarDestinacao');
        });
      }
    }

    function botaoEditar() {
      vm.usoProprio.editar = true;
      vm.usoProprio.detalhar = false;
    }

    function isDetalharComObservacao(){
        return vm.usoProprio.detalhar && isObservacaoInformada();
    }

    function isObservacaoInformada(){
        return angular.isDefined(vm.usoProprio.observacao) && vm.usoProprio.observacao !== '';
    }
      function cancelar () {
          vm.usoProprio.cancelar = true;
          destinacaoEscopoCompartilhadoService.setDestinacao(vm.usoProprio, 'destinacao.usoProprio');
          $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
      }

  }

})();

