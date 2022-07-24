/**
 * Created by Basis Tecnologia on 15/06/2016.
 */
(function () {
    'use strict';

angular.module('su-destinacao').filter('PagoNaoPago', function() {
    return function(input) {
        if (input)
            return input ? 'Pago' : 'Não Pago';
    }
});

angular.module('su-destinacao').filter('rip', function() {
    return function(input) {
        if (!input)
            return;
        return  input.toString().substr(0,4) + '.' + input.toString().substr(4,7) + '-' +input.toString().substr(11,2);
    };
});

angular.module('su-destinacao').filter('cep', function() {
    return function(input) {
        if (!input)
            return;
        return  input.toString().substr(0,5) + '-' + input.toString().substr(5,3);
    };
});

angular.module("su-destinacao").filter('cpfcnpj', function() {
    return function(input){
        if (!input) {
            return;
        } else if(input.toString().length <= 11 && input.toString().length > 3) {
            while(input.toString().length < 11){ input = '0'+input }
            return input.toString().substr(0,3) + '.' + input.toString().substr(3,3) + '.' + input.toString().substr(6,3) + '-' + input.toString().substr(9,2);
        }
        else {
            while(input.toString().length < 14){ input = '0'+input }
            return input.toString().substr(0,2) + '.' + input.toString().substr(2,3) + '.' + input.toString().substr(5,3) + '/' + input.toString().substr(8,4) + '-' + input.toString().substr(12,2);
        }
    };
});

angular.module('su-destinacao').filter('telefonebr', function() {
    return function (input){
        if (!input) {
          return 'Não informado'
        } if (input.toString().length == 11) {
            return '(' + input.toString().substr(0, 2) + ') ' + input.toString().substr(2, 5) + '-' + input.toString().substr(7, 4);
        } else if (input.toString().length == 10){
            return '(' + input.toString().substr(0, 2) + ') ' + input.toString().substr(2, 4) + '-' + input.toString().substr(6, 4);
        }
    };
});


angular.module('su-destinacao').filter('dataformatada', function() {
    return function (input){
        if(!input){
            return ;
        }

        var data = new Date(input);
        var dia = data.getDate();
        if (dia.toString().length == 1)
            dia = "0"+dia;
        var mes = data.getMonth()+1;
        if (mes.toString().length == 1)
            mes = "0"+mes;
        var ano = data.getFullYear();
        return dia+"/"+mes+"/"+ano;
    };
});

})();
