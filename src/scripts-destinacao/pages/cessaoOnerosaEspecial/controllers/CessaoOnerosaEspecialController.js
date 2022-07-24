(function(){
    "use strict";
    angular.module("su-destinacao").controller("CessaoOnerosaEspecialController", CessaoOnerosaEspecialController);

    function CessaoOnerosaEspecialController($rootScope,mensagemDestinacaoService,
                            $q, validadorDestinacaoService,
                            destinacaoServiceUtil,
                            destinacaoEscopoCompartilhadoService,
                            $filter,
                            destinacaoService,
                            $state) {
        var vm = this;
        var TIPO_DESTINACAO = 'CESSAO_ONEROSA';
        var TIPO_PAGAMENTO_AVISTA = 1;
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
        vm.habilitarAccordion = habilitarAccordion;
        vm.init = init;

        vm.PERMISSOES = '';
        vm.permissaoConcedida = true;

        vm.atendimento = {
            tipoCessao: ''
        };

        vm.cessaoOnerosaEspecial = {
            cancelamentoEncerramento: {},
            encargos: [],
            documentos: [],
            licitacao: {arquivos:[]},
            financeiro: {
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
            detalhar: false,
            atoAutorizativo: {}
        };
        vm.nomeState = 'destinacao.cessaoOnerosa';
        var objetoOriginal = {};

        function init() {

            var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());

            if (angular.isUndefined(destinacao) || destinacao.editar) {
                vm.PERMISSOES = 'DESTINACAOMANTERCESSAOONEROSA'
            } else {
                vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_CESSAO_ONEROSA';
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
                        vm.cessaoOnerosaEspecial = retorno[0].destinacao;
                        if(angular.isDefined(vm.cessaoOnerosaEspecial.financeiro)){
                            vm.cessaoOnerosaEspecial.financeiro.dataInicioCobranca = new Date(vm.cessaoOnerosaEspecial.financeiro.dataInicioCobranca);
                        }
                        vm.imagens = retorno[0].imagens;
                        vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                        angular.forEach(vm.cessaoOnerosaEspecial.licitacao.arquivos, function (arq, index) {
                            vm.cessaoOnerosaEspecial.licitacao.arquivos[index].documento = {};
                            vm.cessaoOnerosaEspecial.licitacao.arquivos[index].documento.nomeReal = vm.cessaoOnerosaEspecial.licitacao.arquivos[index].nomeReal;
                        });
                        objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.cessaoOnerosaEspecial, objetoOriginal);
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
                vm.cessaoOnerosaEspecial.statusDestinacao = {id:4, descricao:'Rascunho'};
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
                vm.cessaoOnerosaEspecial.statusDestinacao = {id:4, descricao:'Rascunho'};
            }
            else{
                if(vm.formContrato.$invalid){
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
                    return;
                }
                vm.cessaoOnerosaEspecial.statusDestinacao = {id:1, descricao:'Ativo'};
            }


            validadorDestinacaoService.verificarExisteAditivo(objetoOriginal, vm.cessaoOnerosaEspecial);

            setarDadosAtendimento();

            //setando o id do fundamento legal
            vm.cessaoOnerosaEspecial.codFundamentoLegal = vm.cessaoOnerosaEspecial.codFundamentoLegal.id;

            salvar();

        }

        function salvar() {
            destinacaoService.salvarCessaoOnerosa(vm.cessaoOnerosaEspecial).then(function (resposta) {
                mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);

                if (vm.rascunho === false) {
                    $state.go('destinacao.consultarDestinacao');
                }
                else{
                    vm.cessaoOnerosaEspecial = destinacaoService.prepararDadosParaUpdate(vm.cessaoOnerosaEspecial, resposta);
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
            if(!vm.cessaoOnerosaEspecial.detalhar){
                if (vm.cessaoOnerosaEspecial.editar) {
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
            if((vm.carregarDadosUtilizacao == true && angular.isDefined(vm.atendimento.tipoCessao))){
                return vm.atendimento.tipoCessao == 'Onerosa' || vm.atendimento.envolvePagamento === true;
            }
            else{
                return false;
            }
        }

        function habilitarAccordion() {
            if(angular.isDefined(vm.atendimento.tipoCessao)){
                return !(vm.atendimento.tipoCessao == 'Onerosa' || angular.isDefined(vm.atendimento.envolvePagamento));
            }else {
                return true;
            }
        }

        function avancar() {
            if (vm.formUtilizacao.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
                return;
            }
            vm.cessaoOnerosaEspecial.tipoCessao = vm.atendimento.tipoCessao;
            vm.cessaoOnerosaEspecial.envolvePagamento = vm.atendimento.envolvePagamento;
            vm.cessaoOnerosaEspecial.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.cessaoOnerosaEspecial.numeroProcesso = vm.atendimento.numeroProcedimento;
            vm.bloqueiaDadosUtilizacao = true;
            vm.indiceTabs = vm.indiceTabs + 1;
        }

        function voltar() {
            vm.bloqueiaDadosUtilizacao = false;
            vm.indiceTabs = vm.indiceTabs - 1;
        }

        function botaoEditar() {
            vm.cessaoOnerosaEspecial.detalhar = false;
            vm.cessaoOnerosaEspecial.editar = true;
        }

        function setarDadosAtendimento(){
            vm.cessaoOnerosaEspecial.tipoCessao = vm.atendimento.tipoCessao;
            vm.cessaoOnerosaEspecial.envolvePagamento = vm.atendimento.envolvePagamento;
            vm.cessaoOnerosaEspecial.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.cessaoOnerosaEspecial.numeroProcesso = vm.atendimento.numeroProcedimento;
            vm.cessaoOnerosaEspecial.destinacaoImoveis[0].parcelas = vm.cessaoOnerosaEspecial.destinacaoImoveis[0].parcelas;
        }

        function cancelar () {
            vm.cessaoOnerosaEspecial.cancelar = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.cessaoOnerosaEspecial, 'destinacao.cessaoOnerosa');
            $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
        }

    }
})();
