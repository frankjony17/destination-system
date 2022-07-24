(function(){
    "use strict";
    angular.module("su-destinacao").controller("VendaController", vendaController);

    function vendaController(mensagemDestinacaoService, $filter,
                             destinacaoService,destinacaoEscopoCompartilhadoService, $state,
                             validadorFinanceiroVenda) {

      var vm = this;

      var TIPO_DESTINACAO = 'VENDA';
      var TIPO_PAGAMENTO_AVISTA = 1;
      var TIPO_PAGAMENTO_PARCELADO = 2;


      vm.bloqueiaDadosUtilizacao = false;
      vm.exibirMinuta = false;
      vm.avancar = avancar;
      vm.voltar = voltar;
      vm.gravar = gravar;
      vm.fechar = fechar;
      vm.salvarRascunho = salvarRascunho;
      vm.cancelar = cancelar;

      vm.PERMISSOES = '';
      vm.permissaoConcedida = true;

      vm.atendimento = {};

      vm.venda = {
        encargos: [],
        documentos: [],
        contrato: {},
        responsavel: {},
        licitacao:{},
        financeiro: {tipoPagamento: {id: TIPO_PAGAMENTO_AVISTA}},
        responsaveis: [],
        destinacaoImoveis: [],
        finalidade: [],
        tipoDestinacaoEnum: TIPO_DESTINACAO,
        laudoAvaliacao: {},
        recarregarDadosEscopo: false
      };
      vm.nomeState = 'destinacao.venda';
      var objetoOriginal = {};
      var propriedades = [{nome: 'contrato', tipo: 'objeto'}, {nome: 'responsavel', tipo: 'objeto'}, {nome: 'utilizacao', tipo: 'objeto'},
        {nome: 'responsaveis', tipo: 'array'}, {nome: 'destinacaoImoveis', tipo: 'array'}, {nome: 'encargos', tipo: 'array'}];

      function init() {

        var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('destinacao'));
          if (angular.isUndefined(destinacao) || destinacao.editar) {
              vm.PERMISSOES = 'DESTINACAOMANTERCDRU';
          } else {
              vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_CDRU';
          }
          var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
        if( angular.isDefined(indiceRetorno) && indiceRetorno === 2){
          vm.indiceTabs = indiceRetorno;
          vm.bloqueiaDadosUtilizacao = true;
          indiceRetorno = undefined;
        }
        destinacaoEscopoCompartilhadoService.limparEscopo();
        destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.venda');

          destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

        if(angular.isDefined(destinacao)){
          destinacao.tipoDestinacaoEnum = TIPO_DESTINACAO;
          tipoAcao(destinacao);
          carregarDestinacao(destinacao);
        }

      }
      function tipoAcao(destinacao) {
        if (destinacao.editar === true) {
          vm.bloquear = false;
          vm.editar = true;
        } else if (destinacao.detalhar === true) {
          vm.bloquear = true;
          vm.editar = false;
        }
      }

      function carregarDestinacao(destinacao) {
        if (destinacao.recarregarDadosEscopo === true) {
          prepararDadosVenda(destinacao);
        } else {
          destinacaoService.buscaDestinacaoPorId(destinacao.id, TIPO_DESTINACAO).then(function(resposta) {
            prepararDadosVenda(resposta.data.resultado, destinacao.editar);
          });
        }
      }

      function prepararDadosVenda(venda, editar) {
        vm.venda = venda;
        vm.venda.tipoDestinacaoEnum = TIPO_DESTINACAO;

        if (angular.isUndefined(editar)) {
          vm.venda.editar = venda.editar;
        } else {
          vm.venda.editar = editar;
        }

        vm.atendimento.numeroAtendimento = vm.venda.numeroAtendimento;
        vm.atendimento.numeroProcesso = vm.venda.numeroProcesso;
        objetoOriginal = angular.copy(vm.venda);
        destinacaoService.inicializarPropriedades(vm.venda, propriedades);
        if (angular.isDefined(vm.venda.contrato.id)) {
          vm.venda.contrato.dataInicio = new Date(vm.venda.contrato.dataInicio);
          vm.venda.contrato.dataFinal = new Date(vm.venda.contrato.dataFinal);
        }
      }

      init();

      function salvarRascunho() {

        if(!vm.bloqueiaDadosUtilizacao){
          if (vm.formUtilizacao.$invalid) {
            mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
            return;
          }
          vm.venda.statusDestinacao = {id:4, descricao:'Rascunho'};
        }

        vm.rascunho = true;

        salvar();

      }

      function gravar () {

        if(!vm.bloqueiaDadosUtilizacao) {
          if (vm.formUtilizacao.$invalid) {
            mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
            return;
          }
          vm.venda.statusDestinacao = {id:4, descricao:'Rascunho'};
        }
        else{
          if(vm.formContrato.$invalid){
            mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
            return;
          }
        }

        validacoesTipoPagamento();

        vm.venda.numeroAtendimento = vm.atendimento.numeroAtendimento;
        vm.venda.numeroProcesso = vm.atendimento.numeroProcedimento;


          //setando o id do fundamento legal
          vm.venda.codFundamentoLegal = vm.venda.codFundamentoLegal.id;

        salvar();

      }

      function salvar() {
        destinacaoService.salvarVenda(vm.venda).then(function (resposta) {
          mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
          vm.venda = destinacaoService.prepararDadosParaUpdate(vm.venda, resposta);
          $state.go('destinacao.consultarDestinacao')
        },function (erro) {
          if (erro.data.erros) {
            mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
          }
        });
      }


      function validacoesTipoPagamento () {
        if (vm.venda.financeiro.tipoPagamento.id == TIPO_PAGAMENTO_PARCELADO) {
          validadorFinanceiroVenda.validarValorTotalImovel(vm.venda.financeiro);
          var contrato = vm.venda.contrato;
          validadorFinanceiroVenda.preencherUltimoDiaMesVencimentoUsuarioMP(vm.venda.financeiro);
        } else {
          validadorFinanceiroVenda.verificarValorLaudoMenorValorLaudo(vm.venda.laudoAvaliacao, vm.venda.financeiro);
        }
      }

      function fechar () {
        var mensagem = $filter('translate')('msg-confirmar-fechar');
        mensagemDestinacaoService.confirmar(mensagem, function () {
          $state.go('destinacao.principal');
        });
      }


      function avancar() {
        if (vm.formUtilizacao.$invalid) {
         mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
         return;
         }
         validacoesTipoPagamento();
         vm.venda.numeroAtendimento = vm.atendimento.numeroAtendimento;
         vm.venda.numeroProcesso = vm.atendimento.numeroProcedimento;
        vm.bloqueiaDadosUtilizacao = true;
        vm.indiceTabs = vm.indiceTabs + 1;
      }

      function voltar() {
        vm.bloqueiaDadosUtilizacao = false;
        vm.indiceTabs = vm.indiceTabs - 1;
      }

      function cancelar () {
        vm.venda.cancelar = true;
        destinacaoEscopoCompartilhadoService.setDestinacao(vm.venda, 'destinacao.venda');
        $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
      }

    }

})();
