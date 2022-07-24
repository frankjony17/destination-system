(function () {

  angular
    .module('su-destinacao')
    .directive('dadosUtilizacao',directive);

  function directive (subTipoUtilizacaoService, tipoUtilizacaoService, utilizacaoService,
                      caracteresEspeciaisService, atendimentoService, mensagemDestinacaoService, $q) {
    return {
      restrict: 'EA',
      scope: {utilizacao: '=',
              atendimento: '=',
              imoveis: '=',
              tipoDestinacao: '=',
              dadosResponsavel: '=?',
              bloquear: '=',
          responsaveis: '=?',
              editar: '='},
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosUtilizacao/templates/dadosUtilizacao.html',
      link: function ($scope, $element) {

        var tiposDestinacao = ['VENDA','PERMUTA','AFORAMENTO','INSCRICAO_DE_OCUPACAO'];
        var tipoDoacao = 'DOACAO';

        var descricaoOutro ='Outro (especificar)';

        $scope.textoBuscaTipo = '';
        $scope.textoBuscaSubTipo = '';
        $scope.textoBuscaEspecificacao = '';
        $scope.jaSelecionado = false;
        $scope.desabilitarCampos = false;
        $scope.mostrarLinkSei = false;
        $scope.utilizacao.areaServidor = 0;
        $scope.carregado = false;
        $scope.dataEfetivacao = undefined;


        $scope.calcularAreaPorServidor = calcularAreaPorServidor;
        $scope.novaEspecificacao = novaEspecificacao;
        $scope.apagarDescricao = apagarDescricao;
        $scope.filtraSubTipos = filtraSubTipos;
        $scope.filtraTipo = filtraTipo;
        $scope.atualizaTiposUtilizacao = atualizaTiposUtilizacao;
        $scope.atualizaSubTiposUtilizacao = atualizaSubTiposUtilizacao;
        $scope.caracteres = caracteres;
        $scope.buscarPorNumeroProcesso = buscarPorNumeroProcesso;
        $scope.montarLinkSei = montarLinkSei;

        function init() {
            if(($scope.bloquear == true && angular.isDefined($scope.utilizacao.dataEfetivacaoUtilizacao)) ||
                ($scope.editar == true && angular.isDefined($scope.utilizacao.dataEfetivacaoUtilizacao))) {
                $scope.utilizacao.dataEfetivacaoUtilizacao = new Date($scope.utilizacao.dataEfetivacaoUtilizacao);
            }
          $q.all([tipoUtilizacaoService.buscarTodosTiposUtilizacao(),
                  subTipoUtilizacaoService.buscarTodosSubtiposUtilizacao()]).then(function (retorno) {
            $scope.todosTiposUtilizacao = retorno[0].data.resultado;
            $scope.todosSubTiposUtilizacao = retorno[1].data.resultado;

            if(angular.isDefined($scope.utilizacao.especificacao)) {
              $scope.exibirTextAreaOutro = true;
              buscarEspecificacoes ($scope.utilizacao.tipoUtilizacao.id, $scope.utilizacao.novasEspecificacoes);
            }
            $scope.todosTiposUtilizacaoAux = angular.copy($scope.todosTiposUtilizacao);
            $scope.listaFiltradaSubTipoUtilizacao = angular.copy($scope.todosSubTiposUtilizacao);
            $scope.todosSubTipoUtilizacaoInicial = criarListaSubTipoInicial(angular.copy($scope.todosSubTiposUtilizacao),
                                                                            $scope.utilizacao.tipoUtilizacao);

            $scope.carregado = true;
          });
          if ($scope.editar === true || $scope.bloquear === true) {
             calcularAreaPorServidor();
          }
        }

        init();

        $scope.$watch('atendimento', function (newValue) {
          if (newValue && newValue.imovelUso && newValue.imovelUso.usoPrincipal) {
            var imovelUso = angular.copy(newValue.imovelUso);
            $scope.utilizacao.finalidade = imovelUso.descricaoUso;
            $scope.utilizacao.dataUtilizacao = imovelUso.dataUtilizacao;
            $scope.utilizacao.numeroFamiliasBeneficiadas = imovelUso.numeroFamilias;
            $scope.utilizacao.usoPrincipal = imovelUso.usoPrincipal;
            $scope.desabilitarCampos = true;
          } else {
            $scope.desabilitarCampos = false;
          }
        }, true);

        function buscarEspecificacoes (idTipoUtilizacao, novasEspecificacoes) {
          utilizacaoService.buscarEspecificacoes(idTipoUtilizacao).then(function (resposta) {
            $scope.especificacoes = removerDuplicados(resposta.data.resultado, novasEspecificacoes);
          });
        }

        function removerDuplicados(especificacoesRecuperadas, novasEspecificacoes) {
          if (angular.isDefined(novasEspecificacoes) && novasEspecificacoes.length > 0) {
            angular.forEach(novasEspecificacoes, function(novaEspecificacao) {
              if (!_.some(especificacoesRecuperadas, function (elem) {
                return elem === novaEspecificacao;
              })) {
                especificacoesRecuperadas.push(novaEspecificacao);
              }
            });
          }
          return especificacoesRecuperadas;
        }

        function calcularAreaPorServidor () {
          $scope.utilizacao.areaServidor = (calcularAreaConstruidaTotal() * 0.7) / $scope.utilizacao.numeroServidores ;
        }

        function calcularAreaConstruidaTotal() {
          var areaConstruida = 0;
          if ($scope.imoveis && $scope.imoveis.length > 0) {
            angular.forEach($scope.imoveis, function (destinacaoImovel) {
              var imovel = destinacaoImovel.imovel;
              areaConstruida += calcularAreaConstruidaBenfeitorias(imovel.benfeitorias);
            });
          }
          return areaConstruida;
        }

        function calcularAreaConstruidaBenfeitorias(benfeitorias) {
          var total = 0;
          if (angular.isDefined(benfeitorias)) {
            angular.forEach(benfeitorias, function(benfeitoria) {
              total += benfeitoria.areaConstruida;
            });
          }
          return total;
        }

        function desabilitaTiposUtilizacao(elemento) {
          if(elemento.id === 3 && verificaTipoDestinacao()){
            if($scope.tipoDestinacao === tipoDoacao && (angular.isUndefined($scope.atendimento.tipoDoacao) || $scope.atendimento.tipoDoacao.id !== 2)){
              return elemento;
            }
          }
          else if(elemento.id === 4 && ($scope.responsaveis.length === 0 || $scope.responsaveis[0].cpfCnpj.length !== 11)){
            return elemento;
          }
          else if(elemento.id !== 4){
            return elemento;
          }
        }

        function desabilitaSubTiposUtilizacao(elemento) {
          if(angular.isUndefined($scope.utilizacao.tipoUtilizacao) || $scope.utilizacao.tipoUtilizacao.id === 19){
            if(elemento.id === 52 && $scope.dadosResponsavel){
                if($scope.dadosResponsavel.responsaveis.length === 0 || $scope.dadosResponsavel.responsaveis[0].cpfCnpj.length !== 11){
                    return elemento;
                }
            }
            else if(elemento.id === 51 && $scope.dadosResponsavel){
                if($scope.dadosResponsavel.responsaveis.length === 0 || $scope.dadosResponsavel.responsaveis[0].cpfCnpj.length !== 14){
                    return elemento;
                }
            }
            else if(elemento.id === 47 && (angular.isUndefined($scope.imoveis) || verificaUFImoveis())){
              return elemento;
            }
            if(elemento.id !== 52 && elemento.id !== 51 && elemento.id !== 47){
              return elemento;
            }
          }
          else{
            return elemento;
          }
        }

        function verificaTipoDestinacao() {
          var cont = 0;
          angular.forEach(tiposDestinacao, function (tipo) {
            if(tipo === $scope.tipoDestinacao || $scope.tipoDestinacao === tipoDoacao){
              cont = cont+1;
            }
          });
          if(cont === 0){
            return false;
          }
          else {
            return true;
          }
        }

        function verificaUFImoveis(){
          var cont = 0;
          angular.forEach($scope.imoveis, function (destinacao) {
            if(destinacao.imovel.endereco.uf !== 'DF'){
              cont = cont+1;
            }
          });
          if(cont == 0){
            return true;
          }
          else{
            return false;
          }
        }

        function novaEspecificacao(){
          if($scope.textoBuscaEspecificacao !== ''){
            if(angular.isUndefined($scope.especificacoes)){
              $scope.especificacoes = [];
            }
            if ($scope.jaSelecionado) {
              if($scope.especificacoes.length-1 === 0){
                $scope.especificacoes = [];
              } else {
                $scope.especificacoes.splice(1,$scope.especificacoes.length-1);
              }
            }
            $scope.jaSelecionado = true;
            $scope.especificacoes.push($scope.textoBuscaEspecificacao);
            $scope.utilizacao.novasEspecificacoes = angular.copy($scope.especificacoes);
            $scope.utilizacao.especificacao = $scope.textoBuscaEspecificacao;
            $scope.textoBuscaEspecificacao = '';
          }
        }

        function criarListaSubTipoInicial(listaTodosSubTipos, tipoUtilizacao){
          var resultado = [];
          if (angular.isDefined(tipoUtilizacao)) {
            resultado = filtrarSubTipoUtilizacao(tipoUtilizacao.id);
          } else {
            resultado = listaTodosSubTipos.filter(function (elemento) {
              return elemento.descricao !== descricaoOutro;
            }).filter(desabilitaSubTiposUtilizacao);
          }

          return resultado;
        }

        function apagarDescricao () {
          $scope.utilizacao.finalidade = undefined;
        }


        function filtraSubTipos() {
          var idTipoSelecionado = $scope.utilizacao.tipoUtilizacao.id;
          if(angular.isDefined($scope.utilizacao.subTipoUtilizacao)) {
            if($scope.todosTiposUtilizacao.length !== 1) {
              if(angular.isDefined($scope.todosSubTiposUtilizacao)) {
                $scope.utilizacao.subTipoUtilizacao = undefined;
                $scope.listaFiltradaSubTipoUtilizacao = filtrarSubTipoUtilizacao(idTipoSelecionado);
              }
              $scope.todosSubTipoUtilizacaoInicial = $scope.listaFiltradaSubTipoUtilizacao;
            }
          } else {
            $scope.listaFiltradaSubTipoUtilizacao = filtrarSubTipoUtilizacao(idTipoSelecionado);
            $scope.todosSubTipoUtilizacaoInicial = $scope.listaFiltradaSubTipoUtilizacao;
          }
        }

        function filtrarSubTipoUtilizacao(idTipoSelecionado) {
          return $scope.todosSubTiposUtilizacao.filter(desabilitaSubTiposUtilizacao).filter(function (elemento) {
              return elemento.tipoUtilizacao.id === idTipoSelecionado;
            });
        }

        function filtraTipo() {
          var subTipo = $scope.utilizacao.subTipoUtilizacao;
          if (angular.isUndefined($scope.utilizacao.tipoUtilizacao)) {
            var tiposUtilizacao = $scope.todosTiposUtilizacao.filter(function (elemento) {
              return elemento.id === subTipo.tipoUtilizacao.id;
            });
            if (tiposUtilizacao.length > 0) {
              $scope.utilizacao.tipoUtilizacao = tiposUtilizacao[0];
              $scope.listaFiltradaSubTipoUtilizacao = filtrarSubTipoUtilizacao($scope.utilizacao.tipoUtilizacao.id);
              $scope.todosSubTipoUtilizacaoInicial = $scope.listaFiltradaSubTipoUtilizacao;
            }
          } else {
            if(angular.isDefined(subTipo)){
              if (subTipo.descricao.indexOf(descricaoOutro) === 0) {
                buscarEspecificacoes(subTipo.tipoUtilizacao.id, $scope.utilizacao.novasEspecificacoes);
                $scope.exibirTextAreaOutro = true;
              } else {
                $scope.exibirTextAreaOutro = false;
                $scope.utilizacao.especificacao = undefined;
              }
            }
          }

        }

        function atualizaTiposUtilizacao() {
          $scope.todosTiposUtilizacao = $scope.todosTiposUtilizacaoAux.filter(desabilitaTiposUtilizacao);
        }

        function atualizaSubTiposUtilizacao() {
            $scope.todosSubTipoUtilizacaoInicial = $scope.todosSubTipoUtilizacaoInicial.filter(desabilitaSubTiposUtilizacao);
        }

        function caracteres(texto) {
          return caracteresEspeciaisService.retirarCaracteresEspeciais(texto);
        }

        function buscarPorNumeroProcesso() {
          atendimentoService.buscarPorNumeroProcesso($scope.utilizacao.numeroProcesso).then(function (resposta) {
            if (resposta.data.resultado != null) {
              atendimentoService.verificarNumeroProcedimentoSei(resposta.data.resultado.idRequerimento,
                resposta.data.resultado.numeroProcedimento).then(function (resposta) {
                $scope.mostrarLinkSei = resposta.data.resultado;
              });
            } else {
              mensagemDestinacaoService.mostrarMensagemError(resposta.data.erros);
            }
          });
        }

        function montarLinkSei() {
          return 'https://www.google.com.br';
        }

        $scope.$watch('carregado', function(newValue) {
          if(newValue === true) {
            $element.find('input').on('keydown', function(ev) {
              ev.stopPropagation();
            });
          }
        });

      }
    }
  }


})();
