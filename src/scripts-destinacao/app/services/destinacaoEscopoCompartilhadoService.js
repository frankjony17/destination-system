(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('destinacaoEscopoCompartilhadoService', destinacaoEscopoCompartilhadoService);

    function destinacaoEscopoCompartilhadoService () {
        var _objetos = {};
        var _parcelas = {};

        var _urlsPorAmbiente = {};

        function setObjetos (nomeObjeto, objeto) {
            _objetos[nomeObjeto] = objeto;
        }

        function getObjeto(nomeObjeto) {
            return _objetos[nomeObjeto];
        }


        function setParcelas (nomeParcela, parcela) {
            _parcelas[nomeParcela] = parcela;
        }

        function getParcelas(nomeParcela) {
            return _parcelas[nomeParcela];
        }

        function setUrlsPorAmbiente(urls) {
            return _urlsPorAmbiente = urls;
        }

        function getUrlsPorAmbiente() {
            return _urlsPorAmbiente;
        }

        function limparEscopo(){
            _objetos = {};
        }

        function setDestinacao(destinacao, nomeStateDestinacao) {
            _objetos['destinacao'] = destinacao;
            _objetos['nomeStateDestinacao'] = nomeStateDestinacao;
        }

        function getDestinacao() {
            return _objetos['destinacao'];
        }

        function getNomeStateDestinacao() {
            return _objetos['nomeStateDestinacao'];
        }

        function setMensagens(mensagens) {
            _objetos['mensagens'] = mensagens;
        }

        function getMensagens() {
            return _objetos['mensagens'];
        }

        function limparMensagens() {
            delete _objetos['mensagens'];
        }

        return {
            setObjetos: setObjetos,
            getObjeto: getObjeto,
            setUrlsPorAmbiente: setUrlsPorAmbiente,
            getUrlsPorAmbiente: getUrlsPorAmbiente,
            limparEscopo: limparEscopo,
            setDestinacao: setDestinacao,
            getDestinacao: getDestinacao,
            getNomeStateDestinacao: getNomeStateDestinacao,
            setMensagens: setMensagens,
            getMensagens: getMensagens,
            setParcelas : setParcelas,
            getParcelas : getParcelas,
            limparMensagens: limparMensagens
        };
    }

})();
