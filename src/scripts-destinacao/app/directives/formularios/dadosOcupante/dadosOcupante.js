/**
 * Created by rogerio on 29/06/17.
 */
(function () {

    angular
      .module('su-destinacao')
      .directive('dadosOcupante',directive);
  function directive ($filter, mensagemDestinacaoService, tipoPosseService, destinacaoService) {


    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosOcupante/templates/dadosOcupante.html',
      scope: {
        posseInformal: '='

      },
      link: function ($scope) {
        var TAMANHO_CNPJ = 14;
        var TAMANHO_CPF = 11;
        var indice;

        $scope.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        $scope.verificarPessoaJuridicaOcupante = verificarPessoaJuridicaOcupante;
        $scope.verificarPessoaFisica = verificarPessoaFisica;
        $scope.adicionarOcupante = adicionarOcupante;
        $scope.verificarIndividual = verificarIndividual;
        $scope.remover = remover;
        $scope.editar = editar;
        $scope.limparEscopo = limparEscopo;
        $scope.validaCpfCnpj = validaCpfCnpj;
          $scope.buscarListaTipoPosse = buscarListaTipoPosse;
        $scope.dadoOcupante = {};
        $scope.modoEdicao = false;
        $scope.semCnpj = false;

        buscarListaTipoPosse();

        function buscarListaTipoPosse() {
            $scope.semCnpj = $scope.posseInformal.semCnpj;
            if($scope.posseInformal.detalhar) {
                $scope.listaTiposPosse = [$scope.posseInformal.tipoPosse];
            }else {
                tipoPosseService.buscarTiposPosse().then(function (resposta) {
                    $scope.listaTiposPosse = resposta.data.resultado;

                });
            }
        }



        function verificarPessoaJuridicaOcupante(){
          try {
            return $scope.dadoOcupante.cpfCnpj.length === TAMANHO_CNPJ;
          } catch(erro) {
            return false;
          }
        }
        function verificarPessoaFisica() {
          try{
            return $scope.dadoOcupante.cpfCnpj.length === TAMANHO_CPF;
          }catch(erro){
            return false
          }
        }
        function adicionarOcupante() {
          if(angular.isDefined($scope.dadoOcupante)){
            if(angular.isDefined($scope.dadoOcupante.cpfCnpj) && angular.isDefined($scope.dadoOcupante.areaUtilizada)){
              if($scope.modoEdicao){
                angular.forEach($scope.posseInformal.ocupantes, function(v, k){
                  if(JSON.stringify(v) === JSON.stringify($scope.emEdicao)){
                    $scope.posseInformal.ocupantes[k] = $scope.dadoOcupante;
                  }
                });
              } else {
                $scope.posseInformal.ocupantes.push(angular.copy($scope.dadoOcupante));
              }
              limpar();
            }else {
              mensagemDestinacaoService.mostrarMensagemError('Necessário preencher os campos obrigatórios');
            }
          }
        }
        function verificarIndividual() {

          if($scope.posseInformal.tipoPosse.id === 1){
            if(!$scope.modoEdicao){
              if($scope.posseInformal.ocupantes.length >= 1){
                return true;
              }
            }
            return false;
          }
        }
        function remover(ocupante) {
          var mensagem = $filter("translate")('msg-confirma-exclusao-item');
          mensagemDestinacaoService.confirmar(mensagem, function () {
              indice = indexOcupante(ocupante);
              $scope.posseInformal.ocupantes.splice(indice, 1);


          });
        }
        function indexOcupante(ocupante) {
          return $scope.posseInformal.ocupantes.findIndex(function (element) {
            return JSON.stringify(element) === JSON.stringify(ocupante);
          });
        }
        function editar(ocupante){
          indice = indexOcupante(ocupante);
          $scope.modoEdicao = true;
          $scope.emEdicao = ocupante;
          $scope.dadoOcupante = angular.copy(ocupante);
        }
        function limpar() {
          $scope.dadoOcupante = {};
          $scope.modoEdicao = false;
        }
        function limparEscopo() {
            if(!$scope.posseInformal.editar && !$scope.posseInformal.detalhar){
                $scope.dadoOcupante = {};
                $scope.posseInformal.ocupantes = [];
                $scope.posseInformal.cnpj = undefined;
                $scope.posseInformal.nomeEntidade = undefined;
            }
        }
        function validaCpfCnpj(cnpj,opc) {
          if(angular.isUndefined(cnpj)){
            if(opc === 1){
              $scope.posseInformal.cnpj = '';
              mensagemDestinacaoService.mostrarMensagemError('CNPJ inválido.');
            }
            else if(opc === 2){
              $scope.dadoOcupante.cpfCnpj = '';
              mensagemDestinacaoService.mostrarMensagemError('CPF/CNPJ inválido.');
            }
            else{
              $scope.dadoOcupante.cpfConjuge = '';
              mensagemDestinacaoService.mostrarMensagemError('CPF do cônjuge inválido.');
            }
          }
        }
      }
    }
  }

})();
