(function () {

  angular
      .module('su-destinacao')
      .service('inserirImovelParcelaUtil', service);

    function service () {

        function calcularFracaoIdeal(destinacaoImovel) {
            var totalAreaConstruida = 0;
            var totalAreaDisponivel = 0;
            var totalAreaUtilizar = 0;
            var benfeitorias = destinacaoImovel.imovel.benfeitorias;
            var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;
            var fracaoIdeal = 0;

            if (angular.isDefined(benfeitorias)) {

                angular.forEach(benfeitorias, function (benfeitoria) {
                    totalAreaConstruida += benfeitoria.areaConstruida;
                    totalAreaDisponivel += benfeitoria.areaDisponivel;
                    totalAreaUtilizar += getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                });
                fracaoIdeal = (totalAreaUtilizar / totalAreaConstruida) * destinacaoImovel.imovel.parcela.areaTerreno;
            }

            return fracaoIdeal;
        }

        function getTipoUtilizacao(destinacaoImovel) {
            var parcela = extrairParcela(destinacaoImovel);
            if (Math.round(destinacaoImovel.fracaoIdeal) === Math.round(parcela.areaTerreno)) {
                return 'Total';
            }
            return 'Parcial';
        }

        function extrairParcela(destinacaoImovel) {
            var parcela;

            if (angular.isDefined(destinacaoImovel.id)) {
                parcela = destinacaoImovel.imovel.parcelas[0];
            } else {
                parcela = destinacaoImovel.imovel.parcela;
            }
            return parcela;
        }

        function somarAreaConstruidaUtilizada(destinacaoImovel) {
            var total = 0;
            var benfeitorias = destinacaoImovel.imovel.benfeitorias;
            var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;

            angular.forEach(benfeitorias, function (benfeitoria) {
                total += getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
            });
            return total;
        }

        function getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas) {
            var areaUtilizada = 0;
            for (var i = 0; i < benfeitoriasDestinadas.length; i++) {
                if (benfeitoriasDestinadas[i].idBenfeitoria === benfeitoria.id) {
                    areaUtilizada = benfeitoriasDestinadas[i].areaUtilizar;
                    break;
                }
            }
            return areaUtilizada;
        }

        function formatarDadosParcela(destinacaoImovel) {
            var dadosParcela = '-';
            if(angular.isDefined(destinacaoImovel)&& angular.isDefined(destinacaoImovel.imovel)) {
                destinacaoImovel = extrairDadosImovel(destinacaoImovel);
                dadosParcela = ' ' + destinacaoImovel.imovel.rip
                                + destinacaoImovel.imovel.parcela.sequencial
            }
            return dadosParcela;
        }
        function formatarCodigoUtilizacao(destinacaoImovel) {
            var codigoUtilizacao = '-';
            if (angular.isDefined(destinacaoImovel)
                && angular.isDefined(destinacaoImovel.imovel)) {
                destinacaoImovel = extrairDadosImovel(destinacaoImovel);
                codigoUtilizacao = ' ' + destinacaoImovel.imovel.rip
                                    + '/' + destinacaoImovel.imovel.codigoUtilizacao
                                    + '/' + destinacaoImovel.imovel.parcela.sequencial;
            }
            return codigoUtilizacao;
        }

        function extrairDadosImovel(destiancaoImovel) {
            if (angular.isDefined(destiancaoImovel.id)) {
                destiancaoImovel.imovel.codigoUtilizacao = destiancaoImovel.codigoUtilizacao;
                destiancaoImovel.imovel.parcela = destiancaoImovel.imovel.parcelas[0];
            }
            return destiancaoImovel;
        }

        return {
            calcularFracaoIdeal: calcularFracaoIdeal,
            getTipoUtilizacao: getTipoUtilizacao,
            somarAreaConstruidaUtilizada: somarAreaConstruidaUtilizada,
            getAreaDestinadaBenfeitoria: getAreaDestinadaBenfeitoria,
            formatarCodigoUtilizacao: formatarCodigoUtilizacao,
            formatarDadosParcela: formatarDadosParcela
        };

    }


})();
