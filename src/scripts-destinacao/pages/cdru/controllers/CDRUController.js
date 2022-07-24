(function(){
  "use strict";
  angular.module("su-destinacao").controller("CDRUController", CDRUController);

  function CDRUController($rootScope,mensagemDestinacaoService,
                            $q, validadorDestinacaoService,
                            destinacaoServiceUtil,
                            destinacaoEscopoCompartilhadoService,
                            $filter,
                            destinacaoService,
                            $state) {
    var vm = this;
    var TIPO_DESTINACAO = 'CDRU';
    var TIPO_CONCESSAO_ONEROSO = 2;
    var TIPO_PAGAMENTO_AVISTA = 1;
    var NUMERO_FCC = '0000001406';
    var dataAtual = Date;
    vm.dataMinuta = new Date();
    vm.responsavelMinuta = undefined;
    vm.bloqueiaDadosUtilizacao = false;
    vm.exibirMinuta = false;
    vm.carregarDadosUtilizacao = false;
    vm.rascunho = false;
    vm.gravar = gravar;
    vm.fechar = fechar;
    vm.cancelar = cancelar;
    vm.verificarSePodeExibirFinanceiro = verificarSePodeExibirFinanceiro;
    vm.avancar = avancar;
    vm.voltar = voltar;
    vm.salvarRascunho = salvarRascunho;
    vm.botaoEditar = botaoEditar;

    vm.PERMISSOES = '';
    vm.permissaoConcedida = true;

    vm.atendimento = {
      tipoConcessao: ''
    };

    vm.cdru = {
      encargos: [],
      documentos: [],
      licitacao: {arquivos:[]},
      financeiro: {
        nuFCC: NUMERO_FCC,
        tipoPagamento: {id: TIPO_PAGAMENTO_AVISTA}
      },
      laudoAvaliacao: {},
      contrato: {},
      responsavel: {},
      utilizacao: {},
      responsaveis: [],
      destinacaoImoveis: [],
      tipoDestinacaoEnum: TIPO_DESTINACAO,
      recarregarDadosEscopo: false,
      editar: false,
      detalhar: false
    };
    vm.nomeState = 'destinacao.cdru';
    var objetoOriginal = {};

    function init() {
      var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());

        if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERCDRU'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_CDRU';
        }

      /*var destinacao = {editar: false, detalhar: true, id: 105};*/
      var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
      var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
      objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));
      destinacaoEscopoCompartilhadoService.limparEscopo();


      destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

      $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
        destinacaoServiceUtil.tabRetorno(indiceRetorno)])
        .then(function (retorno) {
          if (angular.isDefined(retorno[0])) {
            vm.atendimento = retorno[0].atendimento;
            vm.cdru = retorno[0].destinacao;
              if(angular.isDefined(vm.cdru.financeiro)){
                  vm.cdru.financeiro.dataInicioCobranca = new Date(vm.cdru.financeiro.dataInicioCobranca);
              }
            vm.imagens = retorno[0].imagens;
            vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
            angular.forEach(vm.cdru.licitacao.arquivos, function (arq, index) {
              vm.cdru.licitacao.arquivos[index].documento = {};
              vm.cdru.licitacao.arquivos[index].documento.nomeReal = vm.cdru.licitacao.arquivos[index].nomeReal;
            });
            objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.cdru, objetoOriginal);
          }
          else {
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
        vm.cdru.statusDestinacao = {id:4, descricao:'Rascunho'};
      }

      vm.rascunho = true;
      setarDadosAtendimento();

      salvar();

    }

    function gravar() {

      if(!vm.bloqueiaDadosUtilizacao){
        if (vm.formUtilizacao.$invalid) {
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
          return;
        }
        vm.cdru.statusDestinacao = {id:4, descricao:'Rascunho'};
      }
      else{
        if(vm.formContrato.$invalid){
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
          return;
        }
        vm.cdru.statusDestinacao = {id:1, descricao:'Ativo'};
      }


      validadorDestinacaoService.verificarExisteAditivo(objetoOriginal, vm.cdru);

      //setando o id do fundamento legal
      vm.cdru.codFundamentoLegal = vm.cdru.codFundamentoLegal.id;

      setarDadosAtendimento();

      salvar();

    }

    function salvar() {
      destinacaoService.salvarCDRU(vm.cdru).then(function (resposta) {
        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);

        if (vm.rascunho === false) {
          $state.go('destinacao.consultarDestinacao');
        }
        else{
          vm.cdru = destinacaoService.prepararDadosParaUpdate(vm.cdru, resposta);
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
      if(!vm.cdru.detalhar){
        if (vm.cdru.editar) {
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

    function verificarSePodeExibirFinanceiro() {
      if(vm.carregarDadosUtilizacao == true && angular.isDefined(vm.atendimento.tipoConcessao)){
        return vm.atendimento.tipoConcessao.id == TIPO_CONCESSAO_ONEROSO;
      }
      else{
        return false;
      }
    }

    function avancar() {
      if (vm.formUtilizacao.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
        return;
      }
      vm.cdru.tipoConcessao = vm.atendimento.tipoConcessao;
      vm.cdru.numeroAtendimento = vm.atendimento.numeroAtendimento;
      vm.cdru.numeroProcesso = vm.atendimento.numeroProcedimento;
      vm.bloqueiaDadosUtilizacao = true;
      vm.indiceTabs = vm.indiceTabs + 1;
    }

    function voltar() {
      vm.bloqueiaDadosUtilizacao = false;
      vm.indiceTabs = vm.indiceTabs - 1;
    }

    function botaoEditar() {
      vm.cdru.detalhar = false;
      vm.cdru.editar = true;
    }

    function setarDadosAtendimento(){
      vm.cdru.tipoConcessao = vm.atendimento.tipoConcessao;
      vm.cdru.numeroAtendimento = vm.atendimento.numeroAtendimento;
      vm.cdru.numeroProcesso = vm.atendimento.numeroProcedimento;
      vm.cdru.destinacaoImoveis[0].parcelas = vm.cdru.destinacaoImoveis[0].imovel.parcelas;
    }

    function cancelar () {
        vm.cdru.cancelar = true;
        destinacaoEscopoCompartilhadoService.setDestinacao(vm.cdru, 'destinacao.cdru');
        $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
    }

  }
})();
