(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('validadorDestinacaoService', service);

    function service (comparadorService, $filter, mensagemDestinacaoService) {

        var ID_TIPO_ADITIVO = 3;

        function isDadosMoficados(objetoOriginal, objetoAtual) {
          return isEncargosNaoModificados(objetoOriginal, objetoAtual) === false
            || isDestinacaoImovelNaoModificado(objetoOriginal, objetoAtual) === false;

        }

        function isDestinacaoImovelNaoModificado(objetoOriginal, objetoAtual) {
          return comparadorService.comparar(criarObjetoDestinacaoImovel(objetoOriginal.destinacaoImoveis),
            criarObjetoDestinacaoImovel(objetoAtual.destinacaoImoveis));

        }

        function isEncargosNaoModificados(objetoOriginal, objetoAtual) {
          formatarDataEncargo(objetoAtual.encargos);
          return comparadorService.comparar(objetoOriginal.encargos, objetoAtual.encargos);
        }

        function criarObjetoDestinacaoImovel(destinacaoImoveis) {
          var novoDestinacaoImoveis = [];
          angular.forEach(destinacaoImoveis, function(elem) {
            var destinacaoImovel = {benfeitoriasDestinadas: elem.benfeitoriasDestinadas,
              fotoVideo: elem.fotoVideo,
              fracaoIdeal: elem.fracaoIdeal,
              memorialDescAreaConstruida: elem.memorialDescAreaConstruida,
              documentos: elem.documentos};
            novoDestinacaoImoveis.push(destinacaoImovel);
          });
          return novoDestinacaoImoveis;
        }

        function formatarDataEncargo(encargos) {
          angular.forEach(encargos, function(encargo) {
            encargo.dataCumprimento = new Date(encargo.dataCumprimento).getTime();
          });
        }


        function verificarExisteAditivo(objetoOriginal, cessaoGratuita) {

          if (cessaoGratuita.editar === true) {
            if (isNaoExisteAditivo(cessaoGratuita) && isDadosMoficados(objetoOriginal, cessaoGratuita)) {
              var mensagem = $filter('translate')('msg-aditivo-obrigatorio');
              mensagemDestinacaoService.mostrarMensagemError(mensagem);
              throw mensagem;
            }
          }

        }

        function isNaoExisteAditivo(cessaoGratuita) {
          var naoExisteAditivo = true;

          for (var i = 0; i < cessaoGratuita.documentos.length; i++) {
            if (cessaoGratuita.documentos[i].tipoDocumento.id === ID_TIPO_ADITIVO) {
              naoExisteAditivo = false;
              break;
            }
          }

          return naoExisteAditivo;
        }


      return {
        verificarExisteAditivo: verificarExisteAditivo
      };

    }

})();
