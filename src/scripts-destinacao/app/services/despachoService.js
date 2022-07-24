(function () {

    'use strict';

    angular.module('su-destinacao').factory('despachoService', service);

    function service ($http) {

        var URL = 'destinacao/api/despacho';
        var ALTERAR_AVALIACAO_CHEFIA = 8;
        var ALTERAR_AVALIACAO_SUPERINTENDENTE = 15;
        var despachosAlterarAvaliacao = [ALTERAR_AVALIACAO_CHEFIA, ALTERAR_AVALIACAO_SUPERINTENDENTE];

        var PERMISSAO_TECNICO = 'DESTINACAO_EXEC_ANALISE_TEC_TECNICO';
        var PERMISSAO_CHEFIA = 'DESTINACAO_EXEC_ANALISE_TEC_CHEFIA';
        var PERMISSAO_SUPERINTENDENTE = 'DESTINACAO_EXEC_ANALISE_TEC_SUPERINTENDENTE';
        var PERMISSAO_SECRETARIO = 'DESTINACAO_EXEC_ANALISE_TEC_SECRETARIO';

        function listarDespachosDefault () {
            return $http.get(URL);
        }

        function listarDespachosSuperintendente () {
            return $http.get(URL + '/SUPERINTENDENTE');
        }

        function listarDespachosSecretario() {
            return $http.get(URL + '/SECRETARIO');
        }

        function listarDespachosChefia() {
            return $http.get(URL + '/CHEFIA');
        }

        function verificarDespachoPreenchidoPermissao(analiseTecnica, permissao) {
            var despachoPreenchido = false;
            if (PERMISSAO_TECNICO === permissao) {
                despachoPreenchido = verificarDespachoPreenchido(analiseTecnica.despachosTecnico);
            } else if (PERMISSAO_CHEFIA === permissao) {
                despachoPreenchido = verificarDespachoPreenchido(analiseTecnica.despachosChefia);
            } else if (PERMISSAO_SUPERINTENDENTE === permissao) {
                despachoPreenchido = verificarDespachoPreenchido(analiseTecnica.despachosSuperintendente);
            } else if (PERMISSAO_SECRETARIO === permissao) {
                despachoPreenchido = verificarDespachoPreenchido(analiseTecnica.despachosSecretario);
            }
            return despachoPreenchido;
        }

        function verificarDespachoPreenchido(despachos) {
            if (despachos.length > 0) {
                if (angular.isDefined(despachos[0].id) && despachosAlterarAvaliacao.indexOf(despachos[0].id) !== -1) {
                    return angular.isDefined(despachos[1].id);
                }
                return angular.isDefined(despachos[0].id);
            }
            return false;

        }

        return {
            listarDespachosDefault: listarDespachosDefault,
            listarDespachosSuperintendente: listarDespachosSuperintendente,
            listarDespachosSecretario: listarDespachosSecretario,
            listarDespachosChefia: listarDespachosChefia,
            verificarDespachoPreenchidoPermissao: verificarDespachoPreenchidoPermissao
        };

    }

})();
