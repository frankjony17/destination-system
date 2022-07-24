(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('inserirDadosImovelParcelaService', service);

  function service () {

    function calcularPorcentagemAreaPermitida(area) {
        return (area * (5 / 100));
    }

    function validarEditarAreaPermitidaMaior(areaPermitida, areaUtilizar) {
        return areaUtilizar > areaPermitida;
    }

    function validarEditarAreaPermitidaMenor(areaPermitida, areaUtilizar) {
        return areaUtilizar < areaPermitida;
    }    

    return {
      calcularPorcentagemAreaPermitida: calcularPorcentagemAreaPermitida,
      validarEditarAreaPermitidaMaior: validarEditarAreaPermitidaMaior,
      validarEditarAreaPermitidaMenor: validarEditarAreaPermitidaMenor
    };

  }

})();
