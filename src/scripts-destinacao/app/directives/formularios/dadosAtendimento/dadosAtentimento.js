(function () {

  angular
    .module('su-destinacao')
    .directive('dadosAtendimento', directive);

  function directive(atendimentoService, mensagemDestinacaoService, $rootScope, dominioService, destinacaoEscopoCompartilhadoService, $filter,$state, consultaDestinacaoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosAtendimento/templates/dadosAtendimento.html',
      scope: {
        atendimento: '=',
        tipoDestinacao: '=',
        bloquear: '=',
        editar: '=',
        financeiro: '=',
        destinacaoTransito: '='
      },
      replace: true,
      link: function ($scope) {
        $scope.tiposDoacoes = [{id: 1, descricao: 'Com Encargo'}, {id: 2, descricao: 'Sem Encargo'}];

        $scope.buscarNumeroAtendimento = buscarNumeroAtendimento;
        $scope.buscarNumeroProcesso = buscarNumeroProcesso;
        $scope.buscarInstrumento = buscarInstrumento;
        $scope.tipoCDRU = tipoCDRU;
        $scope.tipoDoacao = tipoDoacao;
        $scope.tipoCuem = tipoCuem;
        $scope.buscarModalidade = buscarModalidade;
        $scope.buscarConcessao = buscarConcessao;
        $scope.buscarHistorico = buscarHistorico;

        $scope.verificaTipoModalidade = verificaTipoModalidade;
        $scope.tipoUsoProprio = tipoUsoProprio;
        $scope.titulo = $rootScope.paginaAtual;
        $scope.atualizaAtendimentoEscopoCompartilhado = atualizaAtendimentoEscopoCompartilhado;
        $scope.limparFinanceiro = limparFinanceiro;
        $scope.tipoCessaoOnerosa = tipoCessaoOnerosa;
        $scope.limparEnvolvePagamento = limparEnvolvePagamento;
        $scope.tipoTransferencia = tipoTransferencia;
        $scope.selecionarHisoricoDestinacao = selecionarHisoricoDestinacao;

        $scope.historicoDestinacao = {};

        var condicaoHistorico = 0;

        function init() {
            $scope.buscarModalidade();
            $scope.buscarConcessao();
            $scope.buscarInstrumento();
            destinacaoEscopoCompartilhadoService.getObjeto('fundamentoLegal');
            $scope.destinacaoTransito.encargos = [];
            $scope.historicoDestinacao = angular.copy($scope.destinacaoTransito);

            buscarHistorico();
        }


        init();

        function buscarNumeroAtendimento () {
          if($scope.atendimento != undefined && $scope.atendimento.numeroAtendimento!= undefined){
            atendimentoService.buscarPorNumeroAtendimento($scope.atendimento.numeroAtendimento).then(function (resposta) {
                if (resposta.data.resultado != null) {
                  angular.extend($scope.atendimento, resposta.data.resultado);
                  destinacaoEscopoCompartilhadoService.setObjetos('atendimento', $scope.atendimento);
                } else {
                  mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
                  var numeroAtendimento = angular.copy($scope.atendimento.numeroAtendimento);
                  limpar();
                  $scope.atendimento.numeroAtendimento = numeroAtendimento;
                  destinacaoEscopoCompartilhadoService.setObjetos('atendimento', $scope.atendimento);
                }
              }
            );
          }
        }

        function buscarNumeroProcesso () {
          if($scope.atendimento != undefined && $scope.atendimento.numeroProcedimento!= undefined) {
            atendimentoService.buscarPorNumeroProcesso($scope.atendimento.numeroProcedimento).then(function (resposta) {
                if (resposta.data.resultado != null) {
                  angular.extend($scope.atendimento, resposta.data.resultado);
                  destinacaoEscopoCompartilhadoService.setObjetos('atendimento', $scope.atendimento);
                } else {
                  mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
                  var numeroProcedimento = angular.copy($scope.atendimento.numeroProcedimento);
                  limpar();
                  $scope.atendimento.numeroProcedimento = numeroProcedimento;
                }
              }
            );
          }
        }

        function atualizaAtendimentoEscopoCompartilhado(){
          destinacaoEscopoCompartilhadoService.setObjetos('atendimento', $scope.atendimento);
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
          addRotasInstrumentos(11, 'destinacao.transferenciaTitularidade');
          addRotasInstrumentos(10, 'destinacao.termoEntrega');
          addRotasInstrumentos(14, 'destinacao.permissaoUsoImovelFuncional');
      }

      function selecionarHisoricoDestinacao(destinacao) {
          var idDestinacao = null;
          consultaDestinacaoService.buscarEncargos(destinacao.id).then(function(resposta){
              $rootScope.listaComEncargos = resposta.data.resultado;
              $rootScope.initEncargo.init();
          });

          if (condicaoHistorico === 0) {
              condicaoHistorico++;
          } else {

              $rootScope.autalizaEncargos();

              consultaDestinacaoService.buscarListaHistorico($scope.destinacaoTransito.tipoDestinacao.id,
                  destinacao.id,
                  destinacao.versaoDestinacao).then(function (resposta) {

                  $scope.destinacao = resposta.data.resultado[0];

                  $scope.destinacaoTransito.dataInicioFundamento = new Date(destinacao.dataInicioFundamento);
                  $scope.destinacaoTransito.dataFinalFundamento  = new Date(destinacao.dataFinalFundamento);
                  $scope.destinacao.atoAutorizativo = $scope.historicoDestinacao.atoAutorizativo;
                  $scope.destinacao.codFundamentoLegal = $scope.historicoDestinacao.codFundamentoLegal;

                  $scope.historicoDestinacao = $scope.destinacao;


                  destinacaoEscopoCompartilhadoService.setObjetos('destinacao', {id: $scope.destinacao .id, detalhar: true});
                  var pai = destinacaoEscopoCompartilhadoService.getObjeto('controlerPai');
                  if (pai) {
                      pai.init();
                  }
                  if($rootScope.encargosList.length == 0){
                      $rootScope.initEncargo.init();
                  }
              });
          }
      }

      function buscarModalidade() {
          dominioService.buscarTodosTipoModalidade().then(function (resposta) {
                if (resposta.data.resultado != null) {
                  $scope.tiposModalidades = resposta.data.resultado
                } else {
                  mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
                }
          });
      }

        function verificaTipoModalidade() {
              try {
                  return $scope.atendimento.tipoInstrumento.id == 2;
              } catch (error) {
                return false;
              }

        }

        function buscarInstrumento() {
          dominioService.buscarTodosTiposInstrumento().then(function (resposta) {
            if (resposta.data.resultado != null) {
              $scope.tiposInstrumento = resposta.data.resultado
            } else {
              mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);

            }
          });
        }

        function buscarConcessao() {
          dominioService.buscarTodosTiposConcessao().then(function (resposta) {
            if (resposta.data.resultado != null) {
              $scope.tiposConcessoes = resposta.data.resultado;
            } else {
              mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
            }
          });
        }

        function buscarHistorico(){

            if($scope.destinacaoTransito.tipoDestinacao) {
                $scope.atendimento.versaoHistorico = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('versaoHistorico'));
                $scope.historicosDestinacao = [];
                consultaDestinacaoService.buscarListaVersoesDestinacoes($scope.destinacaoTransito.tipoDestinacao.id, $scope.destinacaoTransito.destinacaoImoveis[0].imovel.rip).then(function (resposta) {
                    $scope.historicosDestinacao = resposta.data.resultado;

                    angular.forEach($scope.historicosDestinacao, function (destinacao, id) {
                        destinacao.descricao = 'Versão ' + destinacao.versaoDestinacao + ' - ' + destinacao.dataHistoricoFormatada;
                    });

                    $rootScope.autalizaEncargos();
                });
            }
        }

        function tipoCuem () {
          return $scope.tipoDestinacao === 'CUEM';
        }

        function tipoDoacao () {
          return $scope.tipoDestinacao === 'DOACAO';
        }

        function tipoCDRU () {
          return $scope.tipoDestinacao === 'CDRU';
        }
        function tipoCessaoOnerosa() {
            return $scope.tipoDestinacao ==='CESSAO_ONEROSA'
        }
        function tipoUsoProprio () {
          return $scope.tipoDestinacao ==='USO_PROPRIO';
        }

          function tipoTransferencia () {
              return $scope.tipoDestinacao ==='TRANSFERENCIA';
          }

        function limpar() {
          $scope.atendimento.numeroProcedimento = undefined;
          $scope.atendimento.numeroAtendimento = undefined;
        }

        function limparFinanceiro() {
          $scope.financeiro = {};
        }

        function limparEnvolvePagamento() {
            $scope.atendimento.envolvePagamento = undefined;
        }

      }
    };
  }


})();
