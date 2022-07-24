(function () {

  angular
    .module('su-destinacao')
    .directive('procurarDadosImovel', directive);

  function directive(imovelDestinacaoService, mensagemDestinacaoService, usuarioDestinacaoService, $window, procurarDadosImovelService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/procurarDadosImovel/templates/procurarDadosImovel.html',
      scope: {
        destinacao: '=',
        tipoDestinacao: '=',
        idModalidade:'=',
        bloquear:'=',
        editar:'='
      },
      link: function ($scope) {

        var rip = '';
        var codigoUtilizacao = '';
        var sequencialParcela = '';


        $scope.selecionarImovel = selecionarImovel;
        $scope.selecionarImovelPosseInformal = selecionarImovelPosseInformal;
        $scope.selecionarImovelFuncional = selecionarImovelFuncional;
        $scope.separarRipUtilizacaoParcela = separarRipUtilizacaoParcela;
        $scope.abrirDetalharParcela = abrirDetalharParcela;
        $scope.botaoImovelObrigatorio = botaoImovelObrigatorio;

        initEditarOuDetalhar();


        $scope.tabelaDestinacao = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };
        var vm = this;
        vm.iniciaDadosDestinacaoImovel = iniciaDadosDestinacaoImovel;

        function selecionarImovel() {
          separarRipUtilizacaoParcela();
          if($scope.idModalidade !== undefined){
          imovelDestinacaoService.consultarPorRipCUEM(rip, codigoUtilizacao, sequencialParcela, $scope.tipoDestinacao,$scope.idModalidade)
            .then(function (resposta) {
              getRespostaConsultaImovel(resposta);
            }, function (error) {
              mensagemDestinacaoService.mostrarMensagemError(error.data.erros[0]);
            });
          }else{
            mensagemDestinacaoService.mostrarMensagemError('Selecione a modalidade')
          }
        }

        function selecionarImovelFuncional() {
            separarRipUtilizacaoParcela();
            imovelDestinacaoService.consultarPorRip(rip, $scope.tipoDestinacao).then(function (resposta) {
                getRespostaConsultaImovel(resposta);
            },function (error) {
                mensagemDestinacaoService.mostrarMensagemError(error.data.erros[0]);
            });

        }

        function selecionarImovelPosseInformal() {
          separarRipUtilizacaoParcela();
          imovelDestinacaoService.consultarDadosPosseInformal(rip, codigoUtilizacao, sequencialParcela)
            .then(function (resposta) {
              var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
              if(usuarioLogado.jurisdicoes.indexOf(resposta.data.resultado.endereco.uf) !== -1){
                $scope.destinacao.destinacaoImoveis = [];
                $scope.destinacao.destinacaoImoveis.push({imovel: procurarDadosImovelService.prepararDadosDestinacao(resposta.data.resultado)});
              }
              else{
                mensagemDestinacaoService.mostrarMensagemError("Código da utilização inválido");
                $scope.codigoUtilizacao = undefined;
              }
            }, function (error) {
              if((error.data.erros && error.data.erros.length > 0)){
                mensagemDestinacaoService.mostrarMensagemError("Código da utilização inválido");
                $scope.codigoUtilizacao = undefined;
              }
            })
        }

        function initEditarOuDetalhar() {
          if(($scope.bloquear || $scope.editar) && $scope.tipoDestinacao == 'CUEM'){
            prepararImovelEdicao();
          }
        }

        function prepararImovelEdicao() {
          $scope.destinacao.imovel = $scope.destinacao.destinacaoImoveis[0].imovel;
          somarAreasBenfeitorias($scope.destinacao.imovel.benfeitorias);
          $scope.destinacao.imovel.totalAreaConstruida = $scope.totalAreaConstruida;
          $scope.destinacao.mostrarDadosImovel = true;
          $scope.destinacao.destinacoes = angular.copy($scope.destinacao.imovel.destinacoes);
          $scope.destinacao.imovel.destinacoes = undefined;
        }

        function separarRipUtilizacaoParcela() {
          rip = $scope.codigoUtilizacao.substring(0, 8);
          codigoUtilizacao = $scope.codigoUtilizacao.substring(9, 13);
          sequencialParcela = 'P' + parseInt($scope.codigoUtilizacao.substring(14, 16));
        }

        function getRespostaConsultaImovel(resposta) {
          if (resposta.data.erros && resposta.data.erros.length > 0) {
            mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
              $scope.destinacao.imovel.rip = '';
          } else if (resposta.data.mensagens && resposta.data.mensagens.length > 0) {
            mensagemDestinacaoService.mostrarMensagemError(resposta.data.mensagens);
          } else {
            $scope.destinacao.imovel = resposta.data.resultado;
            somarAreasBenfeitorias($scope.destinacao.imovel.benfeitorias);
            $scope.destinacao.imovel.totalAreaConstruida = $scope.totalAreaConstruida;
            $scope.destinacao.mostrarDadosImovel = true;
            $scope.destinacao.destinacaoImoveis.push({imovel: $scope.destinacao.imovel});
            $scope.destinacao.destinacoes = angular.copy($scope.destinacao.imovel.destinacoes);
            $scope.destinacao.imovel.destinacoes = undefined;

          }
        }

        function abrirDetalharParcela() {
          var url = '#/incorporacao/imovel/';
          $window.open(url+ '/detalharImovel/' + $scope.destinacao.destinacaoImoveis[0].imovel.idCadastroImovel,'_blank');
        }

        function getCompoDadosUtilizacaoImovel () {
          $scope.dadosUtilizacaoImovel = $scope.destinacaoImovel.imovel.rip + '' + $scope.destinacaoImovel.imovel.codigoUtilizacao + '' + $scope.destinacaoImovel.imovel.parcela.sequencial;
        }

        function iniciaDadosDestinacaoImovel () {
          $scope.exibirDadosImovel = true;
          formatarSequencialImovel( $scope.destinacaoImovel.imovel);
          getCompoDadosUtilizacaoImovel();
          $scope.listaArquivosPreview =  $scope.destinacaoImovel.documentos ?  $scope.destinacaoImovel.documentos : [];
        }

        function formatarSequencialImovel(imovel) {
          var digitos = imovel.parcela.sequencial.substring(1, imovel.parcela.sequencial.length);
          $scope.destinacaoImovel.imovel.parcela.sequencial = 'P' + new Array(Math.max(4 - String(digitos).length + 1, 0)).join(0) + digitos;
        }

        function somarAreasBenfeitorias(benfeitorias) {
          $scope.totalAreaConstruida = 0;
          $scope.totalAreaDisponivel = 0;
          $scope.totalAreaUtilizar = 0;

          if (angular.isDefined(benfeitorias)) {
            angular.forEach(benfeitorias, function (benfeitoria) {
              $scope.totalAreaConstruida += benfeitoria.areaConstruida;
              $scope.totalAreaDisponivel += benfeitoria.areaDisponivel;

              if (angular.isDefined(benfeitoria.areaUtilizar)) {
                $scope.totalAreaUtilizar += benfeitoria.areaUtilizar;
              }

            });
          }
        }
        function botaoImovelObrigatorio() {
          if ($scope.bloquear || $scope.editar){
            return false
          }else if(angular.isDefined($scope.destinacao.imovel)){
            return false
          }else{
            return true
          }
        }


      }
    };
  }


})();
