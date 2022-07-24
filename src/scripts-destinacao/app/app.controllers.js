(function () {
'use strict';
angular.module('su-destinacao')
    .controller('MenuDestinacaoController', function($mdSidenav, comumDestinacaoService) {
      var vm = this;

        var init = function () {
            /**
             * Essa classe é adicionada automaticamente pela diretiva md-position-mode
             * essa diretiva é necessária em cada md-menu para nao printar erro do angular material no console
             * a remoção dessa classe é necessária para não alterar o tamanho do menu
             */
            angular.element(".md-menu-bar-menu").removeClass("md-dense");
            comumDestinacaoService.buscarUrlsMenusPorAmbiente().then(function (response) {
            self.url = response.data;
          });

        };


        init();

        vm.toggleMenu= function() {
            $mdSidenav('left').toggle();
        };
        vm.closeMenu= function() {
          $mdSidenav('left').close();
        }

    });
})();