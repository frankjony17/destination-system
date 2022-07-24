(function(){
    "use strict";
    angular.module("su-destinacao").controller("PermissaoUsoImovelFuncionalController", PermissaoUsoImovelFuncionalController);

    function PermissaoUsoImovelFuncionalController(mensagemDestinacaoService,
                                    destinacaoService,
                                    $state,
                                    $filter,
                                    destinacaoEscopoCompartilhadoService,
                                    usuarioDestinacaoService,
                                    validadorDestinacaoService,
                                    destinacaoServiceUtil, $q) {

        var vm = this;

        var TIPO_DESTINACAO = 'PERMISSAO_USO_IMOVEL_FUNCIONAL';

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
        vm.nomeState = 'destinacao.permissaoUsoImovelFuncional';

        vm.atendimento = {};

        vm.permissaoUsoImovelFuncional = {
            encargos: [],
            documentos:[],
            responsavel:{},
            utilizacao:{},
            dadosResponsavel: {},
            imoveis:[],
            destinacaoImoveis: [],
            extrato:{},
            contrato:{},
            numeroProcesso:'',
            tipoDestinacaoEnum: TIPO_DESTINACAO,
            recarregarDadosEscopo: false,
            editar: false,
            detalhar: false,
            atoAutorizativo: {},
            todosTiposAutorizativos: []
        };


        function init() {
            var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());

            if (angular.isUndefined(destinacao) || destinacao.editar) {
                vm.PERMISSOES = 'DESTINACAOMANTERPERMISSAOUSOIMOVELFUNCIONAL'
            } else {
                vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_PERMISSAO_USO_IMOVEL_FUNCIONAL';
            }
            var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
            var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));

            destinacaoEscopoCompartilhadoService.limparEscopo();
            destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.permissaoUsoImovelFuncional');

            destinacaoEscopoCompartilhadoService.setObjetos('controlerPai', vm);

            $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
                destinacaoServiceUtil.tabRetorno(indiceRetorno)])
                .then(function (retorno) {
                    if (angular.isDefined(retorno[0])) {
                        vm.permissaoUsoImovelFuncional = retorno[0].destinacao;
                        vm.imagens = retorno[0].imagens;
                        vm.atendimento = retorno[0].atendimento;
                        vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                    } else {
                        vm.carregarDadosUtilizacao = true;
                    }

                    if (angular.isDefined(retorno[1])) {
                        vm.bloqueiaDadosUtilizacao = retorno[1].bloqueiaDadosUtilizacao;
                        vm.indiceTabs = retorno[1].indiceTabs;
                    }
                });
            preencherSubtipoETIpoUtilizacao();
        }

        init();

        function fechar () {
            destinacaoService.fechar(vm.bloquear, vm.permissaoUsoImovelFuncional);
        }

        function salvarRascunho() {

            if(!vm.bloqueiaDadosUtilizacao){
                if (vm.formUtilizacao.$invalid) {
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUtilizacao);
                    return;
                }
                vm.permissaoUsoImovelFuncional.statusDestinacao = {id:4, descricao:'Rascunho'};
            }

            destinacaoService.validarExisteDestinacaoImovel(vm.permissaoUsoImovelFuncional);

            vm.rascunho = true;

            vm.permissaoUsoImovelFuncional.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.permissaoUsoImovelFuncional.numeroProcesso = vm.atendimento.numeroProcedimento;

            salvar();

        }

        function salvar () {
            if(vm.permissaoUsoImovelFuncional.destinacaoImoveis.length !== 0){
                vm.permissaoUsoImovelFuncional.imovel= vm.permissaoUsoImovelFuncional.destinacaoImoveis[0].imovel;
                vm.permissaoUsoImovelFuncional.destinacaoImoveis[0].parcelas = vm.permissaoUsoImovelFuncional.imovel.parcelas;
            }

            destinacaoService.salvarPermissaoUsoImovelInformal(vm.permissaoUsoImovelFuncional).then(function (resposta) {
                mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);

                vm.permissaoUsoImovelFuncional = destinacaoService.prepararDadosParaUpdate(vm.permissaoUsoImovelFuncional, resposta);

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
                vm.permissaoUsoImovelFuncional.statusDestinacao = {id:4, descricao:'Rascunho'};
            } else{
                if(vm.formContrato.$invalid){
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formContrato);
                    return;
                }
                vm.permissaoUsoImovelFuncional.statusDestinacao = {id:1, descricao:'Ativo'};
            }

            vm.permissaoUsoImovelFuncional.numeroAtendimento = vm.atendimento.numeroAtendimento;
            vm.permissaoUsoImovelFuncional.numeroProcesso = vm.atendimento.numeroProcedimento;
            vm.rascunho = false;
            salvar();

        }

        function existeFotoVideo(destinacaoImoveis) {
            return destinacaoService.existeFotoVideo(destinacaoImoveis);
        }

        function converterListaArquivoImagem() {
            if (angular.isDefined(vm.permissaoUsoImovelFuncional) && angular.isDefined(vm.permissaoUsoImovelFuncional.destinacaoImoveis)) {
                vm.imagens = destinacaoService.converterListaArquivoImagem(vm.permissaoUsoImovelFuncional.destinacaoImoveis);
            }
        }

        function avancar() {

            var resposta = destinacaoService.avancar(vm.formUtilizacao,
                vm.permissaoUsoImovelFuncional,
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
            vm.permissaoUsoImovelFuncional.detalhar = false;
            vm.permissaoUsoImovelFuncional.editar = true;
        }

        function preencherSubtipoETIpoUtilizacao() {
            vm.permissaoUsoImovelFuncional.utilizacao = {tipoUtilizacao:{id:19},
                subTipoUtilizacao:{id:47}
            };
        }

        function cancelar () {
            vm.permissaoUsoImovelFuncional.cancelar = true;
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.permissaoUsoImovelFuncional, 'destinacao.permissaoUsoImovelFuncional');
            $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
        }
    }
})();
