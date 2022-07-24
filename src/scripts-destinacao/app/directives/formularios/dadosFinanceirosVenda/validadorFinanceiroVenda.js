(function () {
  angular
    .module('su-destinacao')
    .factory('validadorFinanceiroVenda', service);

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

    function preencherUltimoDiaMesVencimentoUsuarioMP (financeiro) {
      var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
      if (usuarioLogado.idOrganizacao == ID_MINIS_PLANEJAMENTO) {
        financeiro.dataInicioCobranca.setHours(0, 0, 0);
        if (financeiro.diaVencimento == undefined) {
          financeiro.diaVencimento = parseInt(moment(financeiro.dataInicioCobranca).add(1, 'months').endOf('month').format('DD'));
        }
      }
    }

    function validaMesAno(financeiro) {
      var mes = parseInt(financeiro.mesAnoReajuste.substring(0, 2));
      if(mes < 1 || mes > 12){
        financeiro.mesAnoReajuste = undefined
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
      preencherUltimoDiaMesVencimentoUsuarioMP: preencherUltimoDiaMesVencimentoUsuarioMP,
      verificaJurosMensal: verificaJurosMensal,
      verificaFormaPagamentoAvista: verificaFormaPagamentoAvista,
      verificaTipoModalidade: verificaTipoModalidade,
      verificarMaisUmImovelInformado: verificarMaisUmImovelInformado,
      verificarValorLaudoMenorValorLaudo: verificarValorLaudoMenorValorLaudo,
      validaMesAno: validaMesAno,
    }

  }

})();
