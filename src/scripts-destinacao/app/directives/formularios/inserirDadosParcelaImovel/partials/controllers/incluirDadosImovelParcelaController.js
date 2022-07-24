(function(){
    "use strict";
    angular.module("su-destinacao").controller("IncluirDadosImovelParcelaController", controller);

    function controller($mdDialog,
                        arquivoService,
                        imovelDestinacaoService,
                        validadorImovelService,
                        mensagemDestinacaoService,
                        $filter,
                        $window,
                        destinacaoImoveis,
                        tipoDestinacao,
                        destinacaoImovel,
                        edicao,
                        bloquear,
                        esconderTabela,
                        destinacaoEscopoCompartilhadoService,
                        usuarioDestinacaoService,
                        permiteEditar,
                        inserirDadosImovelParcelaService) {

        var vm = this;

        var CONTENT_TYPE_ZIP = 'application/zip';
        var CONTENT_TYPE_OCTET = 'application/octet-stream';

        var fracaoIdealAux = undefined;

        vm.isExibirOutrasUtilizacoes = false;
        vm.permiteEditar = permiteEditar;
        vm.bloquear = bloquear;
        vm.esconderTabela = esconderTabela;

        vm.tabela = {
                    limit: 5,
                    limitsPage: [5, 10, 15],
                    page: 1
                };

        vm.tabelaUtilizacoes = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        vm.tabelaArquivos = {
          limit: 2,
          limitsPage :[2,4,8],
          page: 1
        };

        vm.arquivoFotoVideo = {
          arquivo: undefined,
          descricaoArquivo: undefined,
          dataArquivo: undefined
        };
      vm.listaTeste = [];

        vm.exibirDadosImovel = false;
        vm.exibirUploadFotosDescricaoArea = false;
        vm.exibirAlertaAreaRemanescente = false;
        vm.exibirModalArquivo = false;
        vm.exibirModalParcela = true;
        vm.tamanhoModal = 80;

        vm.fechar = fechar;
        vm.buscar = buscar;
        vm.consultarRip = consultarRip;
        vm.exibirOutrasUtilizacoes = exibirOutrasUtilizacoes;
        vm.baixarArquivo = baixarArquivo;
        vm.abrirDetalharParcela = abrirDetalharParcela;
        vm.somarAreaDisponivel = somarAreaDisponivel;
        vm.verificarAreaUtilizarMaiorAreaDisponivel = verificarAreaUtilizarMaiorAreaDisponivel;
        vm.verificarPodeExibirUploadFotosDescricaoArea = verificarPodeExibirUploadFotosDescricaoArea;
        vm.calcularFracaoIdeal = calcularFracaoIdeal;
        vm.verificarArredondamento = verificarArredondamento;
        vm.addArquivo = addArquivo;
        vm.verificaAreaRemanescente = verificaAreaRemanescente;
        vm.removerArquivo = removerArquivo;
        vm.incluir = incluir;
        vm.getTipoUtilizacao = getTipoUtilizacao;
        vm.somarAreaConstruidaUtilizada = somarAreaConstruidaUtilizada;
        vm.addArquivoFotoVideo = addArquivoFotoVideo;
        vm.removerDestinacaoImovel = removerDestinacaoImovel;
        vm.editarDestinacaoImovel = editarDestinacaoImovel;
        vm.confirmar = confirmar;
        vm.mostrarModalArquivos = mostrarModalArquivos;
        vm.mostrarModalParcela = mostrarModalParcela;
        vm.adicionarArquivoLista = adicionarArquivoLista;
        vm.gerarPreview = gerarPreview;
        vm.formatarCodigoUtilizacao = formatarCodigoUtilizacao;
        vm.cancelar = cancelar;
        vm.calcularPorcentagemPermitidaEditar = calcularPorcentagemPermitidaEditar;

        function init () {

            vm.destinacaoImoveis = angular.copy(destinacaoImoveis);
            vm.destinacaoImovel = angular.copy(destinacaoImovel);

            if (edicao === true) {
                iniciaDadosDestinacaoImovel();
            } else {
                inicializarDestinacaoImovel();
            }

        }

        function inicializarDestinacaoImovel() {
            vm.listaArquivosPreview = [];
            vm.destinacaoImovel = {documentos: [],
                                   benfeitoriasDestinadas: [],
                                   fotoVideo: [],
                                   parcelas: []};
        }

        init();



        function getCompoDadosUtilizacao() {
            vm.dadosUtilizacao = vm.destinacaoImovel.imovel.rip + '' + vm.destinacaoImovel.imovel.codigoUtilizacao + '' + vm.destinacaoImovel.imovel.parcela.sequencial;
        }

        function iniciaDadosDestinacaoImovel() {
            vm.exibirDadosImovel = true;
            formatarSequencialParcela(vm.destinacaoImovel.imovel);
            somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
            obterValorAreaUtilizarAnterior(vm.destinacaoImovel.imovel.benfeitorias);
            getCompoDadosUtilizacao();
            verificarPodeExibirUploadFotosDescricaoArea();
            somarAreaDisponivel();
            calcularFracaoIdeal();
            vm.listaArquivosPreview = vm.destinacaoImovel.documentos ? angular.copy(vm.destinacaoImovel.documentos) : [];
        }

        function obterValorAreaUtilizarAnterior(benfeitorias) {
            if (vm.permiteEditar === true) {
                if (angular.isDefined(benfeitorias)) {
                    angular.forEach(benfeitorias, function(benfeitoria) {
                        benfeitoria.areaUtilizarAnterior = angular.copy(benfeitoria.areaUtilizar);
                    });
                }
            }
        }

        function fechar() {
            $mdDialog.cancel();
        }

        function mostrarModalParcela() {
          vm.exibirModalArquivo = false;
          vm.exibirModalParcela = true;
          vm.tamanhoModal = 80;
        }

        function mostrarModalArquivos() {
          vm.exibirModalArquivo = true;
          vm.exibirModalParcela = false;
          vm.tamanhoModal = 50;
        }

        function buscar() {
            var rip = vm.dadosUtilizacao.substring(0, 8);
            var codigoUtilizacao = vm.dadosUtilizacao.substring(9, 13);
            var sequencialParcela = 'P' + parseInt(vm.dadosUtilizacao.substring(14, 17));
            imovelDestinacaoService.consultarUtilizacao(rip, codigoUtilizacao, sequencialParcela, tipoDestinacao)
            .then(function(resposta) {
                vm.destinacaoImovel.imovel = resposta.data.resultado;
                vm.destinacaoImovel.parcelas = vm.destinacaoImovel.imovel.parcelas;
                vm.exibirDadosImovel = true;
                formatarSequencialParcela(vm.destinacaoImovel.imovel);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
            }, function(error) {
                mensagemDestinacaoService.mostrarMensagemError(error.data.erros[0]);
            });

        }

        function formatarCodigoUtilizacao(destinacaoImovel) {
            var codigoUtilizacao = '-';
            if (angular.isDefined(destinacaoImovel) && angular.isDefined(destinacaoImovel.imovel)) {
               codigoUtilizacao = ' ' + destinacaoImovel.imovel.rip
                                      + '/' + destinacaoImovel.imovel.codigoUtilizacao
                                      + destinacaoImovel.imovel.parcela.sequencial;
            }
            return codigoUtilizacao;
        }

      function calcularFracaoIdeal(){
        if(vm.totalAreaUtilizar > 0){
          vm.destinacaoImovel.fracaoIdeal = (vm.totalAreaUtilizar / vm.totalAreaConstruida) * vm.destinacaoImovel.imovel.parcela.areaTerreno;
          fracaoIdealAux = angular.copy(vm.destinacaoImovel.fracaoIdeal);
        } else{
          vm.destinacaoImovel.fracaoIinserirDadosImovelParcelaServicedeal = undefined;
        }
      }

      function verificarArredondamento() {
          if(fracaoIdealAux !== vm.destinacaoImovel.fracaoIdeal){
            if(parseInt(fracaoIdealAux) !== vm.destinacaoImovel.fracaoIdeal && Math.ceil(fracaoIdealAux) !== vm.destinacaoImovel.fracaoIdeal){
              var arredondamentoBaixo = $filter('number')(parseInt(fracaoIdealAux),2);
              var arredondamentoCima = $filter('number')(Math.ceil(fracaoIdealAux),2);
              var mensagem = $filter ('translate')('msg-arredondamento-invalido') + arredondamentoBaixo+' ou ' + arredondamentoCima;
              mensagemDestinacaoService.mostrarMensagemError(mensagem);
              vm.destinacaoImovel.fracaoIdeal = fracaoIdealAux;
            }
          }
      }

      function verificaAreaRemanescente(areaConstruidaDisponivel, areaConstruidaUtilizar) {
        var areaRestante = areaConstruidaDisponivel - areaConstruidaUtilizar;
        if(areaRestante < 20 && areaRestante > 0) {
          vm.exibirAlertaAreaRemanescente = true;
        }
        else{
          vm.exibirAlertaAreaRemanescente = false;
        }
      }

        function formatarSequencialParcela(imovel) {
            var digitos = imovel.parcela.sequencial.substring(1, imovel.parcela.sequencial.length);
            vm.destinacaoImovel.imovel.parcela.sequencial = 'P' + new Array(Math.max(4 - String(digitos).length + 1, 0)).join(0) + digitos;
        }

        function somarAreasBenfeitorias(benfeitorias) {
            vm.totalAreaConstruida = 0;
            vm.totalAreaDisponivel = 0;
            vm.totalAreaUtilizar = 0;

            if (angular.isDefined(benfeitorias)) {
                angular.forEach(benfeitorias, function (benfeitoria) {
                    vm.totalAreaConstruida += benfeitoria.areaConstruida;
                    vm.totalAreaDisponivel += benfeitoria.areaDisponivel;

                    if (angular.isDefined(benfeitoria.areaUtilizar)) {
                        vm.totalAreaUtilizar += benfeitoria.areaUtilizar;
                    }

                });
            }
        }

        function consultarRip() {
            alert("Funcionalidade não implementada");
        }

        function somarAreaDisponivel() {
            somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
        }

        function verificarAreaUtilizarMaiorAreaDisponivel(benfeitoria) {
            if (benfeitoria.areaUtilizar > benfeitoria.areaDisponivel) {
                benfeitoria.areaUtilizar = undefined;
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-area-utilizar-maior-area-disponivel'));
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
            }
        }

        function calcularPorcentagemPermitidaEditar(benfeitoria) {
            var porcentagemMaiorPermitida = benfeitoria.areaUtilizarAnterior + inserirDadosImovelParcelaService.calcularPorcentagemAreaPermitida(benfeitoria.areaUtilizarAnterior);
            var porcentagemMenorPermitida = benfeitoria.areaUtilizarAnterior - inserirDadosImovelParcelaService.calcularPorcentagemAreaPermitida(benfeitoria.areaUtilizarAnterior);
            var mensagem;
            if (inserirDadosImovelParcelaService.validarEditarAreaPermitidaMaior(porcentagemMaiorPermitida, benfeitoria.areaUtilizar)) {
                benfeitoria.areaUtilizar = angular.copy(benfeitoria.areaUtilizarAnterior);
                mensagem = $filter('translate')('msg-area-utilizar-maior-permitido');
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
                throw mensagem;
            }

            if (inserirDadosImovelParcelaService.validarEditarAreaPermitidaMenor(porcentagemMenorPermitida, benfeitoria.areaUtilizar)) {
                benfeitoria.areaUtilizar = angular.copy(benfeitoria.areaUtilizarAnterior);
                mensagem = $filter('translate')('msg-area-utilizar-menor-permitido');
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.benfeitorias);
                throw mensagem;
            }

        }

        function verificarPodeExibirUploadFotosDescricaoArea() {
            var benfeitorias = vm.destinacaoImovel.imovel.benfeitorias;
            for (var i = 0; i < benfeitorias.length; i++) {
                var benfeitoria = benfeitorias[i];
                if (benfeitoria.areaUtilizar !== benfeitoria.areaDisponivel) {
                    vm.exibirUploadFotosDescricaoArea = true;
                    break;
                } else {
                    vm.destinacaoImovel.memorialDescAreaConstruida = undefined;
                    vm.exibirUploadFotosDescricaoArea = false;
                }
            }
        }

        function incluir() {

            if (vm.formIncluirDadosImovel.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formIncluirDadosImovel);
                return;
            }

            vm.destinacaoImovel.benfeitoriasDestinadas = addBenfeitoriasDestinadas(vm.destinacaoImovel.imovel.benfeitorias);
            inserirParcela(vm.destinacaoImovel.imovel.parcela);
            incluirImovel();
            vm.destinacaoImovel = {documentos: [], benfeitoriasDestinadas: [], fotoVideo: []};
            vm.exibirDadosImovel = false;
            vm.dadosUtilizacao = undefined;
        }

        function inserirParcela(parcela) {
            for (var i = 0; i < vm.destinacaoImovel.parcelas.length; i++) {
                parcela.sequencial = formatarParcela(parcela.sequencial);
                if (parcela.id !== vm.destinacaoImovel.parcelas[i].id) {
                    vm.destinacaoImovel.parcelas.push(parcela);
                } else {
                    vm.destinacaoImovel.parcelas[i] = parcela;
                }
            }
        }

        function incluirImovel() {
            if (validarUFMesmaJuridicaoUsuarioLogado()) {
                verificaImovelMesmaUF();
                verificaMesmoProprietario();
                adicionarEditarImovel();
            } else {
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-uf-juridicao-diferentes'))
            }
        }

        function adicionarEditarImovel() {
            if (edicao) {
                var indice = getIndice(vm.destinacaoImovel);
                vm.destinacaoImoveis[indice] = vm.destinacaoImovel;

                if (vm.permiteEditar === true) {
                    confirmar();
                }

            } else {
                vm.destinacaoImoveis.push(vm.destinacaoImovel);
            }
        }

        function validarUFMesmaJuridicaoUsuarioLogado() {
            var usuarioLogado = usuarioDestinacaoService.getUsuarioLogado();
            var uf = vm.destinacaoImovel.imovel.endereco.uf;
            return usuarioLogado.jurisdicoes.indexOf(uf)!= -1;
        }

        function verificaImovelMesmaUF(){
            var ufIguais = true;
            var uf = vm.destinacaoImovel.imovel.endereco.uf;
            for (var i = 0; i < vm.destinacaoImoveis.length; i++) {
                if (uf !== vm.destinacaoImoveis[i].imovel.endereco.uf) {
                    ufIguais = false;
                    break;
                }
            }

            if (ufIguais === false) {
                var mensagem = $filter('translate')('msg-uf-imovel-diferentes');
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                throw mensagem;
            }

        }

        function verificaMesmoProprietario() {
            var mesmoProprietario = true;
            var proprietario = vm.destinacaoImovel.imovel.proprietario;
            for (var i = 0; i < vm.destinacaoImoveis.length; i++) {
                if (proprietario !== vm.destinacaoImoveis[i].imovel.proprietario) {
                    mesmoProprietario = false;
                    break;
                }
            }

            if (mesmoProprietario === false) {
                var mensagem = $filter('translate')('msg-proprietarios-diferentes');
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                throw mensagem;
            }

        }

        function addBenfeitoriasDestinadas(benfeitorias) {
            var benfeitoriasUtilizadas = [];

            angular.forEach(benfeitorias, function (benfeitoria) {
                var benfeitoriaDestinada = {idBenfeitoria: benfeitoria.id, areaUtilizar: benfeitoria.areaUtilizar, id: getIdBenfeitoriaDestinada(benfeitoria.id)};
                benfeitoriasUtilizadas.push(benfeitoriaDestinada);
            });

            return benfeitoriasUtilizadas;

        }

        function getIdBenfeitoriaDestinada(idBenfeitoria) {
            var indice = vm.destinacaoImovel.benfeitoriasDestinadas.findIndex(function (benfeitoriaDestinada) {
                return benfeitoriaDestinada.idBenfeitoria === idBenfeitoria;
            });
            if (indice < 0) {
                return undefined;
            }
            return vm.destinacaoImovel.benfeitoriasDestinadas[indice].id;
            
        }

        function addArquivo($files) {

            var quantidadeShapeFile = 0;
            var indexPrimeiroShapeFile = 0;

            if (vm.destinacaoImovel.documentos.length !== 0
                                && angular.isDefined($files)
                                && arquivoService.validarShapeFile($files[0])) {
                    angular.forEach(vm.destinacaoImovel.documentos, function (arquivo, index) {
                        if(arquivoService.validarShapeFile(arquivo)){
                            indexPrimeiroShapeFile = index;
                            quantidadeShapeFile++;
                        }
                    });
                }

            if (quantidadeShapeFile !== 0) {
                vm.destinacaoImovel.documentos.splice(indexPrimeiroShapeFile, 1);
                vm.listaArquivosPreview.splice(indexPrimeiroShapeFile, 1);
                uploadArquivos($files[0]);
            } else {
                angular.forEach($files, function (arquivo) {
                    arquivoService.validarFormatoArquivoMemorialDescritivo(arquivo);
                    uploadArquivos(arquivo);
                });
            }

        }

        function uploadArquivos(arquivo) {
            arquivoService.validarFormatoArquivoMemorialDescritivo(arquivo);
            arquivoService.validarTamanhoArquivo(arquivo.size);
            arquivoService.uploadComShapeFile(arquivo).then(function(resposta){
                var arquivoSalvo = {name:angular.copy(arquivo.name), id: resposta.data.resultado.id};
                vm.destinacaoImovel.documentos.push(arquivoSalvo);
                vm.listaArquivosPreview.push(arquivoSalvo);
                var contentType = resposta.data.resultado.contentType;
                if (contentType === CONTENT_TYPE_ZIP || contentType === CONTENT_TYPE_OCTET) {
                    vm.destinacaoImovel.memorialDescAreaConstruida = resposta.data.resultado.coordenadas;
                    vm.desabilitarMemorialDescritivo = true;
                }
            });
        }

        function addArquivoFotoVideo($files) {
          if($files && $files[0]){
            arquivoService.validarFormatoArquivoFotoVideo($files[0].type);
            arquivoService.validarTamanhoArquivo($files[0].size);
            vm.arquivoFotoVideo.arquivo = $files[0];
          }
        }

        function adicionarArquivoLista() {
              if(vm.formUploadArquivos.$invalid) {
                mensagemDestinacaoService.mostrarCamposInvalidos(vm.formUploadArquivos);
              } else {
                if(angular.isDefined(vm.arquivoFotoVideo.arquivo)) {
                  arquivoService.uploadFotoVideo(vm.arquivoFotoVideo.arquivo,
                                                 vm.arquivoFotoVideo.descricaoArquivo,
                                                 vm.arquivoFotoVideo.dataArquivo)
                  .then(function (resposta) {
                      var arquivo = setarDadosArquivo(resposta.data.resultado);
                      arquivo.nome = angular.copy(vm.arquivoFotoVideo.arquivo.name);
                      limparArquivoFotoVideo();
                      vm.destinacaoImovel.fotoVideo.push(arquivo);
                  });
                }
              }
        }

        function limparArquivoFotoVideo() {
            vm.arquivoFotoVideo.arquivo = undefined;
            vm.arquivoFotoVideo.descricaoArquivo = undefined;
            vm.arquivoFotoVideo.dataArquivo = undefined;
        }

        function setarDadosArquivo(file) {
            var arquivo = criarNovoArquivo(file);
            if (arquivoService.isVideo(arquivo)) {
              arquivo.tipoArquivo = 'VIDEO';
            } else {
              arquivo.tipoArquivo = 'IMAGEM';
            }
            return arquivo;
        }

        function criarNovoArquivo(file) {
            return {id: file.id,
                    imagem: file.imagem,
                    type: file.contentType,
                    nome: file.nome,
                    name: file.nome};
        }

        function removerArquivo(index, lista) {
            if (arquivoService.validarShapeFile(lista[index])) {
              lista.splice(index, 1);
              vm.destinacaoImovel.documentos.splice(index,1);
              vm.listaArquivosPreview.splice(index,1);
              vm.desabilitarMemorialDescritivo = false;
              vm.destinacaoImovel.memorialDescAreaConstruida = undefined;
            }
            else{
              lista.splice(index, 1);
              if(angular.isDefined(vm.arquivoFotoVideo.arquivo)){
                vm.arquivoFotoVideo.arquivo.splice(index);
              }
              else{
                vm.destinacaoImovel.documentos.splice(index,1);
                vm.listaArquivosPreview.splice(index,1);
              }
            }
        }

        function extrairParcela(destinacaoImovel) {
            var parcela;

            if (angular.isDefined(destinacaoImovel.id)) {
                parcela = destinacaoImovel.imovel.parcelas[0];
            } else {
                parcela = destinacaoImovel.imovel.parcela;
            }
            return parcela;
        }

        function getTipoUtilizacao(destinacaoImovel) {
            var parcela = extrairParcela(destinacaoImovel);
            if (Math.round(destinacaoImovel.fracaoIdeal) === Math.round(parcela.areaTerreno)) {
                return 'Total';
            }
            return 'Parcial';
        }

        function somarAreaConstruidaUtilizada(destinacaoImovel) {
            var total = 0;
            var benfeitorias = destinacaoImovel.imovel.benfeitorias;
            var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;

            angular.forEach(benfeitorias, function (benfeitoria) {
                total += getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
            });
            return total;
        }

        function getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas) {
            var areaUtilizada = 0;
            for (var i = 0; i < benfeitoriasDestinadas.length; i++) {
                if (benfeitoriasDestinadas[i].idBenfeitoria === benfeitoria.id) {
                    areaUtilizada = benfeitoriasDestinadas[i].areaUtilizar;
                    break;
                }
            }
            return areaUtilizada;
        }

        function confirmar() {
          $mdDialog.hide(vm.destinacaoImoveis);
        }

        function abrirDetalharParcela() {
            var url = destinacaoEscopoCompartilhadoService.getUrlsPorAmbiente();
            $window.open(url.cadastroImovel + '#/detalharImovel/' + vm.destinacaoImovel.imovel.idCadastroImovel,'_blank');
        }

        function exibirOutrasUtilizacoes() {
          vm.isExibirOutrasUtilizacoes = !vm.isExibirOutrasUtilizacoes;
        }

        function getIndice(destinacaoImovel) {
            return vm.destinacaoImoveis.findIndex(function (element) {
                    var imovel = destinacaoImovel.imovel;
                    return element.imovel.rip === imovel.rip
                        && formatarParcela(element.imovel.parcela.sequencial) === formatarParcela(imovel.parcela.sequencial);
            });
        }

        function formatarParcela(sequencial) {
            return 'P' + parseInt(sequencial.substring(1, sequencial.length - 1));
        }

        function removerDestinacaoImovel(destinacaoImovel) {
            var indice = getIndice(destinacaoImovel);
            vm.destinacaoImoveis.splice(indice, 1);
            inicializarDestinacaoImovel();
            edicao = false;
        }

        function editarDestinacaoImovel(destinacaoImovel) {
            vm.destinacaoImovel = angular.copy(destinacaoImovel);
            edicao = true;
            iniciaDadosDestinacaoImovel();
        }

        function gerarPreview (arquivo) {
            arquivoService.gerarPreview(arquivo);
        }

        function baixarArquivo(arquivo) {
            return arquivoService.baixarArquivo(arquivo);
        }

        function cancelar() {
            $mdDialog.cancel();
        }


    }

})();
