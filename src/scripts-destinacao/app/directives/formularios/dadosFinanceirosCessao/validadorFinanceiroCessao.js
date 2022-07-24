(function () {
  angular
    .module('su-destinacao')
    .factory('validadorFinanceiroCessao', service);

  function service(mensagemDestinacaoService, $filter, moment, usuarioDestinacaoService) {

    var ID_MINIS_PLANEJAMENTO = 18;

    function validarValorTotalImovel (financeiro) {
      var valorTotal = financeiro.valorEntrada + financeiro.valorFinancidado;
      if (financeiro.valor != valorTotal) {
        var mensagem = $filter('translate')('msg-valor-total-imovel');
        mensagemDestinacaoService.mostrarMensagemError(mensagem);
        financeiro.valorEntrada = undefined;
        financeiro.valorFinancidado = undefined;
        throw mensagem;
      }

    }

    function validarDataInicioCobranca (dataInicioCobranca, dataAssinaturaContrato) {
      if (dataInicioCobranca < dataAssinaturaContrato) {
        var mensagem = $filter('translate')('msg-data-inicio-cobranca');
        mensagemDestinacaoService.mostrarMensagemError(mensagem);
        dataInicioCobranca = undefined;
        throw mensagem;
      }
    }

    function validarMesAno (mesAnoReajuste, dataInicioCobranca) {
      var anoCobranca = dataInicioCobranca.getYear();
      var mesCobranca = dataInicioCobranca.getMonth();
      var mes = parseInt(mesAnoReajuste.substring(0, 2));
      var ano = parseInt(mesAnoReajuste.substring(2, 6));

      if (mes < mesCobranca && ano < anoCobranca) {
        var mensagem = $filter('translate')('msg-primeiro-mes-reajuste');
        mensagemDestinacaoService.mostrarMensagemError(mensagem);
        mesAnoReajuste = undefined;
        throw mensagem;
      }
    }

    function preencherUltimoDiaMesVencimentoUsuarioMP (financeiro) {
      var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
      if (usuarioLogado.idOrganizacao == ID_MINIS_PLANEJAMENTO) {
        financeiro.dataInicioCobranca.setHours(0, 0, 0);
        if (financeiro.vencimentoMensal == undefined) {
          financeiro.vencimentoMensal = parseInt(moment(financeiro.dataInicioCobranca).add(1, 'months').endOf('month').format('DD'));
        }
      }
    }

    function verificaJurosMensal(financeiro) {
      try {
        return financeiro.tipoJurosMensal.id === 1;
      } catch (error) {
        return false;
      }

    }

    function verificaFormaPagamentoAvista (financeiro) {
      try {
        return financeiro.tipoPagamento.id === 1;
      } catch (error) {
        return false;
      }

    }

    function verificaTipoModalidade (licitacao) {
      try {
        return licitacao.tipoLicitacao.id === 1
          || licitacao.tipoLicitacao.id === 2
      } catch (error) {
        return true;
      }
    }

    function verificarMaisUmImovelInformado (destinacaoImoveis) {
      return destinacaoImoveis.length <= 1;
    }

    function verificarValorLaudoMenorValorLaudo (laudoAvaliacao, financeiro) {
      if (laudoAvaliacao.valor > financeiro.valor) {
        var mensagem = $filter('translate')('msg-valor-laudo-maior-valor-financeiro');
        mensagemDestinacaoService.mostrarMensagemError(mensagem);
        financeiro.valor = '';
        throw mensagem;
      }
    }

    return {
      validarValorTotalImovel: validarValorTotalImovel,
      validarDataInicioCobranca: validarDataInicioCobranca,
      validarMesAno: validarMesAno,
      preencherUltimoDiaMesVencimentoUsuarioMP: preencherUltimoDiaMesVencimentoUsuarioMP,
      verificaJurosMensal: verificaJurosMensal,
      verificaFormaPagamentoAvista: verificaFormaPagamentoAvista,
      verificaTipoModalidade: verificaTipoModalidade,
      verificarMaisUmImovelInformado: verificarMaisUmImovelInformado,
      verificarValorLaudoMenorValorLaudo: verificarValorLaudoMenorValorLaudo
    }

  }

})();
