(function () {
    "use strict";
    angular.module("su-destinacao")
        .controller('incluirResponsavelDestinacaoController', function ($scope, responsavelService, destinacaoEscopoCompartilhadoService, $state, destinacaoService,
                                                                        mensagemDestinacaoService, $rootScope) {

            var vm = $scope;

            vm.responsavel = {};
            vm.historico = [];
            vm.fundamentoLegal = {};
            vm.listaEstadosCivil = [];
            vm.listaOpcoesPadrao = [];

            var TAMANHO_CPF = 11;
            var TAMANHO_CNPJ = 14;
            var funcionalidadeConsultura = 'SU_DESTINAÇÃO/';
            var PERIODO_MINIMO = 8760;

            var cont = 0;

            vm.contTelefone = 1;

            vm.BRASIL = 'BRASIL';

            function init() {
                if (destinacaoEscopoCompartilhadoService.getDestinacao()) {
                    if (destinacaoEscopoCompartilhadoService.getObjeto('responsavel')) {
                        vm.responsavel = destinacaoEscopoCompartilhadoService.getObjeto('responsavel');
                    }

                    if(destinacaoEscopoCompartilhadoService.getObjeto('fundamentoLegal')) {
                        vm.fundamentoLegal = destinacaoEscopoCompartilhadoService.getObjeto('fundamentoLegal');
                    }

                    vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
                    vm.nomeState = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();

                    vm.dadosResponsavel = vm.destinacao.dadosResponsavel;
                    funcionalidadeConsultura += vm.destinacao.tipoDestinacaoEnum;

                    if (vm.dadosResponsavel && !vm.dadosResponsavel.responsaveis){
                        vm.dadosResponsavel.responsaveis = [];
                    }
                } else {
                    window.history.back();
                }
                buscarListaEstadoCivil();
                buscarListaOpcoesPadrao();
                if(vm.responsavel.dataObito){
                   vm.responsavel.dataObito = new Date(vm.responsavel.dataObito);
                }
            }

            var buscarListaEstadoCivil = function() {
                responsavelService.buscarEstadosCivilEnum().then(function(resp) {
                    vm.listaEstadosCivil = resp.data;
                });
            };
            var buscarListaOpcoesPadrao = function() {
                responsavelService.buscarOpcoesPadraoEnum().then(function(resp) {
                    vm.listaOpcoesPadrao = resp.data;
                });
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

            vm.incluirEnderecoCorrespondencia = function() {
                destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
                destinacaoEscopoCompartilhadoService.setObjetos('responsavel', vm.responsavel);

                $state.go('destinacao.enderecoCorrespondenciaResponsavel');
            };

            vm.fecharResponsavel = function() {
                redirecionarPaginaAnterior();
            };

            var redirecionarPaginaAnterior = function() {
                vm.destinacao.recarregarDadosEscopo = true;
                vm.destinacao.dadosResponsavel = vm.dadosResponsavel;
                destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeState);
                destinacaoEscopoCompartilhadoService.setObjetos('fundamentoLegal', vm.fundamentoLegal);
                $state.go(vm.nomeState);
            };

            function verificarPessoaJuridica () {
                try {
                    return vm.responsavel.cpfCnpj.length === TAMANHO_CNPJ;
                } catch(erro) {
                    return false;
                }
            }

            vm.salvarResponsavel = function () {
                if(!vm.formularioDadosResponsavel.$invalid){

                    if(verificarTipoDestinacao()) {
                        if (vm.responsavel.cpfCnpj) {
                            var jaIncluido = false;
                            angular.forEach(vm.dadosResponsavel.responsaveis, function (r) {
                                if (r.cpfCnpj === vm.responsavel.cpfCnpj && r.cpfCnpj.length != TAMANHO_CNPJ) {
                                    jaIncluido = true;
                                }
                            });
                            if (jaIncluido) {
                                mensagemDestinacaoService.mostrarMensagemError("Responsável já incluído");
                            } else {
                                addResponsavel();
                            }
                        }
                    }
                } else {
                    mensagemDestinacaoService.mostrarCamposInvalidos(vm.formularioDadosResponsavel);
                }
            };

            vm.verificarEmail = function () {
                if(vm.responsavel.email !== vm.responsavel.emailConfirmacao){
                    vm.responsavel.emailConfirmacao = '';
                    mensagemDestinacaoService.mostrarMensagemError("Os dados não conferem");
                }
            };

            var addResponsavel = function() {
                vm.responsavel.isPrincipal = false;
                vm.dadosResponsavel.responsaveis.push(vm.responsavel);
                redirecionarPaginaAnterior();
            };

            function verificarTipoDestinacao() {
                if($state.current.url == "/termoEntrega"){
                    if(!verificarPessoaJuridica()) {
                        mensagemDestinacaoService.mostrarMensagemError("Termo de Entrega permite somente CNPJ");
                        return false;
                    }
                }
                return true;
            }

            vm.buscarDadosPessoaFisicaEJuridica = function() {
                if (vm.responsavel.cpfCnpj && (vm.responsavel.cpfCnpj.length==TAMANHO_CPF || vm.responsavel.cpfCnpj.length==TAMANHO_CNPJ)) {
                    var campo = null;
                    var obj = {};
                    var i = 0;
                    var cpfUsuarioConsultor = $rootScope.usuarioLogado.cpf;
                    /**BUSCAR PESSOA JURIDICA**/
                    if (verificarPessoaJuridica()) {
                        destinacaoService.buscarPessoaJuridica(cpfUsuarioConsultor, vm.responsavel.cpfCnpj, funcionalidadeConsultura, PERIODO_MINIMO,vm.fundamentoLegal, vm.destinacao.tipoDestinacaoEnum).then(function (retorno) {
                            if (retorno.data.erros && retorno.data.erros.length > 0) {
                                mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                            } else {
                                var responsavel = retorno.data.resultado;
                                vm.responsavel = responsavel;
                                vm.responsavel.cpfCnpj = responsavel.cnpj;
                                vm.responsavel.nome = responsavel.nomeEmpresarial;
                                vm.responsavel.enderecoCorrespondencia = {endereco: angular.copy(responsavel.endereco)};
                                vm.pessoaJuridica = true;
                                adicionarTelefones(responsavel.telefones);
                                delete vm.responsavel.endereco;
                            }
                        }, function (error) {
                            mensagemDestinacaoService.mostrarMensagemError(error.data.message);
                            vm.responsavel.cpfCnpj= '';

                        });
                        campo = ['cnpj','nomeEmpresarial', 'nomeFantasia', 'situacaoCadastral', 'dataSituacaoCadastral', 'naturezaJuridica', 'dataAbertura', 'cnaePrincipal', 'cpfResponsavel', 'nomeResponsavel', 'cnpjSucedida'];
                        obj = {};
                        i = 0;
                        angular.forEach(campo, function (campo) {
                            destinacaoService.buscarHistoricoPessoaJuridica(campo, vm.responsavel.cpfCnpj).then(function (retorno) {
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
                            destinacaoService.buscarPessoaFisica(cpfUsuarioConsultor, vm.responsavel.cpfCnpj, funcionalidadeConsultura, PERIODO_MINIMO, vm.fundamentoLegal, vm.destinacao.tipoDestinacaoEnum).then(function (retorno) {
                                if (retorno.data.erros && retorno.data.erros.length > 0) {
                                    mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                                } else {
                                    var responsavel = retorno.data.resultado;
                                    vm.responsavel = responsavel;
                                    vm.responsavel.cpfCnpj = responsavel.cpf;
                                    vm.responsavel.enderecoCorrespondencia = {endereco: angular.copy(responsavel.endereco)};
                                    vm.pessoaJuridica = false;
                                    adicionarTelefones(responsavel.telefones);

                                    delete vm.responsavel.endereco;
                                }
                            }, function (error) {
                                mensagemDestinacaoService.mostrarMensagemError(error.data.message);
                                vm.responsavel.cpfCnpj= '';

                            });
                            campo = ['cpf', 'situacaoCadastral', 'nome', 'dataNascimento', 'anoObito', 'nomeMae', 'sexo', 'estrangeiro', 'tituloEleitor', 'endereco'];
                            obj = {};
                            i = 0;
                            angular.forEach(campo, function (campo) {
                                destinacaoService.buscarHistoricoPessoaFisica(campo, vm.responsavel.cpfCnpj).then(function (retorno) {
                                    if (retorno.data.erros && retorno.data.erros.length > 0) {
                                        mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                                    } else {
                                        obj[campo] = retorno.data.resultado;
                                        if (i == 9) {
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
                vm.responsavel.telefones = [];
                angular.forEach(telefones, function(tel) {
                        vm.responsavel.telefones.push({
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
            /*function addResponsavel (responsavel) {
                if ($scope.pessoaJuridica) {
                    $scope.responsaveis = [];
                    responsavel.familiasBeneficiadas = [];
                    $scope.mostrarTabelaResponsaveis = true;
                    $scope.responsaveis[0] = angular.copy(responsavel);
                } else {
                    verificarPermiteAddMaisUmResponsavel();
                    if ($scope.responsaveis.length > 0 && $scope.responsaveis[0].cnpj ) {
                        $scope.responsaveis = [];
                    }
                    $scope.mostrarTabelaResponsaveis = true;
                    $scope.responsaveis.push(responsavel);
                }
            }

            function verificarPermiteAddMaisUmResponsavel () {
                if (!$scope.coletivo && $scope.responsaveis.length >= 1) {
                    var mensagem = $filter('translate')('msg-mais-um-beneficiario-tipo-individual');
                    mensagemDestinacaoService.mostrarMensagemError(mensagem);
                    throw mensagem;
                }
            }*/

            init();

        })
})();
