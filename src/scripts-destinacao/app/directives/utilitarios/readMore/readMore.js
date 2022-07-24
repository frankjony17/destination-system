(function () {

    angular
        .module('su-destinacao')
        .directive('readMore',directive);

    function directive () {
        return {
            restrict: 'AE',
            replace: true,
            template: '<p style="text-align: justify"></p>',
            scope: {
                maisTexto: '=',
                menosTexto: '=',
                limit: '=',
                texto: '='
            },
            link: function (scope, elem) {

                var maisTexto = criarTemplateMaisTexto();
                var menosTexto = criarTemplateMenosTexto();

                scope.limit = angular.isUndefined(scope.limit) ? 200 : scope.limit;

                scope.$watch('texto', function (newValue) {
                    if (newValue) {
                        readMore(newValue);
                    }
                });

                function criarTemplateMaisTexto () {
                  return angular.isUndefined(scope.maisTexto) ? ' <a class="read-more"> Ler mais...</a>' : ' <a class="read-more">' + ' ' + scope.maisTexto + '</a>';
                }

                function criarTemplateMenosTexto() {
                   return angular.isUndefined(scope.menosTexto) ? ' <a class="read-less">Ler menos</a>' : ' <a class="read-less">' + scope.menosTexto + '</a>';
                }

                function prepararTexto(texto) {
                    var textoOriginal = angular.copy(texto);
                    var contarCaracteres = texto.length;
                    var totalCaracteres = contarCaracteres;
                    var mais = '';
                    var textoPreparado = '';
                    var textoCortado = '';

                    if (totalCaracteres > scope.limit) {
                        textoCortado = textoOriginal.slice(0, scope.limit);
                        mais = textoOriginal.slice(scope.limit, totalCaracteres);
                        textoPreparado = textoCortado + maisTexto.trim()
                            + '<span class="more-text">' + mais + menosTexto + '</span>';
                    } else {
                        textoPreparado = texto;
                    }

                    return textoPreparado;
                }

                function readMore(texto) {

                    var textoPreparado = prepararTexto(texto);

                    if (elem[0].innerHTML === '') {
                        elem.append(textoPreparado);
                    } else {
                        elem[0].innerHTML = textoPreparado;
                        //elem[0].innerText = textoPreparado;
                    }

                    elem.find('.read-more').on('click', function() {
                        angular.element(this).hide();
                        elem.find('.more-text').addClass('show').slideDown();
                    });

                    elem.find('.read-less').on('click', function() {
                        elem.find('.read-more').show();
                        elem.find('.more-text').hide().removeClass('show');
                    });

                }

           }
    };
  }

})();
