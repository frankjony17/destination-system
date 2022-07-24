(function () {
    'use strict';

    angular
        .module('su-destinacao')
        .controller('incluirImovelAfetacaoPage', controller);

    function controller (destinacaoEscopoCompartilhadoService,$window, $state, usuarioDestinacaoService, imovelDestinacaoService, mensagemDestinacaoService) {

        var vm = this;


        vm.imovel = {
        };


        vm.fechar = fechar;
        vm.buscar = buscar;
        vm.incluir = incluir;

        function init() {
            vm.afetacao = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('afetacao'));
        }
        init();


        function fechar() {
            $state.go('destinacao.afetacao');
        }

        function buscar() {
            imovelDestinacaoService.buscarPorRip(vm.rip).then(function (retorno) {
                var imovel = retorno.data.resultado;
                if(validarUFMesmaJuridicaoUsuarioLogado(imovel)){
                    vm.imovel = imovel;
                }else {
                    mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-uf-juridicao-diferentes'))

                }

            })

        }

        function incluir() {
            vm.afetacao.imoveis.push(vm.imovel);
            destinacaoEscopoCompartilhadoService.setObjetos('afetacao', vm.afetacao);
            $state.go('destinacao.afetacao')
        }

        function validarUFMesmaJuridicaoUsuarioLogado(imovel) {
            var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
            var uf = imovel.endereco.uf;
            return usuarioLogado.jurisdicoes.indexOf(uf)!= -1;
        }


    }
})();
