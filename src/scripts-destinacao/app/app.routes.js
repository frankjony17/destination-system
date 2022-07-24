(function () {

  'use strict';

  angular.module('su-destinacao').config(rotas);

  function rotas($stateProvider) {

    $stateProvider
      .state('destinacao', {
          abstract: true,
          template: '<div id="su-destinacao" ui-view></div>',
          url: '/destinacao',
          resolve: {
            trans: function (TraducoesDestinacao) {
              return new TraducoesDestinacao('scripts-destinacao/app/language');
            }
          }
      })
      .state('destinacao.doacao', {
        url: '/doacao',
        templateUrl: 'scripts-destinacao/pages/doacao/views/doacao.html',
        controller: 'DoacaoController',
        controllerAs: 'doacaoCtrl',
        ncyBreadcrumb: {
          label: 'DESTINAÇÃO DE IMÓVEIS - DOAÇÃO'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/doacao/language')
          }
        }
      })

      .state('destinacao.cuem', {
        url: '/cuem',
        templateUrl: 'scripts-destinacao/pages/CUEM/views/cuem.html',
        controller: 'CUEMController',
        controllerAs: 'cuemCtrl',
        ncyBreadcrumb: {
          label: 'Incluir dados de CUEM'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/CUEM/language')
          }
        }
      })

      .state('destinacao.venda', {
        url: '/venda',
        templateUrl: 'scripts-destinacao/pages/venda/views/venda.html',
        controller: 'VendaController',
        controllerAs: 'vendaCtrl',
        ncyBreadcrumb: {
          label: 'DESTINAÇÃO DE IMÓVEIS - VENDA'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/venda/language')
          }
        }
      })

      .state('destinacao.posseInformal', {
        url: '/posseInformal',
        templateUrl: 'scripts-destinacao/pages/posseInformal/views/posseInformal.html',
        controller: 'PosseInformalController',
        controllerAs: 'posseCtrl',
        ncyBreadcrumb: {
          label: 'DESTINAÇÃO DE IMÓVEIS - POSSE INFORMAL'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/venda/language')
          }
        }
      })
      .state('destinacao.cdru', {
          url: '/cdru',
          templateUrl: 'scripts-destinacao/pages/cdru/views/cdru.html',
          controller: 'CDRUController',
          controllerAs: 'cdruCtrl',
          ncyBreadcrumb: {
            label: 'Incluir dados de CDRU'
          },
          resolve: {
            trans: function (TraducoesDestinacao) {
              return new TraducoesDestinacao('scripts-destinacao/pages/cdru/language')
            }
          }
        })

      .state('destinacao.usoProprio',{
         url:'/usoProprio',
         templateUrl: 'scripts-destinacao/pages/usoProprio/views/uso-proprio.tmpl.html',
         controller: 'UsoProprioController',
         controllerAs:'usoProprioCtrl',
         ncyBreadcrumb: {
           label: 'Incluir dados de Uso Próprio'
        },
        resolve: {
          trans:function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/usoProprio/language')
          }
        }
      })

      .state('destinacao.termoEntrega',{
        url: '/termoEntrega',
        templateUrl: 'scripts-destinacao/pages/termoEntrega/views/termo-entrega.tmpl.html',
        controller: 'TermoEntregaController',
        controllerAs: 'termoEntregaCtrl',
        ncyBreadcrumb: {
          label: 'Termo de Entrega'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/analiseTecnica/language')
          }
        }
      })

        .state('destinacao.analiseTecnica', {
          url: '/analise-tecnica',
          templateUrl: 'scripts-destinacao/pages/analiseTecnica/views/analiseTecnica.html',
          controller: 'AnaliseTecnicaController',
          controllerAs: 'analiseTecnicaCtrl',
          ncyBreadcrumb: {
            label: 'Análise Técnica'
          },
          resolve: {
            trans: function (TraducoesDestinacao) {
              return new TraducoesDestinacao('scripts-destinacao/pages/analiseTecnica/language')
            }
          }
        })
      .state('destinacao.consultarAnaliseTecnica',{
        url: '/analise-tecnica/consulta',
        templateUrl: 'scripts-destinacao/pages/analiseTecnica/views/consultarRequerimento.html',
        controller: 'ConsultarRequerimentoController',
        controllerAs: 'consultarRequerimentoCtrl',
        ncyBreadcrumb: {
          label: 'Consultar Requerimentos de Destinação Pendentes'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/analiseTecnica/language')
          }
        }
    })
      .state('destinacao.consultarDestinacao',{
        url: '/consultar',
        templateUrl: 'scripts-destinacao/pages/consulta/views/consultarDestinacao.html',
        controller: 'ConsultarDestinacaoController',
        controllerAs: 'consultarDestinacaoCtrl',
        ncyBreadcrumb: {
          label: 'Consultar Dados de Instrumentos'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/consulta/language')
          }
        }
      })
      .state('destinacao.transferenciaTitularidade',{
        url: '/transferencia',
        templateUrl: 'scripts-destinacao/pages/transferenciaGestaoTitularidade/views/transferenciaGestaoTitularidade.html',
        controller: 'TransferenciaController',
        controllerAs: 'transferenciaCtrl',
        ncyBreadcrumb: {
          label: 'Transferência de Gestão/Titularidade'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/transferenciaGestaoTitularidade/language')
          }
        }
        })

      .state('destinacao.cessaoGratuita',{
          url: '/cessaoGratuita',
          templateUrl: 'scripts-destinacao/pages/cessaoGratuita/views/cessao-gratuita.tmpl.html',
          controller: 'CessaoGratuitaController',
          controllerAs: 'cessaoGratuitaCtrl',
          ncyBreadcrumb: {
            label: 'Cessão Gratuita'
          },
          resolve: {
            trans: function (TraducoesDestinacao) {
              return new TraducoesDestinacao('scripts-destinacao/pages/cessaoGratuita/language')
            }
          }
        })

      .state('destinacao.permissaoUsoImovelFuncional',{
          url: '/permissaoUsoImovelFuncional',
          templateUrl: 'scripts-destinacao/pages/permissaoDeUsoDeImovelFuncional/views/permissaoUsoImovelFuncional.tmpl.html',
          controller: 'PermissaoUsoImovelFuncionalController',
          controllerAs: 'permissaoUsoImovelFuncionalCtrl',
          ncyBreadcrumb: {
            label: 'Permissão de Uso de Imóvel Funcional '
          },
          resolve: {
            trans: function (TraducoesDestinacao) {
                return new TraducoesDestinacao('scripts-destinacao/pages/permissaoDeUsoDeImovelFuncional/language')
            }
          }
       })

        .state('destinacao.cessaoOnerosa', {
            url:'/cessaoOnerosaCondicaoEspecial',
            templateUrl:'scripts-destinacao/pages/cessaoOnerosaEspecial/views/cessao-onerosa-especial.tmpl.html',
            controller: 'CessaoOnerosaEspecialController',
            controllerAs: 'cessaoOnerosaCtrl',
            ncyBreadcrumb: {
                label: 'Cessão Onerosa/Em Condições Especiais'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/cessaoOnerosaEspecial/language')
                }
            }
        })

        .state('destinacao.dadosPessoas',{
            url: '/dadosPessoas',
            templateUrl: 'scripts-destinacao/pages/dadosPessoas/views/dadosPessoas.html',
            controller: 'dadosPessoasController',
            controllerAs: 'dadosPessoasCtrl',
            ncyBreadcrumb: {
                label: 'Dados Pessoas'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/dadosPessoas/language')
                }
            }
        })

        .state('destinacao.dadosPessoasJuridica',{
          url: '/dadosPessoaJuridica',
          templateUrl: 'scripts-destinacao/pages/dadosPessoas/views/dadosPessoasJuridica.html',
          controller: 'dadosPessoasJuridicaController',
          controllerAs: 'dadosPessoasJuridicaCtrl',
          ncyBreadcrumb: {
              label: 'Dados Pessoas Juridica'
          },
          resolve: {
              trans: function (TraducoesDestinacao) {
                  return new TraducoesDestinacao('scripts-destinacao/pages/dadosPessoas/language')
              }
          }
      })

      .state('destinacao.parcelaImovel',{
        url: '/parcelaImovel',
        templateUrl: 'scripts-destinacao/pages/parcelas/views/manter-parcela.html',
        controller: 'ParcelaController',
        controllerAs: 'parcelaCtrl',
        ncyBreadcrumb: {
          label: 'Gerenciar Parcelas'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/parcelas/language')
          }
        }
      })

      .state('destinacao.criarParcelaImovel',{
        url: '/criarParcelaImovel',
        templateUrl: 'scripts-destinacao/pages/parcelas/views/parcela-imoveis.html',
        controller: 'CriarParcelaController',
        controllerAs: 'criarParcelaCtrl',
        ncyBreadcrumb: {
          label: 'Criar Parcela Imovel'
        },
        resolve: {
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/parcelas/language')
          }
        }
      })

      .state('destinacao.redimensionarParcelaImovel',{
        url: '/redimensionarParcelaImovel',
        templateUrl: 'scripts-destinacao/pages/parcelas/views/redimensionar-parcela-imoveis.html',
        controller: 'RedimensionarParcelaController',
        controllerAs: 'redimensionarParcelaCtrl',
        ncyBreadcrumb: {
            label: 'Redimensionar Parcela Imovel'
        },
        resolve: {
            trans: function (TraducoesDestinacao) {
                return new TraducoesDestinacao('scripts-destinacao/pages/parcelas/language')
            }
        }
      })


      .state('destinacao.homologarUsoProprio',{
        url:'/homologarUsoProprio',
        templateUrl:'scripts-destinacao/pages/homologarUsoProprio/views/homologarUsoProprio.html',
        controller:'homologarUsoProprioController',
        controllerAs: 'homologarUsoProprioCtrl',
        ncyBreadcrumb: {
          label: 'Homologar Uso Próprio'
        },
        resolve:{
          trans: function (TraducoesDestinacao) {
            return new TraducoesDestinacao('scripts-destinacao/pages/homologarUsoProprio/language')
          }
        }
      })

      .state('destinacao.incluirDocumento',{
        url:'/incluirDocumento',
       templateUrl:'scripts-destinacao/app/directives/formularios/incluirDocumento/partials/views/page-incluir-documento.html',
        controller:'incluirDocumentoController',
        controllerAs:'incluirDocumentoCtrl',
        ncyBreadcrumb:{
          label: 'Incluir Documento'
        }

      })

      .state('destinacao.principal',{
        url: '/principal',
        templateUrl: 'scripts-destinacao/pages/home/view/home.tmpl.html',
        controller: 'HomeDestinacaoController',
        controllerAs: 'princiapalCtrl'
      })


      .state('destinacao.encargosPage',{
        url:'/encargosPage',
        templateUrl:'scripts-destinacao/app/directives/formularios/encargosPage/partials/views/inserirEncargoPage.html',
        controller:'incluirEncargoPageController',
        controllerAs:'incluirEncargoPageCtrl',
        ncyBreadcrumb:{
          label: 'Incluir Encargo'
        }

      })


      .state('destinacao.inserirImovelParcela',{
        url: '/inserirImovelParcela',
        templateUrl: 'scripts-destinacao/app/directives/formularios/inserirImovelParcelaPage/page/views/inserirImovelParcelaPage.html',
        controller: 'InserirDadosImovelParcelaPageController',
        controllerAs: 'inserirDadosImovelParcelaCtrl',
        ncyBreadcrumb: {
          label: 'Inserir Dados do Imóvel Parcela'
        }
      })

        .state('destinacao.incluirImovel',{
            url: '/incluirImovel',
            templateUrl: 'scripts-destinacao/app/directives/formularios/dadosImovel/partials/views/modalInserirImovel.html',
            controller:'incluirImovelController',
            controllerAs: 'incluirImovelCtrl',
            ncyBreadcrumb: {
                label: 'Inserir Dados do Imóvel'
            }
        })

      .state('destinacao.encerrarDestinacao', {
          url: '/encerrarDestinacao',
          templateUrl: 'scripts-destinacao/pages/encerrarDestinacao/views/encerrarDestinacao.html',
          controller: 'EncerrarDestinacaoController',
          controllerAs: 'encerrarDestinacaoCtrl',
          ncyBreadcrumb: {
            label: 'Encerrar Destinação'
          },
          resolve: {
            trans: function (TraducoesDestinacao) {
              return new TraducoesDestinacao('scripts-destinacao/pages/encerrarDestinacao/language')
            }
          }
        })

        .state('destinacao.incluirResponsavelDestinatario', {
            url: '/incluirResponsavel',
            templateUrl: 'scripts-destinacao/pages/responsavel/views/incluirResponsavelDestinatario.html',
            controller: 'incluirResponsavelDestinacaoController',
            controllerAs: 'incluirResponsavelDestinacaoCtrl',
            ncyBreadcrumb: {
                label: 'Incluir Responsável'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/responsavel/language')
                }
            }
        })

        .state('destinacao.enderecoCorrespondencia',{
            url:'/enderecoCorrespondencia',
            templateUrl:'scripts-destinacao/pages/enderecoCorrespondencia/views/enderecoCorrespondencia.html',
            controller: 'enderecoCorrespondenciaController',
            controllerAs: 'enderecoCorrespondenciaCtrl',
            ncyBreadcrumb: {
                label: 'Dados Endereço Correspondência',
                parent: 'destinacao.incluirResponsavelDestinatario'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/enderecoCorrespondencia/language')
                }
            }
        })

        .state('destinacao.enderecoCorrespondenciaResponsavel',{
            url:'/enderecoCorrespondenciaResponsavel',
            templateUrl:'scripts-destinacao/pages/enderecoCorrespondencia/views/enderecoCorrespondencia.html',
            controller: 'enderecoCorrespondenciaResponsavelController',
            controllerAs: 'enderecoCorrespondenciaResponsavelCtrl',
            ncyBreadcrumb: {
                label: 'Dados Endereço Correspondência',
                parent: 'destinacao.incluirResponsavelDestinatario'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/enderecoCorrespondencia/language')
                }
            }
        })

        .state('destinacao.enderecoCorrespondenciaInterveniente',{
            url:'/enderecoCorrespondenciaInterveniente',
            templateUrl:'scripts-destinacao/pages/enderecoCorrespondencia/views/enderecoCorrespondencia.html',
            controller: 'enderecoCorrespondenciaIntervenienteController',
            controllerAs: 'enderecoCorrespondenciaIntervenienteCtrl',
            ncyBreadcrumb: {
                label: 'Dados Endereço Correspondência',
                parent: 'destinacao.cessaoGratuita'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/enderecoCorrespondencia/language')
                }
            }
        })

        .state('destinacao.cancelamentoEncerramentoUtilizacao',{
            url:'/cancelarEncerrarUtilizacao',
            templateUrl:'scripts-destinacao/pages/cancelarEncerrarUtilizacao/views/cancelarEncerrarUtilizacao.html',
            controller: 'cancelarEncerrarUtilizacaoController',
            controllerAs: 'cancelarEncerrarUtilizacaoCtrl',
            ncyBreadcrumb: {
                label: 'Cancelar/Encerrar Utilização'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/cancelarEncerrarUtilizacao/language')
                }
            }
        })
        .state('destinacao.consultarUtilizacaoDisponivel',{
            url:'/consultarUtilizacaoDisponivel',
            templateUrl:'scripts-destinacao/pages/consultarUtilizacaoDisponivel/views/consultarUtilizacao.html',
            controller: 'consultarUtilizacaoController',
            controllerAs: 'consultarUtilizacaoCtrl',
            ncyBreadcrumb:{
                label: 'Consultar Utilização Disponível'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/consultarUtilizacaoDisponivel/language')
                }
            }
        })
        .state('destinacao.afetacao' , {
            url:'/cadastrar-reserva-restricao',
            templateUrl:'scripts-destinacao/pages/afetacao/view/cadastrarAfetacao.html',
            controller:'AfetacaoController',
            controllerAs:'AfetacaoCtrl',
            ncyBreadcrumb:{
                label: 'Cadastrar Reserva/Restrição de Uso'
            },
            resolve: {
                trans: function (TraducoesDestinacao) {
                    return new TraducoesDestinacao('scripts-destinacao/pages/afetacao/language')
                }
            }
        })

        .state('destinacao.incluirImovelAfetacaoPage' , {
            url:'/incluirImovelReservaRestricao',
            templateUrl:'scripts-destinacao/app/directives/formularios/inserirDadosDeImovelAfetacao/partials/view/inserirImovelAfetacaoPage.html',
            controller:'incluirImovelAfetacaoPage',
            controllerAs:'incluirImovelAfetacaoPageCtrl',
            ncyBreadcrumb:{
                label: 'Inserir Dados do Imóvel'
            }
        })
  }

})();
