(function(){
    "use strict";
    angular.module("su-destinacao").controller("ParcelaController", ParcelaController);

    function ParcelaController(destinacaoEscopoCompartilhadoService, 
                               imovelDestinacaoService,
                               localidadeService,
                               dominioService, 
                               $state, mensagemDestinacaoService,
                               $filter) {

      var vm = this;

      vm.tabelaImoveisComParcela = {
        limit: 5,
        limitsPage: [5, 10, 20],
        page: 1,
        total: 0
      };

      var params = {};

      vm.editar = editar;
      vm.buscarTodasUFS= buscarTodasUFS;
      vm.limparCampos= limparCampos;
      vm.limparUfMunicipioCep = limparUfMunicipioCep;
      vm.buscarImovelByCep = buscarImovelByCep;
      vm.consultaDestinacoes = consultaDestinacoes;
      vm.consultarDestinacaoPaginada = consultarDestinacaoPaginada;
      vm.desabilitaUfMunicipio = false;


      function consultaDestinacoes(){
        if(vm.form.$invalid){
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        }else{
          criarParams();
          vm.consultarDestinacaoPaginada();
        }
      }

      function consultarDestinacaoPaginada() {
        params.offset = angular.copy(vm.tabelaImoveisComParcela.page) - 1;
        params.limit = angular.copy(vm.tabelaImoveisComParcela.limit);
        imovelDestinacaoService.consultarDestinacao(params).then(function(resposta){
          vm.listaUtilizacoes  = resposta.data.resultado.content;
          vm.tabelaImoveisComParcela.total = resposta.data.resultado.totalElements;
          
          if (angular.isUndefined(vm.listaUtilizacoes) || vm.listaUtilizacoes.length == 0) {
            mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-nenhum-registro-encontrado'));
          }
        });
      }

      function criarParams() {
        params.rip = angular.copy(vm.rip);
        params.cep = angular.copy(vm.localizacaoEctDto.cep);
        params.uf = angular.copy(vm.localizacaoEctDto.uf);
        params.municipio = angular.copy(vm.localizacaoEctDto.municipio);
      }

      function buscarImovelByCep(cep) {
        if(cep != ""){
          localidadeService.buscarEnderecoByCep(cep)
            .then(function (resposta) {
              vm.localizacaoEctDto = resposta.data.resultado;
              vm.desabilitaUfMunicipio = true;
            });
        }
        else{
          vm.desabilitaUfMunicipio = false;
          vm.limparUfMunicipioCep();
        }
      }

      function limparUfMunicipioCep() {
        vm.localizacaoEctDto.municipio = undefined;
        vm.localizacaoEctDto.uf = undefined;
        vm.localizacaoEctDto.cep = undefined;
      }

      function limparCampos(){
        vm.localizacaoEctDto.municipio = undefined;
        vm.localizacaoEctDto.uf = undefined;
        vm.rip = undefined;
        vm.localizacaoEctDto.cep = undefined;
        vm.desabilitaUfMunicipio = false;
      }

      function buscarTodasUFS() {
        dominioService.buscarTodasUFS()
          .then(function (resposta) {
            vm.ufs = resposta.data.resultado;
          });
      }


      function editar(rip){
        destinacaoEscopoCompartilhadoService.setObjetos("ripUtilizacao", rip);
        $state.go('destinacao.criarParcelaImovel');

      }

      function init(){
        vm.buscarTodasUFS();
      }

      init();
    }


})();
