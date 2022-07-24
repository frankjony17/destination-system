(function () {
  angular
    .module('su-destinacao')
    .directive('dadosFinanceirosVenda', directive);

  function directive(validadorFinanceiroVenda, dominioService, imovelDestinacaoService, $q) {

    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosFinanceirosVenda/templates/dadosFinanceirosVenda.html',
      scope: {
        financeiro: '=',
        destinacaoImoveis: '=',
        licitacao: '=',
        laudoAvaliacao: '='
      },
      replace: true,
      link: function ($scope) {

        var TIPO_DOLAR = 1;
        var DOLAR = '$';
        var REAL = 'R$';
        var permiteEditar = false;

        $scope.tabelaImovel = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1
        };

        $scope.verificarMaisUmImovelInformado = verificarMaisUmImovelInformado;
        $scope.validarValorTotalImovel = validarValorTotalImovel;

        $scope.verificaTipoModalidade = verificaTipoModalidade;
        $scope.verificaFormaPagamentoAvista = verificaFormaPagamentoAvista;
        $scope.somarValorTotal = somarValorTotal;
        $scope.getValorTotal = getValorTotal;
        $scope.buscaTipoPagamento = buscaTipoPagamento;
        $scope.buscarTipoPeriodicidade = buscarTipoPeriodicidade;
        $scope.buscarTodosTipoMoeda = buscarTodosTipoMoeda;
        $scope.buscarJurosMensal = buscarJurosMensal;
        $scope.verificaJurosMensal = verificaJurosMensal;

        $scope.verificarImovelBrasil = verificarImovelBrasil;
        $scope.verificarValorLaudoMenorValorLaudo = verificarValorLaudoMenorValorLaudo;
        $scope.resetarValoresOriginais = resetarValoresOriginais;
        $scope.getFormatoMoeda = getFormatoMoeda;
        $scope.setarValorTotal = setarValorTotal;
        $scope.buscarTodasInstituicoesFinanceiras = buscarTodasInstituicoesFinanceiras;
        $scope.validaMesAno = validadorFinanceiroVenda.validaMesAno;

        function init() {
          buscaTipoPagamento();
          buscarTipoPeriodicidade();
          buscarTodosTipoMoeda();
          buscarTodosTipoReajuste();
          buscarJurosMensal();
          buscarTodasInstituicoesFinanceiras();
          buscarTodosLaudosAvaliacao();
        }

        init();

        function buscarJurosMensal() {
          dominioService.buscarTodosTipoJuros().then(function (resposta) {
            $scope.tipoJuro = resposta.data.resultado;
          })
        }
        function buscarTodosTipoReajuste() {
          dominioService.buscarTodosTipoReajuste().then(function (resposta) {
            $scope.tipoReajusteAnual = resposta.data.resultado;
          })
        }

        function buscarTodosTipoMoeda() {
          dominioService.buscarTodosTipoMoeda().then(function (resposta) {
            $scope.tiposMoedas = resposta.data.resultado;
          })
        }
        function buscarTodasInstituicoesFinanceiras() {
          dominioService.buscarTodasInstituicoesFinanceiras().then(function (resposta) {
            $scope.InstituicoesFinanceiras = resposta.data.resultado;

          })

        }

        function buscarTodosLaudosAvaliacao() {
          dominioService.buscarTodosLaudosAvaliacao().then(function (resposta) {
            $scope.laudoAvaliacao = resposta.data.resultado;

          })

        }

        function buscarTipoPeriodicidade() {
          dominioService.buscarTodosTipoPeriocidades().then(function (resposta) {
            $scope.tipoPeriocidade = resposta.data.resultado;
          })
        }

        function buscaTipoPagamento() {
          dominioService.buscarTodosTipoPagamentos().then(function(resposta){
            $scope.tipoPagamento = resposta.data.resultado;
          });
        }

        function verificaTipoModalidade() {
          return validadorFinanceiroVenda.verificaTipoModalidade($scope.licitacao);
        }

        function verificaFormaPagamentoAvista() {
          return validadorFinanceiroVenda.verificaFormaPagamentoAvista($scope.financeiro);
        }

        function verificaJurosMensal() {
          return validadorFinanceiroVenda.verificaJurosMensal($scope.financeiro);
        }

        function verificarMaisUmImovelInformado () {
          return validadorFinanceiroVenda.verificarMaisUmImovelInformado($scope.destinacaoImoveis);
        }

        function validarValorTotalImovel () {
          validadorFinanceiroVenda.validarValorTotalImovel($scope.financeiro);
        }

        function verificarImovelBrasil () {
          if ($scope.destinacaoImoveis.length == 1)
            return imovelDestinacaoService.verificaImovelNoBrasil($scope.destinacaoImoveis[0]);
          return true;
        }

        function verificarValorLaudoMenorValorLaudo () {
          if ($scope.laudoAvaliacao) {
            validadorFinanceiroVenda.verificarValorLaudoMenorValorLaudo($scope.laudoAvaliacao, $scope.financeiro);
          }
        }

        function resetarValoresOriginais () {
          var tipoPagamento = angular.copy($scope.financeiro.tipoPagamento);
          $scope.financeiro = {tipoPagamento: tipoPagamento};
          setarValorImovelCalcularTotal();
        }

        function somarValorTotal () {
          var total = 0;
          permiteEditar = true;
          angular.forEach($scope.destinacaoImoveis, function (destinacao) {
            total += destinacao.imovel.valor;
          });

          $scope.financeiro.valor = total;

        }

        function getValorTotal () {
          if ($scope.financeiro.valor) {
            return $scope.financeiro.valor;
          }
          return 0;
        }

        function getFormatoMoeda () {
          if ($scope.financeiro.tipoMoeda && $scope.financeiro.tipoMoeda.id === TIPO_DOLAR) {
            return DOLAR;
          }
          return REAL;
        }

        function setarValorTotal () {
          if ($scope.destinacaoImoveis.length == 1) {
            permiteEditar = true;
            $scope.destinacaoImoveis[0].imovel.valor = $scope.financeiro.valor;
          }
        }

        function setarValorImovelCalcularTotal () {
          $scope.financeiro.valor = 0;
          if ($scope.destinacaoImoveis.length == 1) {
            setarValorImovelCalcularTotalUmImovel();
            return;
          }

          setarValorImovelCalcularTotalMaisUmImovel();

        }

        function setarValorImovelCalcularTotalUmImovel () {
          if (validadorFinanceiroVenda.verificaTipoModalidade($scope.licitacao)) {
            $scope.financeiro.valor = angular.copy($scope.destinacaoImoveis[0].imovel.valorLaudo);
            $scope.laudoAvaliacao.valor = $scope.destinacaoImoveis[0].imovel.valorLaudo;
          } else {
            $scope.financeiro.valor = 0;
          }
        }

        function setarValorImovelCalcularTotalMaisUmImovel () {
          angular.forEach($scope.destinacaoImoveis, function (destinacaoImovel) {
            $scope.laudoAvaliacao.valor += destinacaoImovel.imovel.valorLaudo;
            if (validadorFinanceiroVenda.verificaTipoModalidade($scope.licitacao)) {
              destinacaoImovel.imovel.valor = angular.copy(destinacaoImovel.imovel.valorLaudo);
              $scope.financeiro.valor += destinacaoImovel.imovel.valor;
            } else {
              if (!permiteEditar) {
                destinacaoImovel.imovel.valor = 0;
                $scope.financeiro.valor = 0;
              }
            }
          });
        }

        $scope.$watch('licitacao.tipoLicitacao', function () {
          setarValorImovelCalcularTotal();
        });

        $scope.$watch('destinacaoImoveis', function () {
          if (permiteEditar) {
            permiteEditar = false;
            return;
          }
          $scope.laudoAvaliacao.valor = 0;
          var promisses = [];
          angular.forEach($scope.destinacaoImoveis, function (destinacaoImovel) {
            var imovel = destinacaoImovel.imovel;
            if ($scope.laudoAvaliacao.valor == 0) {
              promisses.push(imovelDestinacaoService.buscarValorAvaliacao(imovel.id));
            } else {
              $scope.laudoAvaliacao.valor += angular.copy(imovel.valorLaudo);
            }
          });

          $q.all(promisses).then(function (resposta) {
            if (resposta.length > 0) {
              angular.forEach(resposta, function (item) {
                angular.forEach($scope.destinacaoImoveis, function (destinacaoImovel) {
                  if (item.data.resultado.id == destinacaoImovel.imovel.id) {
                    destinacaoImovel.imovel.valorLaudo = angular.copy(item.data.resultado.valorLaudo);
                    //$scope.laudoAvaliacao.valor += angular.copy(item.data.resultado.valorLaudo);
                  }
                });
              });
            }
          });
          setarValorImovelCalcularTotal();
        }, true);

      }

    };
  }

})();
