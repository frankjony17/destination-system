(function(){
    "use strict";
    angular.module("su-destinacao").controller("RedimensionarParcelaController", RedimensionarParcelaController);

    function RedimensionarParcelaController(arquivoService,parcelaService, mensagemDestinacaoService,
                                    imovelDestinacaoService,
                                    destinacaoEscopoCompartilhadoService,
                                    $mdDialog,
                                    $state,
                                    $filter,
                                    $window) {


        var vm = this;
        var dados = {};
        vm.cancelar = cancelar;
        vm.changeParcelas = changeParcelas;
        vm.checkBenfeitoria = checkBenfeitoria;
        vm.buscarAreaConstruida = buscarAreaConstruida;
        vm.salvarListaParcelas = salvarListaParcelas;
        vm.tratarBenfeitoria = tratarBenfeitoria;
        vm.existeUtilizacao = existeUtilizacao;
        vm.mensagemAreaTerreno = mensagemAreaTerreno;
        vm.validarBenfeitoriasSelecionadas = validarBenfeitoriasSelecionadas;
        vm.nomeParcela = '';
        vm.listaBenfeitoriasParcela = [];
        var condicao = true;

        vm.tabelaTodasParcelas = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1
        };

        vm.tabelaParcelasCanceladas = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1
        };

        function init() {
            dados = destinacaoEscopoCompartilhadoService.getParcelas("parcelas");
            inicializacaoDados();
        }

        function inicializacaoDados() {
            vm.rip = dados.rip;
            vm.areaTerreno = dados.areaTerreno;
            vm.benfeitorias = dados.benfeitorias;
            vm.areaConstruida = 0;
            vm.calculoAreaContruida = 0;
            vm.parcelas = dados.parcelas;
            vm.parcelasSelecionadas= angular.copy(vm.parcelas);
            vm.areaConstruidaAntigo = dados.areaConstruidaAntigo;
            vm.areaTerrenoAntigo = dados.areaTerrenoAntigo;
            vm.iconeAreaParcela = false;
            vm.possuiPendencia = false;

            vm.possuiPendencia = dados.possuiPendencia;
            buscarAreaConstruida(vm.benfeitorias);

            somarAreaParcelas(vm.parcelas);

        }

        function salvarListaParcelas() {
            if(validarBenfeitoriasSelecionadas(vm.parcelas)) {

                if (!condicao) {
                    var parcelasSalvar = {};
                    parcelasSalvar = vm.parcelas;
                    parcelaService.salvarListaParcelas(parcelasSalvar).then(function (resposta) {
                        $state.go('destinacao.parcelaImovel');
                    });
                } else {
                    mensagemAreaTerreno();
                    return;
                }
            }
        }

        init();


        function changeParcelas(parcela){

            vm.parcelasSelecionadas.forEach(function(parc, id){
                if(parc.id === parcela.id){
                    vm.parcelasSelecionadas[id].areaTerreno = parcela.areaTerreno;
                }
            })

            somarAreaParcelas(vm.parcelas);
        }

        function somarAreaParcelas(parcelas){
            vm.calculoAreaContruida = 0;
            for(var i=0; i < parcelas.length; i++){
                vm.calculoAreaContruida += parseInt(parcelas[i].areaTerreno);
            }
            condicao = verificarValorSomaTerrano();
        }

        function nomeParcela(parcela){
            nomeParcela = imovel.rip;

        }

        function checkBenfeitoria(benfeitoria, parcela){
            for(var a = 0; a < parcela.benfeitorias.length; a++){
                if(benfeitoria.codigo === parcela.benfeitorias[a].codigo){
                    return true;
                }
            }
            return false;
        }

        function existeUtilizacao(parcela){
            return parcela.utilizada;
        }


        function tratarBenfeitoria(evt, parcela, benfeitoria){

            if (evt.target.checked) {
                parcela.benfeitorias.push(angular.copy(benfeitoria));
            } else {
                _.remove(parcela.benfeitorias, function(ben) {
                    return ben.idBenfeitoriaCadImovel == benfeitoria.idBenfeitoriaCadImovel;
                })
            }

            vm.listaBenfeitoriasParcela = parcela.benfeitorias;
        }

        function buscarAreaConstruida(benfeitorias){

            for(var i=0; i < benfeitorias.length; i++){
                vm.areaConstruida += benfeitorias[i].areaConstruida;
            }
        }

        function verificarValorSomaTerrano() {
            if (vm.areaTerreno != vm.calculoAreaContruida){
                alteraLabelRed();
                return true;
            }else{
                alteraLabelBlack();
                return false;
            }
        }

        function validarBenfeitoriasSelecionadas(parcelas){
            var condicao = 0;

           parcelas.forEach(function(parcela, i){

               for(var i= 0; i < vm.benfeitorias.length; i++){
                   for(var a = 0; a < parcela.benfeitorias.length; a++){
                       if(vm.benfeitorias[i].idBenfeitoriaCadImovel === parcela.benfeitorias[a].idBenfeitoriaCadImovel){
                           condicao ++;
                       }
                   }
               }
           })

            if(condicao != vm.benfeitorias.length){
                var mensagem = 'Existem acessões/benfeitorias desvinculadas para este imóvel';
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                return false;
            }else{
                return true;
            }

        }

        function alteraLabelRed() {
            vm.labelObject = document.getElementById("setarCor");
            vm.labelObject.style.color = "red";
            vm.iconeAreaParcela = true;
        }

        function alteraLabelBlack() {
            vm.labelObject = document.getElementById("setarCor");
            vm.labelObject.style.color = "black";
            vm.iconeAreaParcela = false;
        }

        function mensagemAreaTerreno(){
            var mensagem = 'A área total das parcelas não corresponde à área do terreno';
            mensagemDestinacaoService.mostrarMensagemError(mensagem);
        }


        function fechar() {
            $mdDialog.cancel();
        }

        function cancelar() {
            window.history.back();
        }
    }
})();
