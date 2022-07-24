(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('dataUtilService', service);

  function service (moment) {

      var FORMATO_DATA = 'YYYY-MM-DD';

    function formatar(data, pattern) {
        var dataFormatada = '';
        if (data) {
            dataFormatada = moment(data).format(pattern);
        }
        return dataFormatada;
    }

    function compareTo(primeiraData, segundaData) {
        var primeiraDataFormatada = moment(formatar(primeiraData, FORMATO_DATA));
        var segundaDataFormatada = moment(formatar(segundaData, FORMATO_DATA));

        if (primeiraDataFormatada > segundaDataFormatada) return 1;
        else if (primeiraDataFormatada < segundaDataFormatada) return -1;
        else return 0;
    }

    return {
        formatar: formatar,
        compareTo: compareTo
    };

  }

})();
