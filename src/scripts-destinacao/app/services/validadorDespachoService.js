(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('validadorDesapachoService', service);

    function service () {

        var DESPACHO_NAO_ATENDE_REQ = 2;
        var DESPACHO_PEND_REQ = 3;
        var DESPACHO_ERRO_DUPLICIDADE = 4;
        var DESPACHO_MANIF_OUTRA_AREA = 5;

        function verificarItensObrigatoriosPreenchidos(analiseTecnica) {

          var qtdSimItensVerificacao = verificarItensMarcadosSim(analiseTecnica.itensVerificacao);
          var qtdSimItensDocObrigagorios = verificarItensMarcadosSim(analiseTecnica.documentosAnaliseObrigatorio);
          var qtdSimItensDocComplementares = true;

          if (analiseTecnica.documentosAnaliseComplementar.length > 0) {
            qtdSimItensDocComplementares = verificarItensMarcadosSim(analiseTecnica.documentosAnaliseComplementar);
          }

          var qtdSimItensVerifEspecif = verificarItensMarcadosSim(analiseTecnica.itensVerificacaoEspecifica);
          var documentoPendenteSimSelecionado = documentoPendenteSelecionadoSim(analiseTecnica);

          return !todosItensMarcados(qtdSimItensVerificacao,
                                     qtdSimItensDocObrigagorios,
                                     qtdSimItensDocComplementares,
                                     qtdSimItensVerifEspecif,
                                     documentoPendenteSimSelecionado);
        }

        function verificarItensMarcadosSim(lista) {
          var quantidadeItensSim = 0;
          angular.forEach(lista, function (item) {
            if (item.resposta === true) {
              quantidadeItensSim++;
            }
          });
          return (quantidadeItensSim === lista.length && quantidadeItensSim > 0);
        }

        function todosItensMarcados(qtdSimItensVerificacao,
                                    qtdSimItensDocObrigagorios,
                                    qtdSimItensDocComplementares,
                                    qtdSimItensVerifEspecif,
                                    documentoPendenteSimSelecionado) {
          return (qtdSimItensVerificacao === true
              && qtdSimItensDocObrigagorios === true
              && qtdSimItensDocComplementares === true
              && qtdSimItensVerifEspecif === true
              && documentoPendenteSimSelecionado === true);
        }

        function documentoPendenteSelecionadoSim(analiseTecnica) {
          return analiseTecnica.documentoPendente === true;
        }

        function verificarJustificativaObrigatoria(despacho) {
            var justificativaObrigatoria = false;
            if (despacho.id == DESPACHO_ERRO_DUPLICIDADE
                || despacho.id == DESPACHO_PEND_REQ
                || despacho.id == DESPACHO_MANIF_OUTRA_AREA
                || despacho.id == DESPACHO_NAO_ATENDE_REQ) {
              justificativaObrigatoria = true;
            }
            return justificativaObrigatoria;
         }

         return {
          verificarItensObrigatoriosPreenchidos: verificarItensObrigatoriosPreenchidos,
          verificarJustificativaObrigatoria: verificarJustificativaObrigatoria
         };

    }

})();
