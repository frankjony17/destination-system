(function(){
    "use strict";
    angular.module("su-destinacao").controller("CriarParcelaController", CriarParcelaController);

    function CriarParcelaController(arquivoService,parcelaService, mensagemDestinacaoService,
                                    imovelDestinacaoService,
                                    destinacaoEscopoCompartilhadoService,
                                    $mdDialog,
                                    $state,
                                    $filter,
                                    $window) {

      var vm = this;

      vm.tabelaTodasParcelas = {
        limit: 5,
        limitsPage: [5, 10, 15],
        page: 1
      };

      vm.tabelaParcelasCanceladas = {
        limit: 5,
        limitsPage: [5, 10, 15],
        page: 1
      };

      vm.todasParcelas = [];
      vm.exibirParcelasCanceladas = false;
      vm.modoEdicao = false;

      vm.abrirDetalharImovel = abrirDetalharImovel;
      vm.limpar = limpar;
      vm.salvarAtualizar = salvarAtualizar;
      vm.formatarAreaConstruida = formatarAreaConstruida;
      vm.abrirModalExcluir = abrirModalExcluir;
      vm.selecionarParcela = selecionarParcela;
      vm.buscarParcelasInativas = buscarParcelasInativas;
      vm.redimencionarParcela = redimencionarParcela;
      vm.criarNovaParcelaApartirDesta = criarNovaParcelaApartirDesta;
      vm.editar = editar;
      vm.fechar = fechar;

      init();

      function init() {
        iniciarDadosParcela();
        vm.ripUtilizacao = destinacaoEscopoCompartilhadoService.getObjeto("ripUtilizacao");
        vm.buscarParcelasDestinacas = imovelDestinacaoService.buscarParcelasDestinacas

        buscarDadosRipUtilizacao(vm.ripUtilizacao);

      }

      function iniciarDadosParcela() {
        vm.parcelaNova = {
          benfeitorias: [],
          arquivos: [],
          checkboxAll: false,
          arquivosExcluir: []
        };

        vm.parcelaRemanescente = {
          benfeitorias: [],
          arquivos: [],
          checkboxAll: false
        };

      }

      function buscarDadosRipUtilizacao(rip) {
        vm.modoEdicao = false;
        imovelDestinacaoService.buscarDadosRipUtilizacao(rip).then(function (resposta) {
          vm.dadosRipUtilizacao = resposta.data.resultado;
          getParcelaUnica();
          montarListaTodasParcelas();
        });
      }

      function getParcelaUnica() {
        var parcelas = vm.dadosRipUtilizacao.parcelas;
        if (parcelas.length === 1) {
          vm.parcelaSelecionada = parcelas[0];
          vm.parcelaNova.benfeitorias = angular.copy(vm.parcelaSelecionada.benfeitorias);
        }
      }

      function selecionarParcela() {
          vm.parcelaNova.benfeitorias = angular.copy(vm.parcelaSelecionada.benfeitorias);
      }

      function abrirDetalharImovel() {
        var url = destinacaoEscopoCompartilhadoService.getUrlsPorAmbiente();
        var urlDetalhar = url.cadastroImoveis + '#/detalharImovel/' + vm.dadosRipUtilizacao.idCadastroImovel;
        $window.open(urlDetalhar,'_blank');
      }

      function montarListaTodasParcelas() {
            var parcelas = vm.dadosRipUtilizacao.parcelas;
            vm.todasParcelas = montarListaParcelas(parcelas);
      }

      function limpar() {
        iniciarDadosParcela();
        vm.parcelaSelecionada = undefined;
        getParcelaUnica();
        vm.modoEdicao = false;
      }

      function verificarCamposObrigatoriosPreenchidos() {
        if (vm.criarParcela.$invalid) {
            mensagemDestinacaoService.mostrarCamposInvalidos(vm.criarParcela);
            throw 'Preencher campos obrigatorios';
          }
      }

      function salvarAtualizar() {
        if (vm.modoEdicao === true) {
          atualizar();
        } else {
          salvar();
        }
      }

      function atualizar() {
        verificarCamposObrigatoriosPreenchidos();
        parcelaService.editar(vm.parcelaNova).then(function(resposta) {
          mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
            $state.go($state.current, {}, {reload: false});
            vm.todasParcelas = [];
            buscarDadosRipUtilizacao(vm.ripUtilizacao);
            limpar();
        });
      }

      function salvar() {
          verificarCamposObrigatoriosPreenchidos();

          vm.benfeitoriasNovasParcelas = angular.copy(vm.parcelaNova.benfeitorias);
          vm.benfeitoriasParcelasRemanecentes = angular.copy(vm.parcelaRemanescente.benfeitorias);

          vm.parcelaNova.benfeitorias = getBenfeitoriasSelecionadas(vm.parcelaNova.benfeitorias);
          vm.parcelaRemanescente.benfeitorias = getBenfeitoriasSelecionadas(vm.parcelaRemanescente.benfeitorias);
          setDadosImovelDestinacao(vm.dadosRipUtilizacao.id, vm.parcelaSelecionada.idDestinacaoImoveis);
          setDadosParcelaInativar(vm.parcelaSelecionada.id)
          var parcelas = [vm.parcelaNova, vm.parcelaRemanescente];

          parcelaService.salvar(parcelas).then(function () {
            mensagemDestinacaoService.mostrarMensagemSucesso("Parcela Criada com sucesso!");
            $state.go($state.current, {}, {reload: false});
            vm.todasParcelas = [];
            buscarDadosRipUtilizacao(vm.ripUtilizacao);
            limpar();
          }, function () {
               vm.parcelaNova.benfeitorias = vm.benfeitoriasNovasParcelas;
               vm.parcelaRemanescente.benfeitorias = vm.benfeitoriasParcelasRemanecentes;
          });

      }

      function getBenfeitoriasSelecionadas(benfeitorias) {
        return benfeitorias.filter(function(benfeitoria) {
            return benfeitoria.selecionado === true;
        });
      }

      function setDadosImovelDestinacao(idImovel, idDestinacaoImoveis) {
          vm.parcelaNova.idImovel = idImovel;
          vm.parcelaNova.idDestinacaoImoveis = idDestinacaoImoveis;
          vm.parcelaRemanescente.idImovel = idImovel;
          vm.parcelaRemanescente.idDestinacaoImoveis = idDestinacaoImoveis;
      }

      function setDadosParcelaInativar(idParcelaInativar) {
          vm.parcelaRemanescente.idParcelaInativar = idParcelaInativar;
          vm.parcelaNova.idParcelaInativar = idParcelaInativar;
      }

      function formatarAreaConstruida(areaConstruida) {
          if (areaConstruida) {
            return $filter('number')(areaConstruida, 2);
          }
          return '-';
      }

      function abrirModalExcluir(parcela) {

        vm.listaModal = [];
        var index = findIndex(parcela);

        vm.parcelaModal = angular.copy(parcela);
        vm.listaModal = angular.copy(vm.todasParcelas);
        vm.listaModal.splice(index, 1);

        limpar();
        $mdDialog.show({
          controller: 'ExcluirParcelaController',
          controllerAs: 'excluirParcelaCtrl',
          templateUrl: 'scripts-destinacao/pages/parcelas/views/partial/view/modal-excluir-parcela.html',
          clickOutsideToClose: true,
          locals: {
            parcelaModal: vm.parcelaModal,
            benfeitorias: filtrarBenfeitorias(parcela),
            rip: vm.ripUtilizacao,
            idDestinacaoImoveis: getIdDestinacaoImoveis(vm.dadosRipUtilizacao.parcelas)
          }
        }).then(function () {
          vm.todasParcelas = [];
          buscarDadosRipUtilizacao(vm.ripUtilizacao);
          limpar();
        });
      }

      function findIndex(parcela) {
        return vm.todasParcelas.findIndex(function (element) {
            return parcela.sequencial === element.sequencial;
        });
      }

      function getIdDestinacaoImoveis(parcelas) {
        var idDestinacaoImoveis = undefined;
        for (var i = 0; i < parcelas.length; i++) {
            if (parcelas[i].idDestinacaoImoveis) {
                idDestinacaoImoveis = parcelas[i].idDestinacaoImoveis;
            }
        }
        return idDestinacaoImoveis;
      }

      function filtrarBenfeitorias(parcelaSelecionada) {

        var benfeitoriasFiltradas = [];

        angular.forEach(vm.dadosRipUtilizacao.parcelas, function (parcela) {
            if(parcela.sequencial === parcelaSelecionada.sequencial.trim()) {
                angular.forEach(parcela.benfeitorias, function (benfeitoria) {
                    if(benfeitoria.codigo !== null){
                        benfeitoriasFiltradas.push(benfeitoria);
                    }
                });
            }
        });
        return benfeitoriasFiltradas;
      }

      function buscarParcelasInativas() {
          vm.exibirParcelasCanceladas = !vm.exibirParcelasCanceladas;
          if (vm.exibirParcelasCanceladas === true) {
            parcelaService.buscarParcelasInativas(vm.dadosRipUtilizacao.rip).then(function(resposta) {
                vm.parcelasCanceladas = montarListaParcelas(resposta.data.resultado);
                if (vm.parcelasCanceladas.length === 0) {
                  mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-nao-existe-parcelas-canceladas'));
                }
            });
          }
      }

      function montarListaParcelas(parcelas) {
            var parcelasTratadas = [];
            var dadoListaParcela = {};
            angular.forEach(parcelas, function (parcela) {
                dadoListaParcela.sequencial = parcela.sequencial;
                dadoListaParcela.areaTerreno = parcela.areaTerreno;
                dadoListaParcela.id = parcela.id;
                dadoListaParcela.utilizada = parcela.utilizada;
                angular.forEach(parcela.benfeitorias, function (benfeitoria, index) {

                    if (index === 0) {
                        dadoListaParcela.codigo = benfeitoria.codigo;
                        dadoListaParcela.codigoEspecificacao = benfeitoria.codigo + ' - ' + benfeitoria.especializacao;
                        dadoListaParcela.areConstruidaBenfeitoria = getAreaBenfeitoriaEdificacao(benfeitoria);
                        dadoListaParcela.memorialDescritivo = parcela.memorialDescritivo;
                    } else {
                        dadoListaParcela.codigoEspecificacao = concat(dadoListaParcela.codigoEspecificacao, benfeitoria.codigo, benfeitoria.especializacao);
                        if (benfeitoria.codigo.substring(0, 1) === 'E') {
                          dadoListaParcela.areConstruidaBenfeitoria = dadoListaParcela.areConstruidaBenfeitoria + benfeitoria.areaConstruida;
                        }
                    }
                });
                parcelasTratadas.push(dadoListaParcela);
                dadoListaParcela = {};
            });

          return parcelasTratadas;
      }

      function concat(codigoEspecificacao, codigo, especializacao) {
        return codigoEspecificacao + ', ' + codigo + ' - ' + especializacao;
      }

      function getAreaBenfeitoriaEdificacao(benfeitoria) {
          if (benfeitoria.codigo.substring(0, 1) === 'E') {
            return benfeitoria.areaConstruida;
          }
          return 0;
      }

      function redimencionarParcela() {

          destinacaoEscopoCompartilhadoService.setParcelas("parcelas",vm.dadosRipUtilizacao);

          $state.go('destinacao.redimensionarParcelaImovel');
      }

      function criarNovaParcelaApartirDesta(parcela) {
        iniciarDadosParcela();
        var index = findIndex(parcela);
        vm.parcelaSelecionada = vm.dadosRipUtilizacao.parcelas[index];
        vm.parcelaSelecionada.ultimaParcelaCriada = vm.dadosRipUtilizacao.ultimaParcelaCriada;
        vm.parcelaNova.benfeitorias = angular.copy(vm.parcelaSelecionada.benfeitorias);
        vm.modoEdicao = false;
      }

      function editar(parcela) {

        var index = findIndex(parcela);
        vm.parcelaNova = angular.copy(vm.dadosRipUtilizacao.parcelas[index]);
        vm.parcelaSelecionada = undefined;
        if (angular.isUndefined(vm.parcelaNova.arquivosExcluir) || vm.parcelaNova.arquivosExcluir === null) {
          vm.parcelaNova.arquivosExcluir = [];
        }

        vm.modoEdicao = true;
      }

      function fechar() {
          $state.go("destinacao.parcelaImovel");
      }

    }
})();
