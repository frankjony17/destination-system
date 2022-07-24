(function () {
  "use strict";
  angular.module("su-destinacao").controller("AnaliseTecnicaController", analiseTecnicaController);

  function analiseTecnicaController(requerimentoDestinacaoService,
                                    destinacaoEscopoCompartilhadoService,
                                    mensagemDestinacaoService,
                                    analiseTecnicaService,
                                    arquivoService,
                                    AGUARDANDO_MANIFESTACAO_CHEFIA,
                                    AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE,
                                    AGUARDANDO_MANIFESTACAO_SECRETARIO,
                                    $filter,
                                    $state,
                                    usuarioDestinacaoService,
                                    validadorAnaliseTecnicaService,
                                    despachoService,
                                    dataUtilService) {

    var RASCUNHO = 2;
    var AGUARDANDO_ANALISE_TECNICA = 1;
    var PERMISSAO_ANALISE_TECNICO = 'DESTINACAO_EXEC_ANALISE_TEC_TECNICO';
    var PERMISSAO_ANALISE_SECRETARIO = 'DESTINACAO_EXEC_ANALISE_TEC_SECRETARIO';
    var PERMISSAO_ANALISE_CHEFIA = 'DESTINACAO_EXEC_ANALISE_TEC_CHEFIA';
    var PERMISSAO_ANALISE_SUPERINTENDENTE = 'DESTINACAO_EXEC_ANALISE_TEC_SUPERINTENDENTE';

    var vm = this;

    vm.analiseTecnica = {
      itensVerificacaoEspecifica: [],
      itensVerificacao: [],
      documentosAnaliseObrigatorio: [],
      documentosAnaliseComplementar: [],
      documentosComplementares: [],
      documentosComplementaresEspecificos: [],
      despachosTecnico: [],
      despachosChefia: [],
      despachosSuperintendente: [],
      despachosSecretario: [],
      tipoDestinacao: {},
      publicacao: {}
    };

    vm.documentosObrigatorios = [];
    vm.documentosComplementares = [];

    vm.informacaoComplementar = {arquivos: []};
    vm.informacaoComplementarEspecifico = {arquivos: []};

    vm.salvarRascunho = salvarRascunho;
    vm.visualizarDespachoChefia = visualizarDespachoChefia;
    vm.visualizarDespachoSuperintendente = visualizarDespachoSuperintendente;
    vm.visualizarDespachoSecretario = visualizarDespachoSecretario;
    vm.mostrarAnalise = mostrarAnalise;
    vm.fechar = fechar;

    vm.verificarPodeEditar = verificarPodeEditar;
    vm.verificarPodeEditarChefia = verificarPodeEditarChefia;

    vm.exibirDespachoChefia = exibirDespachoChefia;
    vm.exibirDespachoTecnico = exibirDespachoTecnico;
    vm.exibirDespachoSuperintendente = exibirDespachoSuperintendente;
    vm.verificarPodeEditarSuperintendente = verificarPodeEditarSuperintendente;
    vm.verificarPodeEditarSecretario = verificarPodeEditarSecretario;

    vm.exibirDadosPublicacaoDiario = exibirDadosPublicacaoDiario;

    vm.exibirBotaoRascunho = exibirBotaoRascunho;
    vm.exibirBotaoEnviarChefia = exibirBotaoEnviarChefia;
    vm.exibirBotaoEnviar = exibirBotaoEnviar;


    var init = function () {
      vm.requerimentoId = destinacaoEscopoCompartilhadoService.getObjeto("requerimentoId");
      vm.analiseTecnica.idRequerimento = vm.requerimentoId;
      vm.mostrarTriagem = false;
      buscarRequerimento();
      verificarSeExisteAnalise(vm.requerimentoId);
    };

    var verificarSeExisteAnalise = function (requerimentoId) {
      analiseTecnicaService.buscarAnalisePorRequerimento(requerimentoId).then(function (response) {
        if (response.data.resultado) {
          vm.analiseTecnica = response.data.resultado;
        }
      });
    };

    var buscarRequerimento = function () {
      requerimentoDestinacaoService.buscarRequerimento(vm.requerimentoId)
        .then(function (resposta) {
          vm.requerimento = resposta.data.resultado;
          carregarDocumentos();
          vm.mostrarAnalise(false);
        });
    };

    var carregarDocumentos = function () {
      if (vm.requerimento && vm.requerimento.servico) {
        angular.forEach(vm.requerimento.servico.documentos, function (item) {
          item.arquivos = [];
          if (item.tipo == "OBRIGATORIO") {
            carregarArquivos(vm.documentosObrigatorios, item);
          } else {
            carregarArquivos(vm.documentosComplementares, item);
          }
        });
      }
    };

    function carregarArquivos(documentos, item) {
      arquivoService.listarArquivosRequerimento(vm.requerimentoId, item.id).then(function (resposta) {
        item.arquivos = resposta.data.resultado;
        documentos.push(item);
      });
    }

    vm.salvarAnalise = function () {
      if (vm.formAnalise.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.formAnalise);
        return;
      }

      if (existeItensNaoSemJustificativa()) {
        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-itens-sem-anotacao'));
        return;
      }

      if (existeItenSimDesmarcado()) {
        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-inf-sim-nao-check-list'));
        return;
      }

      var permissao = usuarioDestinacaoService.getPermissaoAnaliseTecnica([PERMISSAO_ANALISE_TECNICO,
                                                                 PERMISSAO_ANALISE_SECRETARIO,
                                                                 PERMISSAO_ANALISE_CHEFIA,
                                                                 PERMISSAO_ANALISE_SUPERINTENDENTE]);

      if (!despachoService.verificarDespachoPreenchidoPermissao(vm.analiseTecnica, permissao)) {
        mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-despacho-nao-preenchido'));
        return;
      }
      //TODO verificar estrutura e classificar tipo item verificacao

      analiseTecnicaService.salvar(vm.analiseTecnica).then(function (resp) {
        var resposta = resp.data;
        if (resposta.resultado) {
          $state.go('destinacao.consultarAnaliseTecnica');
        } else if (resposta.erros) {
          mensagemDestinacaoService.mostrarMensagemError(resposta.erros);
        }
      });

    };

    function existeItensNaoSemJustificativa() {
      return validadorAnaliseTecnicaService
                        .existeItensNaoSemJustificativa(vm.analiseTecnica);
    }

    function existeItenSimDesmarcado() {
      return validadorAnaliseTecnicaService
                  .existeItenSimDesmarcado(vm.analiseTecnica);
    }

    function salvarRascunho() {
      analiseTecnicaService.salvarRascunho(vm.analiseTecnica).then(function (resp) {
        var resposta = resp.data;
        if (resposta.resultado) {
          mensagemDestinacaoService.mostrarMensagemSucesso($filter('translate')('msg-racunho-salvo'));
        } else if (resposta.erros) {
          mensagemDestinacaoService.mostrarMensagemError(resposta.erros);
        }
      });
    }

    function mostrarAnalise(button) {
      if (vm.requerimento.statusRequerimento !== "AGUARDANDO_ANALISE_TECNICA") {
        return vm.mostrarTriagem = true;
      } else if (button) {
        requerimentoDestinacaoService.alterarStatusRequerimento("EM_ANALISE_TECNICA", vm.requerimentoId);
        return vm.mostrarTriagem = true;
      }
    }

    function visualizarDespachoChefia() {
      return visualizarDespacho(AGUARDANDO_MANIFESTACAO_CHEFIA) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA);
    }

    function visualizarDespachoSuperintendente() {
      return visualizarDespacho(AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE);
    }

    function visualizarDespachoSecretario() {
      return visualizarDespacho(AGUARDANDO_MANIFESTACAO_SECRETARIO) && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO);
    }

    function visualizarDespacho(status) {
      try {
        return vm.analiseTecnica.statusAnaliseTecnica.id === status;
      } catch (error) {
        return false;
      }
    }

    function fechar() {
      if (!verificarPodeEditar()) {
        mensagemDestinacaoService.confirmar($filter('translate')('msg-fechar-sem-salvar'), function () {
          $state.go('destinacao.consultarAnaliseTecnica');
        });
      } else {
         $state.go('destinacao.consultarAnaliseTecnica');
      }

    }

    function verificarPodeEditar() {
      try {
        if (devolucaoTecnicoPodeEditar()) {
          return false;
        } else if (devolucaoChefiaPodeEditar()) {
          return false;
        } else if (devolucaoSuperintendentePodeEditar()) {
          return false;
        } else {
          return vm.analiseTecnica.id
            && vm.analiseTecnica.statusAnaliseTecnica.id !== RASCUNHO
            || vm.analiseTecnica.statusAnaliseTecnica.id == AGUARDANDO_ANALISE_TECNICA;
        }
      } catch (error) {
        return false;
      }
    }

    function devolucaoTecnicoPodeEditar() {
      if (vm.analiseTecnica.despachosTecnico.length > 0
              && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO)
              && vm.analiseTecnica.statusAnaliseTecnica.id == AGUARDANDO_ANALISE_TECNICA) {
        return true;
      } else {
        return false;
      }
    }

    function devolucaoChefiaPodeEditar() {
      if (vm.analiseTecnica.despachosTecnico.length === 0
            && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA)
            && vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_CHEFIA) {
        return true;
      } else {
        return false;
      }
    }

    function devolucaoSuperintendentePodeEditar() {
      if (vm.analiseTecnica.despachosChefia.length === 0
            && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE)
            && vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE
            && vm.analiseTecnica.despachosChefia.length === 0
            && vm.analiseTecnica.despachosTecnico.length === 0) {
        return true;
      } else {
        return false;
      }
    }

    function exibirDespachoChefia() {
      return (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO) && chefiaPossuiDespachos())
        || usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA)
        || (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE) && chefiaPossuiDespachos());
    }

    function chefiaPossuiDespachos() {
      try {
        return vm.analiseTecnica.despachoChefia.length > 0;
      } catch (error) {
        return false;
      }
    }

    function verificarPodeEditarChefia() {
      try {
        if (!usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA)) {
            return true;
        } else if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA)
                && (vm.analiseTecnica.statusAnaliseTecnica.id === RASCUNHO
                    || vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_CHEFIA
                    || vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA)) {
            return false;
        } else {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    function exibirDespachoTecnico() {
      return usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO);
    }

    function exibirDespachoSuperintendente() {
      return usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO)
        || usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE);
    }

    function verificarPodeEditarSuperintendente() {
      try {
          if (!usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE)) {
            return true
          } else if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE)
              && (vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE)
                || vm.analiseTecnica.statusAnaliseTecnica.id === RASCUNHO) {
            return false;
            //Habilita edição quando SUPERINTENDENTE efetua a analise antes do TECNICO e da CHEFIA
            // e tambem quando o SUPERINTENDENTE analisa apos o TECNICO.
          } else if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE)
              && (vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_CHEFIA
                    || vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA)) {
            return false;
          } else {
            return true;
          }
      } catch (error) {
        return false;
      }
    }

    function verificarPodeEditarSecretario() {
      try {
        if (!usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO)
              && vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_SECRETARIO) {
            return true;
        } else {
          return (vm.analiseTecnica.id
            && vm.analiseTecnica.statusAnaliseTecnica.id !== AGUARDANDO_MANIFESTACAO_SECRETARIO);
        }

      } catch (error) {
        return false;
      }
    }

    function exibirDadosPublicacaoDiario() {
      try {
        if (angular.isUndefined(vm.analiseTecnica.dataEnvioPublicacao) || vm.analiseTecnica.dataEnvioPublicacao === null) {
          return false;
        } else {
          var dataAtual = new Date();
          var dataEnvioPublicacao = new Date(vm.analiseTecnica.dataEnvioPublicacao);
          return dataUtilService.compareTo(dataAtual, dataEnvioPublicacao) == 1;
        }
      } catch (error) {
        return false;
      }
    }

    function exibirBotaoRascunho() {
        if (angular.isUndefined(vm.analiseTecnica.statusAnaliseTecnica)
              && usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO)) {
          return true;
        } else {
          return usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO)
              && vm.analiseTecnica.statusAnaliseTecnica.id === RASCUNHO
              && vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA;
        }

    }

    function exibirBotaoEnviarChefia() {
      try {
          if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO) &&
                  ((angular.isDefined(vm.analiseTecnica.statusAnaliseTecnica)
                      && vm.analiseTecnica.statusAnaliseTecnica.id === RASCUNHO)
                          || angular.isUndefined(vm.analiseTecnica.id))) {
            return true;
          } else if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO)
                      && vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA
                      && vm.analiseTecnica.despachosTecnico.length > 0) {
            return true;
          } else {
            return false;
          }

      } catch (error) {
        return false;
      }
    }

    function exibirBotaoEnviar() {
      try {
        if (angular.isUndefined(vm.analiseTecnica.id) && !usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_TECNICO)) {
          return true;
        } else if (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SECRETARIO)) {
          return vm.analiseTecnica.statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_SECRETARIO;
        } else {
          return (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_SUPERINTENDENTE) && exibirBotaoEnviarPerfilSuperintendente())
                 || (usuarioDestinacaoService.isPossuiPermissao(PERMISSAO_ANALISE_CHEFIA) && exibirBotaoEnviarPerfilChefia());
        }
      } catch(error) {
        return false;
      }
    }

    function exibirBotaoEnviarPerfilSuperintendente() {
      var statusAnaliseTecnica = vm.analiseTecnica.statusAnaliseTecnica;
      return statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA
              || statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_CHEFIA
              || statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_SUPERINTENDENTE;
    }

    function exibirBotaoEnviarPerfilChefia() {
      var statusAnaliseTecnica = vm.analiseTecnica.statusAnaliseTecnica;
      return statusAnaliseTecnica.id === AGUARDANDO_ANALISE_TECNICA
              || statusAnaliseTecnica.id === AGUARDANDO_MANIFESTACAO_CHEFIA;
    }

    init();

    destinacaoEscopoCompartilhadoService.setObjetos('tipoDestincacao', 'GESTAO_PRAIA');

    vm.tipoDestinacao = destinacaoEscopoCompartilhadoService.getObjeto('tipoDestincacao');

  }

})();
