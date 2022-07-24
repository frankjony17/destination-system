/**
 * Created by haillanderson on 13/10/17.
 */
(function () {

    angular
        .module('su-destinacao')
        .service('procurarDadosImovelService', service);

    function service () {

        function prepararDadosDestinacao(resultado) {
            resultado.responsavelCorreto = '';
            resultado.usoOficial = '';
            if(resultado.endereco) {
                resultado.enderecoCorreto = 'Logradouro: '+resultado.endereco.logradouro+
                ', Número: '+resultado.endereco.numero+', Município: '+resultado.endereco.municipio+
                ', Bairro: '+resultado.endereco.bairro+', UF: '+resultado.endereco.uf;
            }
            if(resultado.ocupantes.length >= 1){
                var cpfCnpj = undefined;
                angular.forEach(resultado.ocupantes, function (ocupante, index) {
                    if(ocupante.cpfCnpj.length === 11){
                        cpfCnpj = ocupante.cpfCnpj.substring(0,3)+'.'+ocupante.cpfCnpj.substring(3,6)
                            +'.'+ocupante.cpfCnpj.substring(6,9)+'-'+ocupante.cpfCnpj.substring(9);
                        if(index !== resultado.ocupantes.length - 1){
                            resultado.responsavelCorreto = resultado.responsavelCorreto + cpfCnpj+', ';
                        }
                        else{
                            resultado.responsavelCorreto = resultado.responsavelCorreto + cpfCnpj;
                        }
                    }
                    else{
                        cpfCnpj = ocupante.cpfCnpj.substring(0,2)+'.'+ocupante.cpfCnpj.substring(2,5)
                            +'.'+ocupante.cpfCnpj.substring(5,8)+'/'+ocupante.cpfCnpj.substring(8,12)+'-'
                            +ocupante.cpfCnpj.substring(12);
                        resultado.responsavelCorreto = resultado.responsavelCorreto + cpfCnpj;
                    }
                });
            }
            var utilizacao = undefined;
            if(resultado.utilizacao.length >= 1){
                utilizacao = resultado.utilizacao[0];
            } else {
                utilizacao = resultado.utilizacao;
            }

            if(angular.isDefined(utilizacao) && utilizacao !== null && utilizacao.tipoUtilizacao){
                if(utilizacao.tipoUtilizacao.id !== 1){
                    resultado.usoOficial = utilizacao.tipoUtilizacao.descricao+' / '+utilizacao.subTipoUtilizacao.descricao;
                } else {
                    resultado.usoOficial = utilizacao.tipoUtilizacao.descricao;
                }
            }
            return resultado;
        }

        return {
            prepararDadosDestinacao: prepararDadosDestinacao
        };

    }


})();
