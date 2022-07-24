(function () {

  angular
    .module('su-destinacao')
    .directive('dadosResponsavelDestinatario', directive);

  function directive ($state, destinacaoEscopoCompartilhadoService, responsavelService, destinacaoService, mensagemDestinacaoService, $filter, $rootScope) {
    return {
      restrict: 'EA',
      scope:{
          dadosResponsavel:'=?',
          responsaveis: '=?',
        atendimento: '=',
        tipoDestinacao: '=',
        destinacoesImoveis: '=',
        tipoModalidade: '=?',
        bloquear: '=',
        modoEditar: '=',
          destinacao: '=?',
          nomeState: '=?',
          fundamento: '='
      },
      templateUrl: 'scripts-destinacao/app/directives/formularios/dadosResponsavel/templates/dadosResponsavel.html',
      link: function ($scope) {

          var vm = $scope;

          vm.historico = [];
          vm.contTelefone = 1;
          var funcionalidadeConsultura = 'SU_DESTINAÇÃO/';
          var cont = 0;
          var TAMANHO_CNPJ = 14;
          var TAMANHO_CPF = 11;
          var PERIODO_MINIMO = 8760;

          vm.listaTiposPosseOcupacao = [];
          vm.listaTiposRepresentacao = [];
          vm.interveniente = {};

          vm.paginacaoResponsaveis = [];

          vm.INDIVIDUAL = 'INDIVIDUAL';
          vm.COLETIVO = 'COLETIVO';
          vm.OCUPANTE_NAO_IDENTIFICADO = 'OCUPANTE_NAO_IDENTIFICADO';

          vm.FORMAL = 'FORMAL';
          vm.INFORMAL = 'INFORMAL';
          vm.SEM_REPRESENTACAO = 'SEM_REPRESENTACAO';

          vm.BRASIL = 'BRASIL';

          var init = function() {

              if (destinacaoEscopoCompartilhadoService.getDestinacao()) {
                  if (destinacaoEscopoCompartilhadoService.getObjeto('interveniente')) {
                      vm.dadosResponsavel.interveniente = destinacaoEscopoCompartilhadoService.getObjeto('interveniente');
                  }

                  vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                  vm.nomeState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
                  vm.dadosResponsavel = vm.destinacao.dadosResponsavel;
                  if (vm.dadosResponsavel && !vm.dadosResponsavel.interveniente){
                      vm.dadosResponsavel.interveniente = [];
                  }
              }

              vm.registroInicial = 1;
              vm.tamanhoLimite = 5;
              vm.totalItems = 0;
              funcionalidadeConsultura += vm.destinacao.tipoDestinacaoEnum;

              buscarTiposPosseOcupacao();
              buscarTiposRepresentacao();

          };

          var responsavelPrincipalInit = function () {
            angular.forEach($scope.dadosResponsavel.responsaveis, function (responsavel) {
                if(responsavel.isPrincipal){
                    $scope.dadosResponsavel.responsavelPrincipal = responsavel.cpfCnpj;
                }
            })
          };

          var buscarTiposPosseOcupacao = function() {
              responsavelService.buscarTiposPosseOcupacaoEnum().then(function(resp) {
                  vm.listaTiposPosseOcupacao = resp.data;
                  if(vm.tipoDestinacao !== "POSSE_INFORMAL"){
                        angular.forEach(vm.listaTiposPosseOcupacao, function (tipoPosse, index) {
                            if (tipoPosse.descricao === "Ocupante não identificado"){
                                vm.listaTiposPosseOcupacao.splice(index, 1);
                            }
                        })
                    }
              });
          };

          var buscarTiposRepresentacao = function() {
              responsavelService.buscarTiposRepresentacaoEnum().then(function(resp) {
                  vm.listaTiposRepresentacao = resp.data;
              });
          };

          vm.$watch('dadosResponsavel.responsaveis', function() {
              vm.paginarListaResponsaveis();
          });

          vm.incluirResponsavelDestinatarioLista = function() {
              destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
              destinacaoEscopoCompartilhadoService.setObjetos('fundamentoLegal', vm.fundamento);
              $state.go('destinacao.incluirResponsavelDestinatario');
          };

          vm.incluirEnderecoCorrespondencia = function() {
              destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);

              $state.go('destinacao.enderecoCorrespondencia');
          };

          vm.paginarListaResponsaveis = function() {
              vm.paginacaoResponsaveis = [];
              if(vm.dadosResponsavel){
                  vm.totalItems = vm.dadosResponsavel.responsaveis.length;
                  if (vm.totalItems < vm.tamanhoLimite) {
                      vm.paginacaoResponsaveis = vm.dadosResponsavel.responsaveis;
                  } else {
                      for (var i = ((vm.registroInicial - 1) * vm.tamanhoLimite); i < vm.totalItems; i++) {
                          vm.paginacaoResponsaveis.push(vm.dadosResponsavel.responsaveis[i]);
                          if (vm.paginacaoResponsaveis.length == vm.tamanhoLimite) {
                              break;
                          }
                      }
                  }
              }
              responsavelPrincipalInit();
          };

          init();

        vm.removerResponsavel = function (cpfCnpj) {
            var indice;
            mensagemDestinacaoService.confirmar($filter('translate')('msg-remover-responsavel'),
                function () {
                    for (var i = 0; vm.dadosResponsavel.responsaveis.length; i++) {
                        if (cpfCnpj == vm.dadosResponsavel.responsaveis[i].cpfCnpj) {
                            indice = i;
                            break;
                        }
                    }
                    vm.dadosResponsavel.responsaveis.splice(indice, 1);
            },function () {
                 return;
                });

        };

          vm.buscarDadosPessoaFisicaEJuridica = function() {
              if (vm.dadosResponsavel.interveniente.cpfCnpj && (vm.dadosResponsavel.interveniente.cpfCnpj.length==TAMANHO_CPF || vm.dadosResponsavel.interveniente.cpfCnpj.length==TAMANHO_CNPJ)) {
                  var campo = null;
                  var obj = {};
                  var i = 0;
                  var cpfUsuarioConsultor = $rootScope.usuarioLogado.cpf;
                  /**BUSCAR PESSOA JURIDICA**/
                  if (verificarPessoaJuridica()) {
                      destinacaoService.buscarPessoaJuridica(cpfUsuarioConsultor, vm.dadosResponsavel.interveniente.cpfCnpj, funcionalidadeConsultura, PERIODO_MINIMO, vm.destinacao.tipoDestinacaoEnum).then(function (retorno) {
                          if (retorno.data.erros && retorno.data.erros.length > 0) {
                              mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                          } else {
                              var interveniente = retorno.data.resultado;
                              vm.dadosResponsavel.interveniente = interveniente;
                              vm.dadosResponsavel.interveniente.cpfCnpj = interveniente.cnpj;
                              vm.dadosResponsavel.interveniente.nome = interveniente.nomeEmpresarial;
                              vm.dadosResponsavel.interveniente.enderecoCorrespondencia = {endereco: angular.copy(interveniente.endereco)};
                              vm.dadosResponsavel.pessoaJuridica = true;
                              adicionarTelefones(interveniente.telefones);
                              delete vm.dadosResponsavel.interveniente.endereco;
                          }
                      });
                      campo = ['cnpj','nomeEmpresarial', 'nomeFantasia', 'situacaoCadastral', 'dataSituacaoCadastral', 'naturezaJuridica', 'dataAbertura', 'cnaePrincipal', 'cpfInterveniente', 'nomeInterveniente', 'cnpjSucedida'];
                      obj = {};
                      i = 0;
                      angular.forEach(campo, function (campo) {
                          destinacaoService.buscarHistoricoPessoaJuridica(campo, vm.dadosResponsavel.interveniente.cpfCnpj).then(function (retorno) {
                              if(retorno.data.erros && retorno.data.erros.length > 0){
                                  mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                              } else {
                                  obj[campo] = retorno.data.resultado;
                                  if (i==9) {
                                      incrementarHistorico(obj);
                                      obj = {};
                                  }
                              }
                              i++;
                          });
                      });
                      /**BUSCAR PESSOA FISICA**/
                  } else {
                      destinacaoService.buscarPessoaFisica(cpfUsuarioConsultor, vm.dadosResponsavel.interveniente.cpfCnpj, funcionalidadeConsultura, PERIODO_MINIMO).then(function (retorno) {
                          if(retorno.data.erros && retorno.data.erros.length > 0){
                              mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                          } else {
                              var interveniente = retorno.data.resultado;
                              vm.dadosResponsavel.interveniente = interveniente;
                              vm.dadosResponsavel.interveniente.cpfCnpj = interveniente.cpf;
                              vm.dadosResponsavel.interveniente.enderecoCorrespondencia = {endereco: angular.copy(interveniente.endereco)};
                              vm.dadosResponsavel.pessoaJuridica = false;
                              vm.dadosResponsavel.interveniente.isPossui = true;
                              adicionarTelefones(dadosResponsavel.interveniente.telefones);

                              delete vm.dadosResponsavel.interveniente.endereco;
                          }
                      });
                      campo = ['cpf','situacaoCadastral', 'nome', 'dataNascimento', 'anoObito', 'nomeMae', 'sexo', 'estrangeiro', 'tituloEleitor', 'endereco'];
                      obj = {};
                      i = 0;
                      angular.forEach(campo, function (campo) {
                          destinacaoService.buscarHistoricoPessoaFisica(campo, vm.dadosResponsavel.interveniente.cpfCnpj).then(function (retorno) {
                              if(retorno.data.erros && retorno.data.erros.length > 0){
                                  mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                              } else {
                                  obj[campo] = retorno.data.resultado;
                                  if (i==9) {
                                      incrementarHistorico(obj);
                                      obj = {};
                                  }
                              }
                              i++;
                          });
                      });
                  }
              }
          };

          function adicionarTelefones(telefones) {
              vm.dadosResponsavel.interveniente.telefones = [];
              angular.forEach(telefones, function(tel) {
                  vm.dadosResponsavel.interveniente.telefones.push({
                      tel: 'Telefone ' + vm.contTelefone,
                      ddd: tel.ddd,
                      numero: tel.numero,
                      isPrincipal: false,
                      contador: vm.contTelefone
                  });
                  vm.contTelefone++;
              });
          }

          function incrementarHistorico(obj) {
              vm.historico[cont] = obj;
              cont++;
          }

          vm.detalharPessoaa= function(interveniente) {
              if(dadosResponsavel.interveniente.cpfCnpj && dadosResponsavel.interveniente.cpfCnpj.length == 11) {
                  window.sessionStorage.setItem('dadoPessoaFisica', JSON.stringify(interveniente));
                  var rota = $state.href('destinacao.dadosPessoas');
                  window.open(rota, '_blank');
              } else if (dadosResponsavel.interveniente.cpfCnpj && dadosResponsavel.interveniente.cpfCnpj.length == 14) {
                  window.sessionStorage.setItem('dadoPessoaJuridica', JSON.stringify(interveniente));
                  var rota = $state.href('destinacao.dadosPessoasJuridica');
                  window.open(rota, '_blank');
              }
          };

          vm.incluirEnderecoCorrespondenciaa = function() {
              destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
              destinacaoEscopoCompartilhadoService.setObjetos('interveniente', vm.dadosResponsavel.interveniente);

              $state.go('destinacao.enderecoCorrespondenciaInterveniente');
          };

          function verificarPessoaJuridica () {
              try {
                  return vm.dadosResponsavel.interveniente.cpfCnpj.length === TAMANHO_CNPJ;
              } catch(erro) {
                  return false;
              }
          }

          vm.verificarEmail = function () {
              if(vm.dadosResponsavel.interveniente.email !== vm.dadosResponsavel.interveniente.emailConfirmacao){
                  vm.dadosResponsavel.interveniente.emailConfirmacao = '';
                  mensagemDestinacaoService.mostrarMensagemError("Os dados não conferem");
              }
          };

          vm.salvarInterveniente = function () {
          if (vm.interveniente.cpfCnpj) {
              var jaIncluido = false;
              angular.forEach(vm.dadosResponsavel.interveniente, function (r) {
                  if (r.cpfCnpj === vm.interveniente.cpfCnpj && r.cpfCnpj.length != TAMANHO_CNPJ) {
                      jaIncluido = true;
                  }
              });
              if (jaIncluido) {
                  mensagemDestinacaoService.mostrarMensagemError("Interveniente já incluído");
              } else {
                  addInterveniente();
              }
          }
      };

          var addInterveniente = function() {
              vm.dadosResponsavel.interveniente.push(vm.interveniente);
          };


        vm.editar = function (responsavel) {
            destinacaoEscopoCompartilhadoService.setObjetos('responsavel', responsavel);
            vm.incluirResponsavelDestinatarioLista();
        };

        vm.responsavelPrincipal = function (cpfCnpj) {
            angular.forEach(vm.dadosResponsavel.responsaveis, function (responsavel, $index) {
                if(responsavel.cpfCnpj === cpfCnpj){
                    vm.dadosResponsavel.responsaveis[$index].isPrincipal = true;
                } else {
                    vm.dadosResponsavel.responsaveis[$index].isPrincipal = false;
                }
            })
        };


          vm.detalharPessoa = function(responsavel) {
              if(responsavel.cpfCnpj && responsavel.cpfCnpj.length == 11) {
                  window.sessionStorage.setItem('dadoPessoaFisica', JSON.stringify(responsavel));
                  var rota = $state.href('destinacao.dadosPessoas');
                  window.open(rota, '_blank');
              } else if (responsavel.cpfCnpj && responsavel.cpfCnpj.length == 14) {
                  window.sessionStorage.setItem('dadoPessoaJuridica', JSON.stringify(responsavel));
                  var rota = $state.href('destinacao.dadosPessoasJuridica');
                  window.open(rota, '_blank');
              }
          };
      }
    };
  }


})();
