(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .controller('incluirDocumentoController', controller);

  function controller (destinacaoEscopoCompartilhadoService,
                       mensagemDestinacaoService, dominioService,
                       subTipoDocumentoService, arquivoService, moment, $state) {

    var indice;
    var vm = this;
    var ID_CERTIDAO_CARTORIAL = 6;


    vm.destinacao = destinacaoEscopoCompartilhadoService.getObjeto('destinacao');
    vm.bloquear = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('bloquear'));
    vm.documento = {
      subTipoDocumento:{},
      dispensado: false
    };
    vm.modoEdicao = false;


    vm.tabelaDocumentos = {
      limit: 5,
      limitsPage: [5, 10, 15],
      page: 1
    };

    getDocumentoEdicao();
    buscarTipoDocumento();
    vm.fechar = fechar;
    vm.remover = remover;
    vm.editar = editar;
    vm.incluir = incluir;
    vm.indexDocumento = indexDocumento;
    vm.addArquivo = addArquivo;
    vm.buscarTipoDocumento = buscarTipoDocumento;
    vm.buscarCamposSubTipo = buscarCamposSubTipo;
    vm.verificarPodeExibirLink = verificarPodeExibirLink;
    vm.montarLinkAto = montarLinkAto;
    vm.gerarPreview = gerarPreview;
    vm.especificar = especificar;
    vm.limparCamposPublicacao = limparCamposPublicacao;
    vm.limparCamposSubTipoDocumento = limparCamposSubTipoDocumento;


    function getDocumentoEdicao() {
      var documento = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('documento'));
      if(angular.isDefined(documento)) {
        indice = indexDocumento(documento);
        vm.modoEdicao = true;
        vm.documento = angular.copy(vm.destinacao.documentos[indice]);
      }

    }

    function buscarTipoDocumento() {
      dominioService.buscarTipoDocumento()
        .then(function (resposta) {
          vm.tipoDocumentos = removerCertidaoCartorialPorInstrumento( resposta.data.resultado);
          if (angular.isDefined(vm.documento) && angular.isDefined(vm.documento.tipoDocumento)) {
            buscarCamposSubTipo();
          }
        });
    }

    function removerCertidaoCartorialPorInstrumento(tipoDocumentos) {
          return tipoDocumentos.filter(function (elemento) {
            if(vm.destinacao.tipoDestinacaoEnum === 'VENDA' ||
               vm.destinacao.tipoDestinacaoEnum === 'DOACAO' ||
               vm.destinacao.tipoDestinacaoEnum === 'CDRU') {
              return elemento;
            }
            return elemento.id !== ID_CERTIDAO_CARTORIAL;
          });

    }

    function buscarCamposSubTipo() {
      subTipoDocumentoService.buscarSubTipoDocumento(vm.documento.tipoDocumento.id)
        .then(function (resposta) {
          vm.subTipoDocumento = resposta.data.resultado;
          limparCamposSubTipoDocumento();
        });
    }
    function addArquivo ($files) {
      if ($files && $files[0]) {
        arquivoService.validarFormatoArquivo($files[0].type);
        var arquivo = vm.documento.arquivo = $files[0];
        arquivoService.uploadNovo(arquivo,null,'').then(function (resposta) {
          vm.documento.arquivo = resposta.data.resultado;
        });
      }
    }

    function fechar () {
      retornarDestinacao();
    }

    function retornarDestinacao () {
      destinacaoEscopoCompartilhadoService.setObjetos('destinacao',vm.destinacao);
      var rotaRetorno = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();
      $state.go(rotaRetorno);
    }

    function incluir () {
      if (!vm.bloqueiaDadosUtilizacao) {
        if (vm.formDocumento.$invalid) {
          mensagemDestinacaoService.mostrarCamposInvalidos(vm.formDocumento);
          return
        }
        verificarSeExistesNaLista();
        retornarDestinacao();
      }

    }


    function remover(documento) {
      var indice = indexDocumento(documento);
      if(angular.isDefined(documento.arquivo)) {
        arquivoService.removerArquivo(documento.arquivo.id);
      }
      vm.destinacao.documentos.splice(indice, 1);
    }

    function editar(documento){
      vm.modoEdicao = true;
      indice = indexDocumento(documento);
      vm.documento = vm.destinacao.documentos[indice];//angular.copy(documento);
      vm.tipoDocumento = vm.documento.tipoDocumento;
      vm.buscarSubTipoDocumento = vm.documento.subTipoDocumento;
    }

    function indexDocumento(documento) {
      return vm.destinacao.documentos.findIndex(function (element) {
        return JSON.stringify(element) === JSON.stringify(documento);
      });
    }

    function verificarSeExistesNaLista() {
      if(angular.isUndefined(indice)){
        vm.destinacao.documentos.push(vm.documento);
      } else {
        vm.destinacao.documentos[indice]= vm.documento;
      }
    }

    function verificarPodeExibirLink() {
      return vm.documento.pagina
        && vm.documento.secao
        && vm.documento.dataPublicacao;
    }
    function especificar() {
      if(vm.documento.tipoDocumento.id !== 1
        && vm.documento.tipoDocumento.id !== 2){
      }
    }

    function montarLinkAto() {
      vm.documento.link = 'http://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=' +
        vm.documento.secao + '&pagina='+ vm.documento.pagina +
        '&data=' + formartarData(vm.documento.dataPublicacao);
      return vm.documento.link
    }

    function formartarData(data) {
      var dataFormatada = '';
      if (data) {
        dataFormatada = moment(data).format('DD/MM/YYYY');
      }
      return dataFormatada;
    }

    function gerarPreview () {
      arquivoService.gerarPreview(vm.documento.arquivo);
    }

    function limparCamposPublicacao() {
      if (vm.documento.publicacao === false) {
        vm.documento.pagina = undefined;
        vm.documento.dataPublicacao = undefined;
        vm.documento.secao = undefined;
      } else {
        vm.documento.arquivo = undefined;
      }
    }

    function limparCamposSubTipoDocumento() {
      if(vm.documento.tipoDocumento.id > 2){
        vm.documento.subTipoDocumento.id = undefined;
      } else {
        vm.documento.especificar = undefined;
        vm.documento.dispensado = false;
        vm.documento.justificativa = undefined;
      }
    }
  }



})();
