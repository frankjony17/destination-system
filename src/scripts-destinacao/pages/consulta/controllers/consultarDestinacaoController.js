/**
 * Created by basis on 10/01/17.
 */
(function () {
    'use strict';
    angular.module("su-destinacao").controller("ConsultarDestinacaoController", consultarDestinacaoController)

    function consultarDestinacaoController(consultarDestinacaoService,
                                           subTipoUtilizacaoService,
                                           tipoUtilizacaoService,
                                           consultaDestinacaoService,localidadeService,
                                           dominioService,
                                           $state,
                                           $mdDialog,
                                           destinacaoEscopoCompartilhadoService,
                                           mensagemDestinacaoService,
                                           $filter,
                                           $element,
                                           $rootScope,
                                           caracteresEspeciaisService) {



        $rootScope.encargosList = [];
        var vm = this;

        var rotas = {};

        vm.destinacaoFiltro = {tiposDestinacao:[], pais: 'Brasil'};

        vm.tiposDestinacao = [];

        vm.cidadesExterior = [];

        vm.permissaoCadastrarEditar = 'DESTINACAOMANTER';
        vm.permissaoConsultar = 'DESTINACAO_CONSULTAR_DESTINACAO_';
        vm.todasPermissoesCadastrarEditar = 'DESTINACAOMANTERDOACAO,' +
            'DESTINACAOMANTERVENDA,' +
            'DESTINACAOMANTERPOSSEINFORMAL,' +
            'DESTINACAOMANTERCUEM,' +
            'DESTINACAOMANTERCDRU,' +
            'DESTINACAOMANTERCESSAOGRATUITA,' +
            'DESTINACAOMANTERTERMOENTREGA,' +
            'DESTINACAOMANTERUSOPROPRIO,' +
            'DESTINACAOMANTERPERMISSAOUSOIMOVELFUNCIONAL'+
            'DESTINACAOMANTERCESSAOONEROSA' +
            'DESTINACAOMANTERTRANSFERENCIA';

        vm.tabelaDestinacoes = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        vm.visualizarTabela = true;

        vm.isSuperintendente = false;
        vm.parametrosConsulta = {};

        vm.destinacoes = [];
        vm.municipios = [];
        vm.destinacoesMap = [];
        vm.listaFiltradaTipoUtilizacao = [];
        vm.paises = [];
        vm.ufs = [];
        vm.todosTiposUtilizacao = [];
        vm.textoTipo = undefined;
        vm.textoSubTipo = undefined;

        vm.todosSubTiposUtilizacao = [];
        vm.listaFiltradaSubTipoUtilizacao = [];
        vm.listaVersoes = [];
        vm.listaEncargos = [];

        vm.limparFiltroTipoUtilizacao = limparFiltroTipoUtilizacao;
        vm.limparFiltroSubTipoUtilizacao = limparFiltroSubTipoUtilizacao;
        vm.filtrarListaSubTipo = filtrarListaSubTipo;

        vm.getListaEncargos = getListaEncargos;

        vm.buscar = buscar;
        vm.atualizarTabela = atualizarTabela;
        vm.formatarUso = tipoUtilizacaoService.formatarUso;
        vm.limparlistaDestinacoes = limparlistaDestinacoes;
        vm.mostrarNoMapa = mostrarNoMapa;
        vm.detalhar = detalhar;
        vm.editar = editar;
        vm.cancelar = cancelar;
        vm.abrirModalNovaSituacaoDestinacao = abrirModalNovaSituacaoDestinacao;
        vm.buscarMunicipios = buscarMunicipios;
        vm.homologar = homologar;
        vm.verificaPaisSelecionado = verificaPaisSelecionado;
        vm.lpad = lpad;
        vm.isNotUsoProprioHomologadoRecusado = isNotUsoProprioHomologadoRecusado;
        vm.isUsoProprioHomologado = isUsoProprioHomologado;
        vm.isUsoProprioRecusado = isUsoProprioRecusado;
        vm.caracteres = caracteres;
        vm.encerrar = encerrar;
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        function init() {
            vm.modoExibicao = true;
            carregarListaTipoDestincao();
            carregarTodosTipos();
            carregarTodosSubtipos();
            buscarPaises();
            inicializarRotasInstrumentos();


            if(JSON.parse(window.sessionStorage.getItem('pendencia'))){
                vm.pendencia = JSON.parse(window.sessionStorage.getItem('pendencia'));
                window.sessionStorage.removeItem('pendencia');

                getDestinacaoPorPendencia();
                if(vm.pendencia.pendencia === 'Confirmar Cancelamento/Encerramento de Destinação' || vm.pendencia.pendencia === 'Confirmar Encerramento de Destinação'){
                    vm.isSuperintendente = true;
                }

            }
        }

        init();

        function getListaEncargos(destinacao){
            consultaDestinacaoService.buscarEncargos(destinacao.id).then(function(resposta){
                $rootScope.listaComEncargos  = resposta.data.resultado;

                destinacaoEscopoCompartilhadoService.setObjetos('destinacao', {id: destinacao.id, detalhar: true});
                $state.go(rotas[destinacao.tipoDestinacao.id]);
            });
        }

        function getDestinacaoPorPendencia() {
            consultarDestinacaoService.consultarDestinacaoPorPendencia(vm.pendencia.pendencia).then(function (resposta) {
                vm.destinacoes = resposta.data.resultado;
                angular.forEach(vm.destinacoes, function (destinacao, $index) {
                    if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Permissão de Uso de Imóvel Funcional'){
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'PERMISSAO_USO_IMOVEL_FUNCIONAL'
                    }else if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Cessão Onerosa-Em Condições Especiais'){
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'CESSAO_ONEROSA'
                    }else if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Transferência de Gestão/Titularidade'){
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'TRANSFERENCIA'
                    } else {
                        vm.destinacoes[$index].tipoDestinacaoPermissao = caracteres(destinacao.tipoDestinacao.descricao).split(" ").join("_");
                    }
                });
                vm.tabelaDestinacoes.total = resposta.data.totalElementos;

                if (vm.destinacoes.length === 0) {
                    vm.destinacoes = [];
                    vm.destinacoesMap = [];
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-nem-resultado'));
                }

                if (vm.visualizarTabela === false) {
                    vm.destinacoesMap = vm.destinacoes;
                }
            });
        }

        function limparFiltroTipoUtilizacao() {
            vm.filtroTipoUtilizacao = '';
        }

        function limparFiltroSubTipoUtilizacao() {
            vm.filtroSubTipoUtilizacao = '';
        }

        function addRotasInstrumentos(idInstrumento, rota) {
            rotas[idInstrumento] = rota;
        }

        function inicializarRotasInstrumentos() {
            addRotasInstrumentos(1, 'destinacao.doacao');
            addRotasInstrumentos(2, 'destinacao.venda');
            addRotasInstrumentos(3, 'destinacao.posseInformal');
            addRotasInstrumentos(4, 'destinacao.cuem');
            addRotasInstrumentos(5, 'destinacao.cdru');
            addRotasInstrumentos(6, 'destinacao.cessaoGratuita');
            addRotasInstrumentos(7, 'destinacao.cessaoOnerosa');
            addRotasInstrumentos(13, 'destinacao.usoProprio');
            addRotasInstrumentos(11, 'destinacao.transferenciaTitularidade')
            addRotasInstrumentos(10, 'destinacao.termoEntrega');
            addRotasInstrumentos(14, 'destinacao.permissaoUsoImovelFuncional');

        }

        function carregarListaTipoDestincao() {
            consultarDestinacaoService.carregarListaTipoDestincao().then(function (resposta) {
                vm.tiposDestinacao = resposta.data.resultado;

                vm.tiposDestinacao = vm.tiposDestinacao.filter(function (tipoDestinacao) {
                    if(tipoDestinacao.codigo !== '12'){
                        return $rootScope.usuarioLogado.permissoes.indexOf(tipoDestinacao.permissaoConsultar.trim()) != -1;
                    } else{
                        return true;
                    }
                });
            });
        }

        function carregarTodosSubtipos () {
            subTipoUtilizacaoService.buscarTodosSubtiposUtilizacao().then(function (resposta) {
                vm.todosSubTiposUtilizacao = resposta.data.resultado;
                vm.listaFiltradaSubTipoUtilizacao = subTipoUtilizacaoService.criarListaSubTipoInicial(angular.copy(vm.todosSubTiposUtilizacao));
            });
        }

        function carregarTodosTipos () {
            tipoUtilizacaoService.buscarTodosTiposUtilizacao().then(function (resposta) {
                vm.todosTiposUtilizacao = resposta.data.resultado;
            });
        }

        function filtrarListaSubTipo(id) {

            if (angular.isDefined(id)) {
                vm.listaFiltradaSubTipoUtilizacao = vm.todosSubTiposUtilizacao.filter(function(elemento) {
                    return elemento.tipoUtilizacao.id === id;
                });
            } else {
                vm.listaFiltradaSubTipoUtilizacao = [];
                vm.destinacaoFiltro.subTipoUtilizacao = undefined;
            }

        }

        function buscar() {
            if (vm.form.$valid) {
                separarDadosUtilizacao();
                criarParametros();
                consultar();
            } else {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
            }

        }

        function atualizarTabela() {
            vm.parametrosConsulta.offset = angular.copy(vm.tabelaDestinacoes.page) - 1;
            vm.parametrosConsulta.limit = angular.copy(vm.tabelaDestinacoes.limit);
            consultar();
        }

        function consultar() {
            vm.isSuperintendente = false;
            consultaDestinacaoService.consultar(vm.parametrosConsulta).then(function(resposta) {
                vm.destinacoes = resposta.data.resultado;
                angular.forEach(vm.destinacoes, function (destinacao, $index) {
                    if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Permissão de Uso de Imóvel Funcional'){
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'PERMISSAO_USO_IMOVEL_FUNCIONAL'
                    }else if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Cessão Onerosa-Em Condições Especiais'){
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'CESSAO_ONEROSA'
                    } else if(vm.destinacoes[$index].tipoDestinacao.descricao === 'Transferência de Gestão/Titularidade') {
                        vm.destinacoes[$index].tipoDestinacaoPermissao = 'TRANSFERENCIA'
                    } else {
                        vm.destinacoes[$index].tipoDestinacaoPermissao = caracteres(destinacao.tipoDestinacao.descricao).split(" ").join("_");
                    }
                });
                vm.tabelaDestinacoes.total = resposta.data.totalElementos;

                if (vm.destinacoes.length === 0) {
                    vm.destinacoes = [];
                    vm.destinacoesMap = [];
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-nem-resultado'));
                }
                if (vm.visualizarTabela === false) {
                    vm.destinacoesMap = vm.destinacoes;
                }
            });
        }

        function criarParametros() {
            vm.parametrosConsulta = angular.copy(vm.destinacaoFiltro);
            vm.parametrosConsulta.idTipoUtilizacao = getIdObjeto(vm.destinacaoFiltro.tipoUtilizacao);
            vm.parametrosConsulta.idSubTipoUtilizacao = getIdObjeto(vm.destinacaoFiltro.subTipoUtilizacao);
            extrairIdsTiposDestinacao();
            if (vm.visualizarTabela === true) {
                vm.parametrosConsulta.offset = angular.copy(vm.tabelaDestinacoes.page) - 1;
                vm.parametrosConsulta.limit = angular.copy(vm.tabelaDestinacoes.limit);
            } else {
                vm.tabelaDestinacoes.page = 0;
                vm.tabelaDestinacoes.limit = 10;
                vm.parametrosConsulta.offset = 0;
                vm.parametrosConsulta.limit = 10000;
            }

        }

        function extrairIdsTiposDestinacao() {
            if (angular.isDefined(vm.destinacaoFiltro.tiposDestinacao)) {
                vm.parametrosConsulta.tiposDestinacao = vm.destinacaoFiltro.tiposDestinacao.map(function(elem) {
                    return elem.codigo;
                });
            }

        }

        function getIdObjeto(objeto) {
            if (angular.isDefined(objeto) && objeto != null) {
                return objeto.id;
            }
            return undefined;
        }

        function separarDadosUtilizacao() {
            if (angular.isDefined(vm.destinacaoFiltro.dadosUtilizacao)) {
                var dadosConsulta = vm.destinacaoFiltro.dadosUtilizacao.split('/');
                extrairRip(dadosConsulta);
                if (dadosConsulta.length > 1) {
                    var dadosUtilizacao = dadosConsulta[1].split('P');
                    extrairCodigoUtilizacaoDestinacao(dadosUtilizacao);
                    extrairParcela(dadosUtilizacao);

                }
            }
        }

        function extrairRip(dadosConsulta) {
            if (dadosConsulta.length >= 1 && dadosConsulta[0] !== '') {
                vm.destinacaoFiltro.rip = dadosConsulta[0];
            }
        }

        function extrairCodigoUtilizacaoDestinacao(dadosUtilizacao) {
            if (dadosUtilizacao.length >= 1) {
                vm.destinacaoFiltro.codigoUtilizacao = dadosUtilizacao[0];
            }
        }

        function lpad(parcela) {
            var texto = parcela.substring(1, parcela.length);
            var digito = parcela.substring(0, 1);
            return digito + (texto.length >= 4 ? texto : new Array(4 - texto.length + 1).join('0') + texto);
        }


        function extrairParcela(dadosUtilizacao) {
            if (dadosUtilizacao.length > 1) {
                vm.destinacaoFiltro.codigoParcela = 'P' + parseInt(dadosUtilizacao[1]);
            }
        }

        function buscarPaises() {
            localidadeService.buscarPaises().then(function(resposta) {
                vm.paises = resposta.data.resultado;
            });
        }


        function buscarUfs() {
            vm.ufs = $rootScope.usuarioLogado.jurisdicoes.sort();
        }

        $rootScope.$watch('usuarioLogado', function(){
            if($rootScope.usuarioLogado){
                buscarUfs();
            }
        }, true);

        function buscarMunicipios() {
            if (vm.destinacaoFiltro.uf) {
                localidadeService.buscarMunicipiosPorUf(vm.destinacaoFiltro.uf).then(function(resposta) {
                    vm.municipios = resposta.data.resultado;
                });
            } else {
                vm.municipios = []
            }

        }

        function limparlistaDestinacoes() {
            vm.destinacoes = [];
            vm.tabelaDestinacoes.page = 1;
            vm.tabelaDestinacoes.limit = 10;
        }

        vm.limparPesquisa = function() {
            vm.destinacaoFiltro = {};
            vm.destinacoes = [];
            vm.todosTiposUtilizacao = [];
        };

        function mostrarNoMapa(imovel) {
            vm.visualizarTabela = false;
            vm.destinacoesMap = [];
            vm.destinacoesMap.push(imovel);
        }

        function detalhar(destinacao) {
            destinacaoEscopoCompartilhadoService.limparEscopo();
            getListaEncargos(destinacao);
        }

        function editar(destinacao) {
            destinacaoEscopoCompartilhadoService.limparEscopo();
            destinacaoEscopoCompartilhadoService.setObjetos('destinacao', {id: destinacao.id, editar: true});
            $state.go(rotas[destinacao.tipoDestinacao.id]);
        }

        function cancelar(destinacao) {
            destinacaoEscopoCompartilhadoService.limparEscopo();
            destinacaoEscopoCompartilhadoService.setObjetos('destinacao', {id: destinacao.id, cancelar: true, tipoDestinacao: destinacao.tipoDestinacao});
            if (vm.isSuperintendente){
                destinacaoEscopoCompartilhadoService.setObjetos('isSuperintendente', vm.isSuperintendente);
            }
            $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
        }

        function encerrar(destinacao) {
            destinacaoEscopoCompartilhadoService.limparEscopo();
            destinacaoEscopoCompartilhadoService.setObjetos('destinacao', {id: destinacao.id, cancelar: true, tipoDestinacao: destinacao.tipoDestinacao});
            if (vm.isSuperintendente){
                destinacaoEscopoCompartilhadoService.setObjetos('isSuperintendente', vm.isSuperintendente);
            }
            $state.go('destinacao.encerrarDestinacao');
        }

        function homologar(destinacao) {
            destinacaoEscopoCompartilhadoService.setObjetos('destinacao', destinacao);
            $state.go('destinacao.homologarUsoProprio');
        }

        function verificaPaisSelecionado(){
            if(vm.destinacaoFiltro.pais !== 'Brasil' && angular.isDefined(vm.destinacaoFiltro.dadosUtilizacao)){
                consultaDestinacaoService.consultarCidades(vm.destinacaoFiltro.pais, vm.destinacaoFiltro.dadosUtilizacao.replace('/', '')).then(function (resposta) {
                    vm.cidadesExterior = resposta.data.resultado;
                });
            }
        }


        function abrirModalNovaSituacaoDestinacao(destinacao, ev) {
            $mdDialog.show({
                controller: 'incluirNovaSituacaoDestinacaoController',
                controllerAs: 'incluirNovaSituacaoDestinacaoCtrl',
                templateUrl: 'scripts-destinacao/pages/consulta/partials/views/novaSituacaoDestinacao.html',
                targetEvent: ev,
                locals: {
                    imovel: destinacao
                }
            });
        }

        function isNotUsoProprioHomologadoRecusado(destinacaoTabela){
            return !isUsoProprioHomologado(destinacaoTabela) && !isUsoProprioRecusado(destinacaoTabela);
        }

        function isUsoProprioHomologado(destinacaoTabela){
            return destinacaoTabela.tipoDestinacao.id === 13 && destinacaoTabela.statusDestinacao.id === 1;
        }

        function isUsoProprioRecusado(destinacaoTabela){
            return destinacaoTabela.tipoDestinacao.id === 13 && destinacaoTabela.statusDestinacao.id === 2;
        }

        function caracteres(texto) {
            return caracteresEspeciaisService.retirarCaracteresEspeciais(texto);
        }

    }

})();
