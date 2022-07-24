(function () {

  'use strict';

  angular
    .module('su-destinacao')
    .factory('destinacaoServiceUtil', service);

  function service (destinacaoService, $q, $state, destinacaoEscopoCompartilhadoService) {

        var propriedades = [{nome: 'encargos', tipo: 'array'}, {nome: 'documentos', tipo: 'array'}, {nome: 'responsavel', tipo: 'objeto'},
                            {nome: 'imoveis', tipo: 'array'}, {nome: 'destinacaoImoveis', tipo: 'array'}, {nome: 'extrato', tipo: 'objeto'},
                            {nome: 'contrato', tipo: 'objeto'}, {nome: 'responsaveis', tipo: 'array'}, {nome: 'utilizacao', tipo: 'objeto'},
                            {nome: 'fotos', tipo: 'array'}, {nome: 'documentosArquivo', tipo: 'array'}, {nome: 'ocupantes', tipo: 'array'}];

        function carregarDestinacao(destinacao, TIPO_DESTINACAO, atendimento) {
            if (angular.isDefined(destinacao)) {
                destinacao.tipoDestinacaoEnum = TIPO_DESTINACAO;
                destinacao = getTipoAcao(destinacao);
                return carregar(destinacao, TIPO_DESTINACAO, atendimento);
            }
        }

        function getTipoAcao(destinacao) {
            if (destinacao.editar === true) {
                destinacao.detalhar = false;
            } else if (destinacao.detalhar === true) {
                destinacao.editar = false;
            } else {
                destinacao.editar = false;
                destinacao.detalhar = false;
            }

            return destinacao;
        }

        function carregar(destinacao, TIPO_DESTINACAO, atendimento) {
            var dados;
            var deferred = $q.defer();
            if (destinacao.recarregarDadosEscopo === true) {
                dados = prepararDadosDestinacao(destinacao, TIPO_DESTINACAO, atendimento);
                deferred.resolve(dados);
            } else {
                destinacaoService.buscaDestinacaoPorId(destinacao.id, TIPO_DESTINACAO).then(function(resposta) {
                    var destinacaoInicial = resposta.data.resultado;
                    destinacaoInicial.editar = destinacao.editar;
                    destinacaoInicial.detalhar = destinacao.detalhar;
                    dados = prepararDadosDestinacao(resposta.data.resultado, TIPO_DESTINACAO, atendimento);
                    return deferred.resolve(dados);
                });
            }

            return deferred.promise;

        }

        function prepararDadosDestinacao(destinacao, TIPO_DESTINACAO, atendimento) {
            var novaDestinacao = destinacao;
            novaDestinacao.tipoDestinacaoEnum = TIPO_DESTINACAO;
            destinacaoService.inicializarPropriedades(novaDestinacao, propriedades);
            var imagens = converterListaArquivoImagem(novaDestinacao);

            prepararDocumentos(novaDestinacao);
            prepararDataDadosAtoAutorizativo(novaDestinacao.atoAutorizativo);
            prepararFotos(novaDestinacao.fotos);
            prepararPendencias(novaDestinacao);
            prepararEndereco(novaDestinacao);;

            var novoAtendimento = setarAtendimento(atendimento, novaDestinacao);

            if (angular.isDefined(novaDestinacao.contrato) && angular.isDefined(novaDestinacao.contrato.id)) {
                novaDestinacao.contrato.dataInicio = new Date(novaDestinacao.contrato.dataInicio);
                novaDestinacao.contrato.dataFinal = new Date(novaDestinacao.contrato.dataFinal);
            }

            return {destinacao: novaDestinacao, atendimento: novoAtendimento, imagens: imagens, carregarDadosUtilizacao: true};
        }

        function prepararEndereco(novaDestinacao) {
            if(novaDestinacao.tipoDestinacaoEnum === 'POSSE_INFORMAL'){
                if(angular.isDefined(novaDestinacao.imovel.endereco)){
                    novaDestinacao.endereco = novaDestinacao.imovel.endereco;
                }
            }
        }

        function prepararDataDadosAtoAutorizativo(atoAutorizativo) {
            if (angular.isDefined(atoAutorizativo) && angular.isDefined(atoAutorizativo.dataPublicacao)) {
                atoAutorizativo.dataPublicacao = new Date(atoAutorizativo.dataPublicacao);
            }
        }

        function setarAtendimento(atendimento, destinacao) {
            var novoAtendimento = {};
             if (angular.isDefined(destinacao.id) && angular.isUndefined(atendimento)) {
                novoAtendimento.numeroAtendimento = destinacao.numeroAtendimento;
                novoAtendimento.numeroProcedimento = destinacao.numeroProcesso



                 novoAtendimento.versaoHistorico = {
                     id : destinacao.versaoDestinacao,
                     nome : 'Versão ' + destinacao.versaoDestinacao + ' - ' + destinacao.dataDestinacaoHistorico
                 }

                 novoAtendimento.historicoVersoes = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('listaHistorico'));


                if (angular.isDefined(destinacao.tipoInstrumento) && destinacao.tipoInstrumento !== '') {
                  novoAtendimento.tipoInstrumento = destinacao.tipoInstrumento;
                  if (destinacao.existeEncargo) {
                    novoAtendimento.tipoDoacao = {id: 1, descricao: 'Com Encargo'};
                  } else {
                    novoAtendimento.tipoDoacao = {id: 2, descricao: 'Sem Encargo'};
                  }
                }
                if (angular.isDefined(destinacao.tipoModalidade) && destinacao.tipoModalidade !== '') {
                  novoAtendimento.tipoModalidade = destinacao.tipoModalidade;
                }
                if (angular.isDefined(destinacao.tipoConcessao) && destinacao.tipoConcessao !== '') {
                  novoAtendimento.tipoConcessao = destinacao.tipoConcessao;
                }
                if (angular.isDefined(destinacao.tipoCessao) && destinacao.tipoCessao !== ''){
                    novoAtendimento.tipoCessao = destinacao.tipoCessao;
                }
                if (angular.isDefined(destinacao.tipoCessao) && destinacao.tipoCessao !== ''){
                    novoAtendimento.envolvePagamento = destinacao.envolvePagamento;
                }
            } else if (angular.isDefined(atendimento)) {
                novoAtendimento = atendimento;
            }

            destinacaoEscopoCompartilhadoService.setObjetos('atendimento', novoAtendimento);

            return novoAtendimento;
        }

        function prepararDocumentos(destinacaoEscopo) {
            angular.forEach(destinacaoEscopo.documentos, function (documento) {
                if(documento.dispensado === false){
                documento.dataInicialVigencia = new Date(documento.dataInicialVigencia);
                documento.dataFinalVigencia = new Date(documento.dataFinalVigencia);
                    if(angular.isDefined(documento.dataPublicacao) && documento.dataPublicacao !== null){
                        documento.dataPublicacao = new Date(documento.dataPublicacao);
                        documento.publicacao = true;
                    } else {
                        documento.dataPublicacao = undefined;
                        documento.publicacao = false;
                    }
                }
            });
        }

        function converterListaArquivoImagem(destinacaoEscopo) {
            var imagens = [];
            if (angular.isDefined(destinacaoEscopo) && angular.isDefined(destinacaoEscopo.destinacaoImoveis)) {
                imagens = destinacaoService.converterListaArquivoImagem(destinacaoEscopo.destinacaoImoveis);
            }
            return imagens;
        }

        function prepararFotos(fotos){
            if(angular.isDefined(fotos)){
                angular.forEach(fotos, function(foto){
                    foto.documento = foto.arquivo;
                    foto.descricao = foto.arquivo.descricao;
                    foto.data = new Date(foto.arquivo.data);
                })
            }
        }

        function prepararPendencias(destinacao){
            if(angular.isDefined(destinacao)){
                angular.forEach(destinacao.pendencias, function(pendencia){
                    pendencia.destinacaoPendenciaID.destinacao = destinacao;
                })
            }
        }

        function lpad(parcela) {
            var texto = parcela.substring(1, parcela.length);
            var digito = parcela.substring(0, 1);
            return digito + (texto.length >= 4 ? texto : new Array(4 - texto.length + 1).join('0') + texto);
        }

        function tabRetorno(indiceRetorno) {
            var deferred = $q.defer();
            var dados = {};
            if (angular.isDefined(indiceRetorno)) {
                dados.indiceTabs = indiceRetorno;
                dados.bloqueiaDadosUtilizacao = true;
                deferred.resolve(dados);
            }
            deferred.resolve(undefined);
            return deferred.promise;
        }

        function retornarConsultaDestiancaoVazia(destinacao) {
            if (angular.isUndefined(destinacao)) {
                $state.go('destinacao.consultarDestinacao');
            }
        }

        function criarObjetoOriginal(destinacao, objeto) {
            var objetoOriginal = {};
            if (angular.isUndefined(objeto) && angular.isDefined(destinacao)) {
                objetoOriginal = angular.copy(destinacao);
            } else {
                objetoOriginal = angular.copy(objeto);
            }
            destinacaoEscopoCompartilhadoService.setObjetos('objetoOriginal', objetoOriginal);
            return objetoOriginal;
        }

        return {
            carregarDestinacao: carregarDestinacao,
            tabRetorno: tabRetorno,
            retornarConsultaDestiancaoVazia: retornarConsultaDestiancaoVazia,
            criarObjetoOriginal: criarObjetoOriginal,
            lpad:lpad
        };

  }

})();
