(function(){
    'use strict';

    angular
        .module('su-destinacao')
        .directive('dadosEnderecoCorrespondencia', directive);

    function directive(localidadeService){
        return{
            restrict: 'EA',
            scope: {
                enderecoCorrespondencia: '=',
                detalhar: '=',
                editar: '='
            },
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosEnderecoCorrespondencia/templates/dadosEnderecoCorrespondencia.html',
            link: function ($scope) {

                $scope.BRASIL = 'Brasil';

                var init = function () {

                    $scope.buscarListAdotarEndereco();
                    $scope.buscarPaises();
                    inicializaEnderecoCorrespondencia();
                };

                function inicializaEnderecoCorrespondencia() {
                    if(!$scope.enderecoCorrespondencia){
                        $scope.enderecoCorrespondencia = {
                            endereco:{}
                        };
                    }
                    if (!$scope.enderecoCorrespondencia.endereco.pais) {
                        $scope.enderecoCorrespondencia.endereco.pais = $scope.BRASIL;
                    } else if($scope.enderecoCorrespondencia.endereco.pais){
                       $scope.enderecoCorrespondencia.endereco.pais = tituloCase($scope.enderecoCorrespondencia.endereco.pais);
                    }
                }

                var tituloCase = function (input) {
                    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

                    input = input.toLowerCase();
                    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                        if (index > 0 && index + match.length !== title.length &&
                            match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                            (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                            title.charAt(index - 1).search(/[^\s-]/) < 0) {
                            return match.toLowerCase();
                        }

                        if (match.substr(1).search(/[A-Z]|\../) > -1) {
                            return match;
                        }

                        return match.charAt(0).toUpperCase() + match.substr(1);

                    });
                };

                $scope.buscarEnderecoByCep = function(){
                    localidadeService.buscarEnderecoByCep($scope.enderecoCorrespondencia.endereco.cep).then(function (resp) {
                        var endereco = resp.data.resultado;
                        if (!$scope.enderecoCorrespondencia.endereco) {
                            $scope.enderecoCorrespondencia.endereco = {};
                        }
                        $scope.enderecoCorrespondencia.endereco.cep = endereco.cep;
                        $scope.enderecoCorrespondencia.endereco.bairro = endereco.bairro;
                        $scope.enderecoCorrespondencia.endereco.logradouro = endereco.logradouro;
                        $scope.enderecoCorrespondencia.endereco.municipio = endereco.municipio;
                        $scope.enderecoCorrespondencia.endereco.tipoLogradouro = endereco.tipoLogradouro;
                        $scope.enderecoCorrespondencia.endereco.uf = endereco.uf;
                        $scope.isCepNormalCorespondencia = !localidadeService.isCEPGenerico($scope.enderecoCorrespondencia.endereco);
                    });
                };

                $scope.buscarPaises = function () {
                    localidadeService.buscarPaises().then(function (resp) {
                        $scope.paises = resp.data.resultado;
                    });
                };

                $scope.buscarListAdotarEndereco = function () {
                    localidadeService.buscarAdotarEnderecoEnum().then(function (resp) {
                        $scope.listAdotarEndereco = resp.data;
                    });

                };

                $scope.isPaisBrasil = function(){
                    return $scope.enderecoCorrespondencia.endereco.pais && $scope.enderecoCorrespondencia.endereco.pais === 'Brasil';
                };

                $scope.isNotPaisBrasil = function () {
                    return $scope.enderecoCorrespondencia.endereco.pais && $scope.enderecoCorrespondencia.endereco.pais !== 'Brasil';
                };

                init();

            }
        }

    }
})();
