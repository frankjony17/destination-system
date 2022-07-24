(function(){
    "use strict";
    angular.module("su-destinacao").controller("DoacaoController", DoacaoController);

    function DoacaoController(mensagemDestinacaoService, validadorDestinacaoService, $rootScope,$filter, destinacaoService, destinacaoServiceUtil,destinacaoEscopoCompartilhadoService, $q, $state) {

      var vm = this;

      var TIPO_DOACAO_SEM_ENCARGO = 1;
      var TIPO_DESTINACAO = 'DOACAO';

      vm.dataMinuta = new Date();
      vm.responsavelMinuta = undefined;
      vm.bloqueiaDadosUtilizacao = false;
      vm.exibirMinuta = false;
      vm.avancar = avancar;
      vm.voltar = voltar;
      vm.gravar = gravar;
      vm.fechar = fechar;
      vm.salvarRascunho = salvarRascunho;
      vm.botaoEditar = botaoEditar;
      vm.cancelar = cancelar;
      vm.bloquear = false;
      vm.editar = false;
      vm.rascunho = false;
      vm.carregarDadosUtilizacao = false;

      vm.atendimento = {};
      vm.PERMISSOES = '';
      vm.permissaoConcedida = true;

      vm.doacao = {
                   encargos: [],
                   documentos:[],
                   contrato: {},
                   responsavel:{},
                   utilizacao:{},
                   responsaveis: [],
                   destinacaoImoveis: [],
                   finalidade: [],
                   tipoDestinacaoEnum: TIPO_DESTINACAO,
                   recarregarDadosEscopo:false,
                   editar: false,
                   detalhar: false
      };
      vm.nomeState = 'destinacao.doacao';

      var objetoOriginal = {};

      function init() {
        var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
          if (angular.isUndefined(destinacao) || destinacao.editar) {
              vm.PERMISSOES = 'DESTINACAOMANTERDOACAO';
          } else {
              vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_DOACAO';
          }

        criarObjetoOriginal();
        var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
        var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
        destinacaoEscopoCompartilhadoService.limparEscopo();


          destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

      //  destinacao = {id: 57, editar: true};

        $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
          destinacaoServiceUtil.tabRetorno(indiceRetorno)])
          .then(function (retorno) {
            if (angular.isDefined(retorno[0])) {
              vm.doacao = retorno[0].destinacao;
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
          vm.doacao.statusDestinacao = {id:4, descricao:'Rascunho'};
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
          vm.doacao.statusDestinacao = {id:4, descricao:'Rascunho'};
        }
        else{
          if(vm.formContrato.$invalid){
            mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
            return;
          }
          vm.doacao.statusDestinacao = {id:1, descricao:'Ativo'};
        }


        validadorDestinacaoService.verificarExisteAditivo(objetoOriginal, vm.doacao);


          //setando o id do fundamento legal
          vm.doacao.codFundamentoLegal = vm.doacao.codFundamentoLegal.id;

        salvar();

      }

      function verificarEncargoInformado() {
        if (vm.atendimento.tipoDoacao && vm.atendimento.tipoDoacao.id == TIPO_DOACAO_SEM_ENCARGO) {
          if (vm.doacao.encargos.length == 0) {
            var mensagem = $filter('translate')('msg-encargo-obrigatorio');
            mensagemDestinacaoService.mostrarMensagemError(mensagem);
            throw mensagem;
          }
        }
      }

      function salvar() {

        setarDadosAtendimento();
        vm.doacao.destinacaoImoveis[0].parcelas = vm.doacao.destinacaoImoveis[0].imovel.parcelas;

        destinacaoService.salvarDoacao(vm.doacao).then(function (resposta) {
          mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
          vm.doacao = destinacaoService.prepararDadosParaUpdate(vm.doacao, resposta);

          if (vm.rascunho === false) {
            $state.go('destinacao.consultarDestinacao');
          } else {
            vm.responsavelMinuta = $rootScope.usuarioLogado.cpf+' - '+$rootScope.usuarioLogado.nome;
            vm.dataMinuta = $filter('date')(vm.dataMinuta, 'dd/MM/yyyy');
            vm.exibirMinuta = true;
          }
        }, function (erro) {
          if (erro.data.erros) {
            mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
          }
        });
      }

      function setarDadosAtendimento() {
        vm.doacao.tipoInstrumento = vm.atendimento.tipoInstrumento;

        if (angular.isDefined(vm.atendimento.tipoDoacao)
          && vm.atendimento.tipoDoacao.id == 1) {
          vm.doacao.existeEncargo = true;
        } else {
          vm.doacao.existeEncargo = false;
        }

        vm.doacao.numeroAtendimento = vm.atendimento.numeroAtendimento;
        vm.doacao.numeroProcesso = vm.atendimento.numeroProcedimento;
      }

      function fechar () {
        var mensagem;
        if(!vm.doacao.detalhar){
          if (vm.doacao.editar) {
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
         verificarEncargoInformado();
         vm.doacao.tipoInstrumento = vm.atendimento.tipoInstrumento;
         if(vm.atendimento.tipoDoacao && vm.atendimento.tipoDoacao.id ==1){
         vm.doacao.existeEncargo = true;
         }else{
         vm.doacao.existeEncargo = false;
         }
         vm.doacao.numeroAtendimento = vm.atendimento.numeroAtendimento;
         vm.doacao.numeroProcesso = vm.atendimento.numeroProcedimento;
        vm.bloqueiaDadosUtilizacao = true;
        vm.indiceTabs = vm.indiceTabs + 1;
      }

      function voltar() {
        vm.bloqueiaDadosUtilizacao = false;
        vm.indiceTabs = vm.indiceTabs - 1;
      }

      function botaoEditar() {
        vm.doacao.detalhar = false;
        vm.doacao.editar = true;
      }

        function cancelar () {
            vm.doacao.cancelar = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.doacao, 'destinacao.doacao');
            $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
        }

    }

})();
