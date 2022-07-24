(function () {
    'use strict';
    angular
        .module('su-destinacao')
        .controller('ModalMinutaController', controller);

        function controller ($mdDialog) {

            var vm = this;

            vm.fechar = fechar;

            function fechar () {
                $mdDialog.cancel();
            }
        }

})();
