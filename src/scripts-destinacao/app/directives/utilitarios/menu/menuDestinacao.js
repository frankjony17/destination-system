/**
 * Created by Basis Tecnologia on 01/08/2016.
 */
(function () {

  angular
    .module('su-destinacao')
    .directive('menuDestinacao',directive);

  function directive ($mdSidenav, menuDestinacaoService, $state, comumDestinacaoService, destinacaoEscopoCompartilhadoService) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/utilitarios/menu/templates/menu.html',
      link: function ($scope) {

        var MENUS = [];

        $scope.clickMenuSiapa = clickMenuSiapa;
        $scope.isMenuSiapa = isMenuSiapa;
        $scope.getUrl = getUrl;

        var montaMenu = function(url){
            MENUS = {
                'SU.SERVICOS':  url.servicos,
                'SU.DESTINACAO':  url.destinacao,
                'SU.ADMINISTRACAO':  url.integrador,
                'SU.CADASTRO_IMOVEIS': url.cadastroImoveis,
                'SU.SIAPA': url.siapa
            };
        }

        function clickMenuSiapa(item) {
          if (item.url) {
            $scope.closeMenu();
            $state.go('INTEGRADOR.SIAPA',{urlMenu:$scope.getUrl(item)});
            return false;
          }
        }

        function isMenuSiapa(item) {
          return item.modulo.codigoModulo === 'SU.SIAPA';
        }

        function getUrl(item) {
          var codigoModulo = item.modulo.codigoModulo;
          if (codigoModulo === 'SU.SIAPA') {
            return MENUS[codigoModulo] + item.url;
          } else {
            return MENUS[codigoModulo] + '#' + item.url;
          }
        }

        var init = function () {
          menuDestinacaoService.montaMenu(function(menuAcessos){
            $scope.menuAcessos = menuAcessos;
            menuDestinacaoService.getNomePaginaAtual($state.current.name);
            comumDestinacaoService.buscarUrlsMenusPorAmbiente().then(function (response) {
              var urls = response.data;
              montaMenu(urls);
              destinacaoEscopoCompartilhadoService.setUrlsPorAmbiente(urls);
            });
          });
        };

        $scope.toggleMenu= function() {
          $mdSidenav('left').toggle();
        };

        $scope.closeMenu= function() {
          $mdSidenav('left').close();
        };

        init();

      }
    };
  }

})();
