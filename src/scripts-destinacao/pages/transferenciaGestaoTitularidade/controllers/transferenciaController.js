/**
 * Created by basis on 12/01/17.
 */
(function(){
  'use strict';

  angular.module("su-destinacao").controller("TransferenciaController", transferenciaController);

  function transferenciaController($state, $filter, mensagemDestinacaoService, transferenciaService, arquivoService, destinacaoEscopoCompartilhadoService, destinacaoService, $q, destinacaoServiceUtil, $rootScope){
    var vm = this;

      var TIPO_DESTINACAO = 'TRANSFERENCIA';
      var funcionalidadeConsultura = 'SU_DESTINAÇÃO/';
      var PERIODO_MINIMO = 8760;
      var cont = 0;
      vm.BRASIL = 'BRASIL';

      vm.contTelefone = 1;

      vm.tabela = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
      };

      vm.transferencia = {
          destinacaoImoveis: [],
          imoveis: [],
          tipoDestinacaoEnum: "TRANSFERENCIA",
          destinatario: {
            endereco: {}
          },
          atosComplementares: [],
          recarregarDadosEscopo: false
        };

      vm.PERMISSOES = '';
      vm.permissaoConcedida = true;

      vm.nomeState = 'destinacao.transferenciaTitularidade';


    function init() {
        var destinacao = angular.copy(destinacaoEscopoCompartilhadoService.getDestinacao());
        if (angular.isUndefined(destinacao) || destinacao.editar) {
            vm.PERMISSOES = 'DESTINACAOMANTERTRANSFERENCIA'
        } else {
            vm.PERMISSOES = 'DESTINACAO_CONSULTAR_DESTINACAO_TRANSFERENCIA';
        }

        var atendimento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('atendimento'));
        var indiceRetorno = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('indiceRetorno'));
        var objetoOriginal = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('objetoOriginal'));

        destinacaoEscopoCompartilhadoService.limparEscopo();



        destinacaoEscopoCompartilhadoService.setObjetos('rota', 'destinacao.transferenciaTitularidade');
        $q.all([destinacaoServiceUtil.carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento),
            destinacaoServiceUtil.tabRetorno(indiceRetorno)])
            .then(function (retorno) {
                if (angular.isDefined(retorno[0])) {
                    vm.transferencia = retorno[0].destinacao;
                    vm.imagens = retorno[0].imagens;
                    vm.atendimento = retorno[0].atendimento;
                    vm.carregarDadosUtilizacao = retorno[0].carregarDadosUtilizacao;
                    vm.objetoOriginal = destinacaoServiceUtil.criarObjetoOriginal(vm.transferencia, objetoOriginal);
                    vm.transferencia.dataInicioFundamento = new Date(vm.transferencia.dataInicioFundamento);
                    vm.transferencia.dataFinalFundamento = new Date(vm.transferencia.dataFinalFundamento);
                } else {
                    vm.carregarDadosUtilizacao = true;
                }
            });

        carregarListaTipoTransferencia();
        carregarListaTipoDestinatario();
        carregarListaAutarquiasFundacoes();
    }




    init();


      function carregarListaAutarquiasFundacoes() {
          transferenciaService.buscarListaAutarquias().then(function(resposta){
              vm.listaAutarquiasFundacao = resposta.data.resposta;
          });
      }

    function carregarListaTipoTransferencia() {
      transferenciaService.carregarListaTipoTransferencia().then(function(resposta){
        vm.tipoTransferencias = resposta.data.resultado;
      })
    }
      function incluirEnderecoCorrespondencia() {
          destinacaoEscopoCompartilhadoService.setDestinacao(vm.transferencia, vm.nomeState);
          destinacaoEscopoCompartilhadoService.setObjetos('responsavel', vm.transferencia.destinatario);

          $state.go('destinacao.enderecoCorrespondencia');
      }

    function carregarListaTipoDestinatario() {
      transferenciaService.carregarListaTipoDestinatario().then(function(resposta){
        vm.tipoDestinatarios = resposta.data.resultado;
      })
    }
    function gravar(){
          atribuirImoveis();
        vm.transferencia.numeroAtendimento = vm.atendimento.numeroAtendimento;
        vm.transferencia.numeroProcesso = vm.atendimento.numeroProcedimento;
        if(formularioValido()){
            vm.transferencia.codFundamentoLegal = vm.transferencia.codFundamentoLegal.id;

            destinacaoService.salvarTransferencia(vm.transferencia).then(function(){
                mensagemDestinacaoService.mostrarMensagemSucesso(vm.transferencia.editar ? "Dados alterados com sucesso" : "Transferido com sucesso!");
                $state.go('destinacao.consultarDestinacao');
            }, function (erro) {
                if (erro.data.erros) {
                    mensagemDestinacaoService.mostrarMensagemError(erro.data.erros);
                }
            });
          }

    }

    function atribuirImoveis(){
          if(!vm.transferencia.editar){
              angular.forEach(vm.transferencia.destinacaoImoveis, function(item){
                vm.transferencia.imoveis.push(item.imovel);
              });
          }
    }

    function formularioValido(){
      if (vm.form.$invalid) {
        mensagemDestinacaoService.mostrarCamposInvalidos(vm.form);
        return false;
      }

      if (vm.transferencia.destinacaoImoveis.length < 1) {
        mensagemDestinacaoService.mostrarMensagemError("É necessário incluir ao menos um imóvel para transferência");
        return false;
      }

      return true;
    }

    function removerArquivo(item) {
        arquivoService.removerAtoComplementar(item.id).then(function () {
          var indice;
          for (var i = 0; i < vm.transferencia.atosComplementares.length; i++) {
            if (vm.transferencia.atosComplementares[i].id == item.id) {
              indice = i;
              break;
            }
          }
          vm.transferencia.atosComplementares.splice(indice, 1);
        });
    }

    function fechar(){
          if(!vm.transferencia.detalhar){
              var mensagem = $filter('translate')(vm.transferencia.editar ? 'msg-fechar-editar' : 'msg-confirmar-fechar');
              mensagemDestinacaoService.confirmar(mensagem, function () {
                $state.go('destinacao.consultarDestinacao');
              });
          }else{
              $state.go('destinacao.consultarDestinacao');
          }
    }
    function addArquivo ($files) {
      if ($files && $files[0]) {
          arquivoService.validarFormatoDocumento($files[0].type);
          arquivoService.validarTamanho5MB($files[0].size);
          var atoComplementar = $files[0];
          arquivoService.uploadNovo(atoComplementar, vm.transferencia.atoComplementar).then(function (resposta) {
              vm.transferencia.atosComplementares.push(resposta.data.resultado);
              vm.transferencia.atoComplementar = '';
          });



      }
    }


      function buscarDadosPessoaJuridica () {
          var campo = null;
          var obj = {};
          var i = 0;
          var cpfUsuarioConsultor = $rootScope.usuarioLogado.cpf;
          /**BUSCAR PESSOA JURIDICA**/
          if(vm.transferencia.destinatario.cnpj && vm.transferencia.destinatario.cnpj !== '') {
              destinacaoService.buscarPessoaJuridica(cpfUsuarioConsultor, vm.transferencia.destinatario.cnpj, funcionalidadeConsultura + TIPO_DESTINACAO, PERIODO_MINIMO, vm.transferencia.codFundamentoLegal).then(function (retorno) {
                  if (retorno.data.erros && retorno.data.erros.length > 0) {
                      mensagemDestinacaoService.mostrarMensagemError(retorno.data.erros[0]);
                  } else {
                      var responsavel = retorno.data.resultado;
                      vm.transferencia.destinatario = responsavel;
                      vm.transferencia.destinatario.cnpj = responsavel.cnpj;
                      vm.transferencia.destinatario.nomeEmpresarial = responsavel.nomeEmpresarial;
                      vm.transferencia.destinatario.enderecoCorrespondencia = {endereco: angular.copy(responsavel.endereco)};
                      adicionarTelefones(responsavel.telefones);
                      delete  vm.transferencia.destinatario.endereco;
                  }
              }, function (error) {
                  mensagemDestinacaoService.mostrarMensagemError(error.data.message);
                  vm.transferencia.destinatario.cnpj = '';

              });

              campo = ['cnpj', 'nomeEmpresarial', 'nomeFantasia', 'situacaoCadastral', 'dataSituacaoCadastral', 'naturezaJuridica', 'dataAbertura', 'cnaePrincipal', 'cpfResponsavel', 'nomeResponsavel', 'cnpjSucedida'];
              obj = {};
              i = 0;
              angular.forEach(campo, function (campo) {
                  destinacaoService.buscarHistoricoPessoaJuridica(campo, vm.transferencia.destinatario.cnpj).then(function (retorno) {
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

      function detalharPessoa (responsavel) {
          window.sessionStorage.setItem('dadoPessoaJuridica', JSON.stringify(responsavel));
          var rota = $state.href('destinacao.dadosPessoasJuridica');
          window.open(rota, '_blank');
      }

      function incrementarHistorico(obj) {
          vm.historico[cont] = obj;
          cont++;
      }

      function adicionarTelefones(telefones) {
          vm.transferencia.destinatario.telefones = [];
          angular.forEach(telefones, function(tel) {
              vm.transferencia.destinatario.telefones.push({
                  tel: 'Telefone ' + vm.contTelefone,
                  ddd: tel.ddd,
                  numero: tel.numero,
                  isPrincipal: false,
                  contador: vm.contTelefone
              });
              vm.contTelefone++;
          });
      }


      function gerarPreview (arq) {
          arquivoService.gerarPreview(arq);
      }

      function cancelar () {
          vm.transferencia.cancelar = true;
          destinacaoEscopoCompartilhadoService.setDestinacao(vm.transferencia, vm.nomeState);
          $state.go('destinacao.cancelamentoEncerramentoUtilizacao');
      }

      function botaoEditar() {
          vm.transferencia.detalhar = false;
          vm.transferencia.editar = true;
      }

      vm.botaoEditar = botaoEditar;
      vm.cancelar = cancelar;
    vm.fechar = fechar;
    vm.gravar = gravar;
    vm.buscarDadosPessoaJuridica = buscarDadosPessoaJuridica;
    vm.addArquivo = addArquivo;
    vm.removerArquivo = removerArquivo;
    vm.incluirEnderecoCorrespondencia = incluirEnderecoCorrespondencia;
    vm.detalharPessoa = detalharPessoa;
    vm.gerarPreview = gerarPreview;

  }
})();
