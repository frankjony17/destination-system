(function(){
    "use strict";
    angular.module("su-destinacao").controller("TermoEntregaController", TermoEntregaController);

    function TermoEntregaController(mensagemDestinacaoService,
                                    destinacaoService,
                                    $state,
                                    $filter,
                                    destinacaoEscopoCompartilhadoService,
                                    usuarioDestinacaoService,
                                    validadorDestinacaoService,
                                    destinacaoServiceUtil, $q) {

      var vm = this;

      var TIPO_DESTINACAO = 'TERMO_ENTREGA';

      vm.bloqueiaDadosUtilizacao = false;
      vm.exibirMinuta = false;
      vm.dataMinuta = new Date();
      vm.responsavelMinuta = undefined;
      vm.carregarDadosUtilizacao = false;

      vm.bloquear = false;
      vm.editar = false;
      vm.rascunho = false;
      vm.imagens = [];

      vm.fechar = fechar;
      vm.gravar = gravar;
      vm.avancar = avancar;
      vm.voltar = voltar;
      vm.botaoEditar = botaoEditar;
      vm.salvarRascunho = salvarRascunho;
      vm.cancelar = cancelar;
      vm.existeFotoVideo = existeFotoVideo;
      vm.converterListaArquivoImagem = converterListaArquivoImagem;
      vm.PERMISSOES = '';
      vm.permissaoConcedida = true;

      vm.atendimento = {};

      vm.termo = {
        encargos: [],
        documentos:[],
        responsavel:{},
        utilizacao:{},
        responsaveis: [],
        imoveis:[],
        destinacaoImoveis: [],
        extrato:{},
        contrato:{},
        numeroProcesso:'',
        tipoDestinacaoEnum: TIPO_DESTINACAO,
        editar: false,
        detalhar: false,
        atoAutorizativo: {},
        todosTiposAutorizativos: []
      };
      vm.nomeState = 'destinacao.termoEntrega';


        function init() {
            var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());

            if (angular.isUndefined(destinacao) || destinacao.editar) {
                vm.PERMISSOES = 'DESTINACAOMANTERTERMOENTREGA'
            } else {
                vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_TERMO_ENTREGA';
            }

            var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
            var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
            var objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));

            destinacaoEscopoCompartilhadoService.limparEscopo();
            destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.termoEntrega');

            destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

            $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
                    destinacaoServiceUtil.tabRetorno(indiceRetorno)])
            .then(function (retorno) {
                if (angular.isDefined(retorno[0])) {
                    vm.termo = retorno[0].destinacao;
                    vm.imagens = retorno[0].imagens;
                    vm.atendimento = retorno[0].atendimento;
                    vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                    vm.objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.termo, objetoOriginal);
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

        function fechar () {
            destinacaoService.fechar(vm.bloquear, vm.termo);
        }

        function salvarRascunho() {

            if(!vm.bloqueiaDadosUtilizacao){
                if (vm.formUtilizacao.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
                    return;
                }
                vm.termo.statusDestinacao = {id:4, descricao:'Rascunho'};
            }

            destinacaoService.validarExisteDestinacaoImovel(vm.termo);

            vm.rascunho = true;

            vm.termo.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.termo.numeroProcesso = vm.atendimento.numeroProcedimento;

            salvar();

        }

        function salvar () {
            destinacaoService.salvarTermoEntrega(vm.termo).then(function (resposta) {
                mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);

                vm.termo = destinacaoService.prepararDadosParaUpdate(vm.termo, resposta);

                if (vm.rascunho === false) {
                    $state.go('destinacao.consultarDestinacao');
                }  else {
                    var usuario = usuarioDestinacaoService.getUsuarioLogado();
                    vm.responsavelMinuta = usuario.cpf + ' - ' + usuario.nome;
                    vm.dataMinuta = $filter('date')(vm.dataMinuta, 'dd/MM/yyyy');

                }

            }, function (erro) {
                if (erro.data.erros) {
                mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
                }
            });

        }

        function gravar() {
            if(!vm.bloqueiaDadosUtilizacao){
                if (vm.formUtilizacao.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
                    return;
                }
                vm.termo.statusDestinacao = {id:4, descricao:'Rascunho'};
            } else{
                if(vm.formContrato.$invalid){
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
                    return;
                }
                vm.termo.statusDestinacao = {id:1, descricao:'Ativo'};
            }

            validadorDestinacaoService.verificarExisteAditivo(vm.objetoOriginal, vm.termo);

            vm.termo.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.termo.numeroProcesso = vm.atendimento.numeroProcedimento;
            vm.rascunho = false;
            salvar();

        }

        function existeFotoVideo(destinacaoImoveis) {
            return destinacaoService.existeFotoVideo(destinacaoImoveis);
        }

        function converterListaArquivoImagem() {
            if (angular.isDefined(vm.termo) && angular.isDefined(vm.termo.destinacaoImoveis)) {
                vm.imagens = destinacaoService.converterListaArquivoImagem(vm.termo.destinacaoImoveis);
            }
        }

        function avancar() {

            var resposta = destinacaoService.avancar(vm.formUtilizacao,
                                                     vm.termo,
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
            vm.termo.detalhar = false;
            vm.termo.editar = true;
        }

        function cancelar () {
            vm.termo.cancelar = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.termo, 'destinacao.termo');
            $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
        }

    }
})();
