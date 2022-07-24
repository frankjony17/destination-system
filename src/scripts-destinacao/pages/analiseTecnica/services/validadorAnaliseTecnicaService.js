(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('validadorAnaliseTecnicaService', service);

    function service () {

         function existeItensNaoSemJustificativa(analiseTecnica) {

            var qtdSimItensVerificacao = verificarItensNaoSemJustificativa(analiseTecnica.itensVerificacao);
            var qtdSimDocumentosAnalise = verificarItensNaoSemJustificativa(analiseTecnica.documentosAnaliseObrigatorio);
            var qtdSimDocumentosComplementares = true;
            if (analiseTecnica.documentosAnaliseComplementar.length > 0) {
                qtdSimDocumentosComplementares = verificarItensNaoSemJustificativa(analiseTecnica.documentosAnaliseComplementar);
            }
            var qtdSimItensVerifEspecifica = verificarItensNaoSemJustificativa(analiseTecnica.itensVerificacaoEspecifica);
            var documentoPendenteSimSelecionado = documentoPendenteNaoSemObservacao(analiseTecnica);

            return !naoExisteItensSemJustificativa(qtdSimItensVerificacao,
                                                   qtdSimDocumentosAnalise,
                                                   qtdSimDocumentosComplementares,
                                                   qtdSimItensVerifEspecifica,
                                                   documentoPendenteSimSelecionado);
        }

        function verificarItensNaoSemJustificativa(lista) {
            var quantidadeItensNaoSemJustif = 0;
                angular.forEach(lista, function (item) {
                    if (item.resposta === false && !item.observacao) {
                        quantidadeItensNaoSemJustif++;
                    }
                });
            return (quantidadeItensNaoSemJustif === 0);
        }

        function naoExisteItensSemJustificativa(qtdSimItensVerificacao,
                                                qtdSimDocumentosAnalise,
                                                qtdSimDocumentosComplementares,
                                                qtdSimItensVerifEspecifica,
                                                documentoPendenteSimSelecionado) {
            return (qtdSimItensVerificacao === true
                        && qtdSimDocumentosAnalise === true
                        && qtdSimDocumentosComplementares === true
                        && qtdSimItensVerifEspecifica === true
                        && documentoPendenteSimSelecionado === true);
        }

        function documentoPendenteNaoSemObservacao(analiseTecnica) {
            return !(analiseTecnica.documentoPendente === false && !analiseTecnica.obsDocumentoPendente);
        }

        function existeItenSimDesmarcado(analiseTecnica) {

            var qtdSimItensVerificacao = verificarItensSimDesmarcado(analiseTecnica.itensVerificacao);
            var qtdSimDocumentosAnalise = verificarItensSimDesmarcado(analiseTecnica.documentosAnaliseObrigatorio);
            var qtdSimDocumentosComplementares = true;
            if (analiseTecnica.documentosAnaliseComplementar.length > 0) {
                qtdSimDocumentosComplementares = verificarItensSimDesmarcado(analiseTecnica.documentosAnaliseComplementar);
            }
            var qtdSimItensVerifEspecifica = verificarItensSimDesmarcado(analiseTecnica.itensVerificacaoEspecifica);
            var documentoPendenteSimSelecionado = documentoPendenteSelecionadoSim(analiseTecnica);

            return !naoExisteItensSimDesmarcado(qtdSimItensVerificacao,
                                                qtdSimDocumentosAnalise,
                                                qtdSimDocumentosComplementares,
                                                qtdSimItensVerifEspecifica,
                                                documentoPendenteSimSelecionado);
        }

        function verificarItensSimDesmarcado(lista) {
            var quantidadeItensNaoSemJustif = 0;
                angular.forEach(lista, function (item) {
                    if (angular.isUndefined(item.resposta)) {
                        quantidadeItensNaoSemJustif++;
                    }
                });
            return (quantidadeItensNaoSemJustif === 0);
        }

        function naoExisteItensSimDesmarcado(qtdSimItensVerificacao,
                                            qtdSimDocumentosAnalise,
                                            qtdSimDocumentosComplementares,
                                            qtdSimItensVerifEspecifica,
                                            documentoPendenteSimSelecionado) {
            return (qtdSimItensVerificacao === true
                        && qtdSimDocumentosAnalise === true
                        && qtdSimDocumentosComplementares === true
                        && qtdSimItensVerifEspecifica === true
                        && documentoPendenteSimSelecionado === true);
        }

        function documentoPendenteSelecionadoSim(analiseTecnica) {
          return angular.isDefined(analiseTecnica.documentoPendente);
        }

        return {
            existeItensNaoSemJustificativa: existeItensNaoSemJustificativa,
            existeItenSimDesmarcado: existeItenSimDesmarcado

        };
    }

})();
