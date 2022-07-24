(function(){
    "use strict";
    angular.module("su-destinacao").controller("dadosPessoasController", dadosPessoasController);

    function dadosPessoasController(responsavelService, destinacaoService,mensagemDestinacaoService) {

        var vm = this;


        function init() {
            vm.destinacaoPorResponsavel = [];
            vm.documentoPessoaFisica = [];
            vm.responsavel = JSON.parse(window.sessionStorage.getItem('dadoPessoaFisica'));
            vm.historicoPessoaFisica = JSON.parse(window.sessionStorage.getItem('historicoPessoaFisica'));

            window.sessionStorage.removeItem('dadoPessoaFisica');
            window.sessionStorage.removeItem('historicoPessoaFisica');

            vm.responsavel.dataSituacaoCadastral = (vm.responsavel.dataSituacaoCadastral ? new Date(vm.responsavel.dataSituacaoCadastral) : null);
            vm.responsavel.dataAbertura = (vm.responsavel.dataAbertura ? new Date(vm.responsavel.dataAbertura) : null);
            vm.responsavel.dataOpcaoSimples = (vm.responsavel.dataOpcaoSimples ? new Date(vm.responsavel.dataOpcaoSimples) : null);
            vm.responsavel.dataExclusaoSimples = (vm.responsavel.dataExclusaoSimples ? new Date(vm.responsavel.dataExclusaoSimples) : null);
            vm.responsavel.dataCriacao = (vm.responsavel.dataCriacao ? new Date(vm.responsavel.dataCriacao) : null);

            responsavelService.destinacaoPorResponsavel(vm.responsavel.cpfCnpj).then(function (retorno) {
                if(retorno.data.erros && retorno.data.erros.length > 0){
                    mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                } else{
                    vm.destinacaoPorResponsavel = retorno.data;
                }
            });

            destinacaoService.buscarDocumentosPessoaFisica().then(function (retorno) {
                if(retorno.data.erros && retorno.data.erros.length > 0){
                    mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                } else{
                    vm.documentoPessoaFisica = retorno.data.resultado;}
            })
        }
        init()
    }
})();
