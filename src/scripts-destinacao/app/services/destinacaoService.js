(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('destinacaoService', service);

    function service ($http, URL_DESTINACAO, $filter, mensagemDestinacaoService, $state) {

      var URL =  URL_DESTINACAO + 'destinacao';

      function salvarDoacao (destinacao) {
        if (destinacao.id) {
          return $http.put(URL + '/doacao', destinacao);
        } else {
          return $http.post(URL + '/doacao', destinacao);
        }

      }

      function salvarVenda (destinacao) {
        if (destinacao.id) {
          return $http.put(URL + '/venda', destinacao);
        } else {
          return $http.post(URL + '/venda', destinacao);
        }

      }

      function salvarPosseInformal (destinacao) {
        if (destinacao) {
          return $http.put(URL + '/posse-informal', destinacao);
        } else {
          return $http.post(URL + '/posse-informal', destinacao);
        }

      }

      function salvarCUEM (destinacao) {
        if (destinacao){
          return $http.put(URL + '/cuem', destinacao);
        } else {
          return $http.post(URL + '/cuem', destinacao);
        }
      }


      function salvarCDRU (destinacao) {
        if (destinacao){
          return $http.put(URL + '/cdru', destinacao);
        } else {
          return $http.post(URL + '/cdru', destinacao);
        }
      }

      function salvarTermoEntrega (destinacao) {
        if (destinacao.id) {
          return $http.put(URL + '/termo-entrega', destinacao);
        } else {
          return $http.post(URL + '/termo-entrega', destinacao);
        }

      }

      function salvarPermissaoUsoImovelInformal(destnacao) {
          if(destnacao.id){
              return $http.put(URL + '/permissaoUsoImovelFuncional', destnacao);
          } else {
              return $http.post(URL + '/permissaoUsoImovelFuncional', destnacao)
          }
      }

      function salvarCessaoGratuita (destinacao) {
        if(destinacao){
          return $http.put(URL + '/cessaoGratuita', destinacao);
        } else {
          return $http.post(URL + '/cessaoGratuita', destinacao);
        }
      }

      function salvarUsoProprio(destinacao) {
        if(angular.isDefined(destinacao.id)){
          return $http.put(URL + '/usoProprio', destinacao);
        }else {
          return $http.post(URL + '/usoProprio', destinacao);
        }
      }

        function salvarTransferencia(destinacao) {
            if(angular.isDefined(destinacao.id)){
                return $http.put(URL + '/transferencia', destinacao);
            }else {
                return $http.post(URL + '/transferencia', destinacao);
            }
        }

      function salvarCessaoOnerosa(destinacao) {
          if (angular.isDefined(destinacao.id)){
              return $http.put(URL + '/cessaoOnerosa', destinacao);
          }else {
              return $http.post(URL + '/cessaoOnerosa', destinacao);
          }
      }

      function homologarUsoProprio(destinacao) {
          return $http.post(URL + '/homologarUsoProprio', destinacao);
      }

      function recusarUsoProprio(destinacao) {
          return $http.post(URL + '/recusarUsoProprio', destinacao);
      }

      function buscaDestinacaoPorId(id, tipoDestinacao) {
          return $http.get(URL + '/' + id + '/' + tipoDestinacao);
      }

     function buscarPessoaFisica(cpfConsultor, cpfConsultado, funcionalidadeConsultora, periodoMinimo, fundamentoLegal, tipoDestinacao) {
         return $http.post(URL_DESTINACAO + 'dados-pessoa/fisica', {
             cpfConsultor: cpfConsultor,
             cpfConsultado: cpfConsultado,
             funcionalidadeConsultora: funcionalidadeConsultora,
             periodoMinimo: periodoMinimo,
             fundamentoLegal: fundamentoLegal,
             tipoDestinacao: tipoDestinacao
         }
         );
     }

     function buscarHistoricoPessoaFisica(campo, cpf) {
         return $http.get(URL_DESTINACAO + 'dados-pessoa/fisica/historico?campo=' + campo + '&cpf=' + cpf);
     }

     function buscarPessoaJuridica(cpfConsultor, cpfConsultado, funcionalidadeConsultora, periodoMinimo, fundamentoLegal, tipoDestinacao) {
         return $http.post(URL_DESTINACAO + 'dados-pessoa/juridica', {
             cpfConsultor: cpfConsultor,
             cpfConsultado: cpfConsultado,
             funcionalidadeConsultora: funcionalidadeConsultora,
             periodoMinimo:periodoMinimo,
             fundamentoLegal: fundamentoLegal,
             tipoDestinacao: tipoDestinacao
             }
          );
     }

     function buscarHistoricoPessoaJuridica(campo, cnpj) {
         return $http.get(URL_DESTINACAO + 'dados-pessoa/juridica/historico?campo=' + campo + '&cnpj=' + cnpj);
     }

    function buscarDocumentosPessoaFisica() {
        return $http.get(URL_DESTINACAO + 'documento-pessoa/fisica')
    }


      function prepararDadosParaUpdate(destinacao, resposta) {

        destinacao.id = resposta.data.resultado.id;
        angular.forEach(resposta.data.resultado.destinacaoImoveis, function (destinacaoImovel, index) {
          destinacao.destinacaoImoveis[index].id = destinacaoImovel.id;
          destinacao.destinacaoImoveis[index].codigoUtilizacao = destinacaoImovel.codigoUtilizacao;
        });

        if(angular.isDefined(resposta.data.resultado.documentos) && resposta.data.resultado.documentos !== null){
          angular.forEach(resposta.data.resultado.documentos, function(documento, index){
            if(destinacao.documentosindex){
              destinacao.documentos[index].id = documento.id;
            }
          });
        }

        angular.forEach(resposta.data.resultado.encargos, function (encargo, index) {
          destinacao.encargos[index].id = encargo.id;
        });
        angular.forEach(resposta.data.resultado.responsaveis, function (responsavel, index) {
          destinacao.responsaveis[index].id = responsavel.id;
        });
        if(angular.isDefined(resposta.data.resultado.utilizacao) && resposta.data.resultado.utilizacao !== null){
          destinacao.utilizacao.id = resposta.data.resultado.utilizacao.id;
        }
        if(angular.isDefined(destinacao.contrato.dataInicio)){
          destinacao.contrato.id = resposta.data.resultado.contrato.id;
        }
        /*if(destinacao.documentos.length !== 0){
          angular.forEach(resposta.data.resultado.documentos, function (documento, index) {
            destinacao.documentos[index].id = documento.id;
          })
        }*/

        if (angular.isDefined(destinacao.atoAutorizativo)
            && angular.isDefined(resposta.data.resultado.atoAutorizativo)) {
          destinacao.atoAutorizativo.id = resposta.data.resultado.atoAutorizativo.id;
        }

        return destinacao;
      }

      function inicializarPropriedades(destinacao, propriedades) {
        Object.keys(destinacao).map(function (prop) {
          if (angular.isUndefined(destinacao[prop]) || destinacao[prop] === null) {
            destinacao[prop] = getValorInicializacao(propriedades, prop);
          }
        });
      }

      function getValorInicializacao(propriedades, propriedade) {
        var tipoInicializacao = propriedades.filter(function(elem) {
          return elem.nome === propriedade;
        }).map(function (prop) {
          return prop.tipo
        });

        if (tipoInicializacao.length > 0) {
          if (tipoInicializacao[0] === 'array') {
            return [];
          }
          return {};
        }
      }

      function alterarStatusDestiancaoEdicao(editar, destinacao) {
        if (editar === true) {
          destinacao.statusDestinacao = {id: 1, descricao: "Ativo"};
        }
      }

      function existeFotoVideo(destinacaoImoveis) {
        var existeFotoVideo = false;
        angular.forEach(destinacaoImoveis, function (elem) {
          if (angular.isDefined(elem.fotoVideo) && elem.fotoVideo.length > 0) {
            existeFotoVideo = true;
          }
        });

        return existeFotoVideo;
      }

      function converterListaArquivoImagem(destinacaoImoveis) {
        var imagens = [];
        angular.forEach(destinacaoImoveis, function (destiancaoImovel) {
          if (angular.isDefined(destiancaoImovel.fotoVideo)) {
            angular.forEach(destiancaoImovel.fotoVideo, function(fotoVideo) {
              var imagem = {id: fotoVideo.id, imagem: fotoVideo.imagem, tipoArquivo: fotoVideo.tipoArquivo};
              imagens.push(imagem);
            });
          }
        });
        return imagens;
      }

      function fechar(bloquear, destinacao) {
        var mensagem;
        if (!destinacao.detalhar) {
          if (destinacao.editar) {
            mensagem = $filter('translate')('msg-mensagem-fechar-editar');
          } else {
            mensagem = $filter('translate')('msg-mensagem-fechar');
          }

          mensagemDestinacaoService.confirmar(mensagem, function () {
            $state.go('destinacao.consultarDestinacao');
          });
        } else {
          $state.go('destinacao.consultarDestinacao')
        }
      }

      function avancar(form, destinacao, atendimento, bloqueiaDadosUtilizacao, indiceTabs) {
          if (form.$invalid) {
              mensagemDestinacaoService.mostrarCamposInvalidos(form);
              throw 'Campos Invalidos';
          }

          validarExisteDestinacaoImovel(destinacao);

          return {indiceTabs: indiceTabs, bloqueiaDadosUtilizacao: true}
      }

      function voltar(bloqueiaDadosUtilizacao, indiceTabs) {
        bloqueiaDadosUtilizacao = false;
        indiceTabs = indiceTabs - 1;
      }

      function validarExisteDestinacaoImovel(destinacao) {
        if (destinacao.destinacaoImoveis.length === 0) {
            var mensagem = $filter('translate')('msg-inserir-imovel-parcela');
            mensagemDestinacaoService.mostrarMensagemError(mensagem);
            throw mensagem;
        }
      }

      var consultarHistoricoDestinacao = function (destinacao) {
          return $http.get(URL + '/buscarHistorico' + destinacao);
      };

      return {
          salvarDoacao: salvarDoacao,
          salvarVenda: salvarVenda,
          salvarPosseInformal: salvarPosseInformal,
          salvarCDRU: salvarCDRU,
          salvarCUEM:salvarCUEM,
          salvarTermoEntrega:salvarTermoEntrega,
          salvarCessaoGratuita: salvarCessaoGratuita,
          salvarUsoProprio: salvarUsoProprio,
          salvarCessaoOnerosa: salvarCessaoOnerosa,
          homologarUsoProprio: homologarUsoProprio,
          recusarUsoProprio: recusarUsoProprio,
          buscaDestinacaoPorId: buscaDestinacaoPorId,
          prepararDadosParaUpdate : prepararDadosParaUpdate,
          inicializarPropriedades: inicializarPropriedades,
          alterarStatusDestiancaoEdicao: alterarStatusDestiancaoEdicao,
          existeFotoVideo: existeFotoVideo,
          converterListaArquivoImagem: converterListaArquivoImagem,
          fechar: fechar,
          avancar: avancar,
          voltar: voltar,
          validarExisteDestinacaoImovel: validarExisteDestinacaoImovel,
          salvarPermissaoUsoImovelInformal: salvarPermissaoUsoImovelInformal,
          buscarPessoaFisica: buscarPessoaFisica,
          buscarHistoricoPessoaFisica: buscarHistoricoPessoaFisica,
          buscarPessoaJuridica: buscarPessoaJuridica,
          buscarHistoricoPessoaJuridica: buscarHistoricoPessoaJuridica,
          buscarDocumentosPessoaFisica: buscarDocumentosPessoaFisica,
          salvarTransferencia: salvarTransferencia,
          consultarHistoricoDestinacao : consultarHistoricoDestinacao
      };

    }

})();
