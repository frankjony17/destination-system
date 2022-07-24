(function () {
  "use strict"
  angular.module("su-destinacao").controller('homologarUsoProprioController',homologarUsoProprioController);

  function homologarUsoProprioController (mensagemDestinacaoService, $filter, destinacaoService, $state, destinacaoEscopoCompartilhadoService) {
    var vm = this;

    var TIPO_DESTINACAO ='USO_PROPRIO';

    vm.gravar = gravar;
    vm.recusar = recusar;
    vm.fechar = fechar;
    var atribuirDados = function atribuirDados() {
        angular.forEach(function (foto) {
          foto.documentos = undefined;
        });
        vm.homologarUsoProprio.homologado = true;
        vm.homologarUsoProprio.id = vm.homologarUsoProprio.atendimento.id;
        vm.homologarUsoProprio.numeroAtendimento = vm.homologarUsoProprio.atendimento.numeroAtendimento;
        vm.homologarUsoProprio.numeroProcedimento = vm.homologarUsoProprio.atendimento.numeroProcesso;
        vm.homologarUsoProprio.codFundamentoLegal = vm.homologarUsoProprio.atendimento.codFundamentoLegal;
        vm.homologarUsoProprio.encargos = vm.homologarUsoProprio.atendimento.encargos;
        vm.homologarUsoProprio.responsaveis = vm.homologarUsoProprio.atendimento.responsaveis;
        vm.homologarUsoProprio.licitacao = vm.homologarUsoProprio.atendimento.licitacao;
        vm.homologarUsoProprio.financeiro = vm.homologarUsoProprio.atendimento.financeiro;
        vm.homologarUsoProprio.tipoDestinacao = vm.homologarUsoProprio.atendimento.tipoDestinacao;
        vm.homologarUsoProprio.statusDestinacao = vm.homologarUsoProprio.atendimento.statusDestinacao;
        vm.homologarUsoProprio.contrato = vm.homologarUsoProprio.atendimento.contrato;
        vm.homologarUsoProprio.fotos = vm.homologarUsoProprio.atendimento.fotos;

      };

    vm.arquivo = {};

    vm.homologarUsoProprio = {
      atendimento: {},
      fotos:[],
      documentos: [],
      finalidade: '',
      utilizacao: {},
      responsaveis: [],
      destinacaoImoveis: [],
      tipoDestinacaoEnum: TIPO_DESTINACAO
    };

    function init(){
      var id = destinacaoEscopoCompartilhadoService.getObjeto('destinacao').id;

      destinacaoService.buscaDestinacaoPorId(id, vm.homologarUsoProprio.tipoDestinacaoEnum).then(function (resposta)  {
        vm.homologarUsoProprio.atendimento = resposta.data.resultado;
        vm.homologarUsoProprio.atendimento.numeroProcedimento = resposta.data.resultado.numeroProcesso;

        vm.homologarUsoProprio.utilizacao = resposta.data.resultado.utilizacao;
        vm.homologarUsoProprio.utilizacao.dataUtilizacao = new Date(vm.homologarUsoProprio.utilizacao.dataUtilizacao);

        vm.homologarUsoProprio.destinacaoImoveis = resposta.data.resultado.destinacaoImoveis;
        vm.homologarUsoProprio.responsaveis = resposta.data.resultado.responsaveis;
        vm.homologarUsoProprio.fotos = resposta.data.resultado.fotos;

        angular.forEach(vm.homologarUsoProprio.fotos, function (foto) {
          foto.documento = foto.arquivo;
          foto.descricao = foto.arquivo.descricao;
          foto.data = new Date(foto.arquivo.data);
          foto.id = foto.arquivo.id;
          foto.nomeReal = foto.arquivo.nomeReal;
        });
       // vm.homologarUsoProprio.documentos = resposta.data.resultado.fotos;

      },  function (erro) {
        if (erro.data.erros) {
          mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
        }
      });

    }

    init();

    function gravar() {
      if (vm.form.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        return;
      } else if (vm.homologarUsoProprio.destinacaoImoveis.length == 0) {
        mensagemDestinacaoService.mostrarMensagemError("Não existe imovel para a destinação");
        return;
      }

      atribuirDados();

      destinacaoService.homologarUsoProprio(vm.homologarUsoProprio).then(function (resposta)  {
          mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
          $state.go('destinacao.consultarDestinacao');
      },  function (erro) {
          if (erro.data.erros) {
            mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
          }
      });

    }

    function recusar() {
      if (vm.form.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        return;
      } else if (vm.homologarUsoProprio.destinacaoImoveis.length == 0) {
        mensagemDestinacaoService.mostrarMensagemError("Não existe imovel para a destinação");
        return;
      }

      atribuirDados();

      destinacaoService.recusarUsoProprio(vm.homologarUsoProprio).then(function (resposta)  {
        mensagemDestinacaoService.mostrarMensagemSucesso(resposta.data.mensagens);
        $state.go('destinacao.consultarDestinacao');
      },  function (erro) {
        if (erro.data.erros) {
          mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
        }
      });

    }

    function fechar () {
      var mensagem = $filter('translate')('msg-confirmar-fechar');
      mensagemDestinacaoService.confirmar(mensagem, function () {
        $state.go('destinacao.consultarDestinacao');
      });

    }
  }
})();
