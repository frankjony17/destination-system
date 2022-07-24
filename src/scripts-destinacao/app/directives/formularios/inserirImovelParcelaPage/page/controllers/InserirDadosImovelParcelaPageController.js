(function() {
    "use strict";
    angular.module("su-destinacao").controller("InserirDadosImovelParcelaPageController", controller);

    function controller($mdDialog,
                        arquivoService,
                        imovelDestinacaoService,
                        validadorImovelService,
                        mensagemDestinacaoService,
                        $filter,
                        $window,
                        destinacaoEscopoCompartilhadoService,
                        usuarioDestinacaoService,
                        inserirDadosImovelParcelaService,
                        inserirImovelParcelaUtil,
                        $state, comumDestinacaoService, destinacaoServiceUtil) {


        var vm = this;

        vm.tabelaUtilizacoes = {
          limit: 5,
          limitsPage: [5, 10, 15],
          page: 1
        };

        vm.destinacaoServiceUtil = destinacaoServiceUtil;
        var fracaoIdealAux = undefined;

        vm.isExibirOutrasUtilizacoes = false;

        vm.exibirDadosImovel = false;

        vm.formatosPdf = ['pdf'];
        vm.formatosFotoVideos = ['PNG', 'JPG', 'JPEG','MP4'];

        vm.fechar = fechar;
        vm.buscar = buscar;
        vm.consultarRip = consultarRip;
        vm.exibirOutrasUtilizacoes = exibirOutrasUtilizacoes;
        vm.abrirDetalharParcela = abrirDetalharParcela;
        vm.somarAreaDisponivel = somarAreaDisponivel;
        vm.verificarAreaUtilizarMaiorAreaDisponivel = verificarAreaUtilizarMaiorAreaDisponivel;
        vm.verificarPodeExibirUploadFotosDescricaoArea = verificarPodeExibirUploadFotosDescricaoArea;
        vm.calcularFracaoIdeal = calcularFracaoIdeal;
        vm.verificarArredondamento = verificarArredondamento;
        vm.verificaAreaRemanescente = verificaAreaRemanescente;
        vm.incluir = incluir;
        vm.somarAreaConstruidaUtilizada = somarAreaConstruidaUtilizada;
        vm.addArquivoFotoVideo = addArquivoFotoVideo;
        vm.adicionarArquivoLista = adicionarArquivoLista;
        vm.formatarCodigoUtilizacao = formatarCodigoUtilizacao;
        vm.calcularPorcentagemPermitidaEditar = calcularPorcentagemPermitidaEditar;
        vm.setDadosMemorialDescritivo = setDadosMemorialDescritivo;
        vm.selecionarImovelFuncional = selecionarImovelFuncional;

        function init () {
            vm.destinacao = destinacaoEscopoCompartilhadoService.getDestinacao();
            vm.idModalidade = destinacaoEscopoCompartilhadoService.getObjeto('idModalidade');
            retornarConsultaDestiancaoVazia(vm.destinacao);

            vm.edicao = isTipoAcao('editar');
            vm.bloquear = isTipoAcao('detalhar');
            vm.nomeStateDestinacao = destinacaoEscopoCompartilhadoService.getNomeStateDestinacao();

            vm.indice = destinacaoEscopoCompartilhadoService.getObjeto('indice');
            vm.esconderTabela = marcarEsconderTabela(vm.edicao, vm.bloquear);

            vm.destinacaoImoveis = angular.copy(vm.destinacao.destinacaoImoveis);

            if (angular.isDefined(vm.indice)) {
                iniciaDadosDestinacaoImovel();
                if (angular.isUndefined(vm.destinacaoImovel.arquivosRemover)) {
                    vm.destinacaoImovel.arquivosRemover = [];
                }
            } else {
                inicializarDestinacaoImovel();
            }
            if(destinacaoEscopoCompartilhadoService.getObjeto('utilizacao')){
                var utilizacao = destinacaoEscopoCompartilhadoService.getObjeto('utilizacao');
                vm.dadosUtilizacao = utilizacao.imovel.rip + vm.destinacaoServiceUtil.lpad(utilizacao.sequencialParcela);
            }

        }

        init();

        function isTipoAcao(acaoEsperada) {
            return vm.acao === acaoEsperada;
        }

        function retornarConsultaDestiancaoVazia(destinacao) {
            if (angular.isUndefined(destinacao)) {
                $state.go('destinacao.consultarDestinacao');
            }
        }

        function marcarEsconderTabela(edicao, bloquear) {
            return edicao === true || bloquear === true;
        }

        function inicializarDestinacaoImovel() {
            vm.listaArquivosPreview = [];
            vm.destinacaoImovel = {documentos: [],
                                   benfeitoriasDestinadas: [],
                                   fotoVideo: [],
                                   parcelas: [],
                                   arquivosRemover: []};
        }

        function getCompoDadosUtilizacao() {
            vm.dadosUtilizacao = vm.destinacaoImovel.imovel.rip + ''
            + vm.destinacaoImovel.imovel.codigoUtilizacao + '' + vm.destinacaoImovel.imovel.parcela.sequencial;
        }

        function iniciaDadosDestinacaoImovel() {
            vm.exibirDadosImovel = true;
            vm.destinacaoImovel = vm.destinacao.destinacaoImoveis[vm.indice];
            inicializarDadosBenfeitoriasDestinacaoSalva(vm.destinacaoImovel);
            formatarSequencialParcela(vm.destinacaoImovel.imovel);
            somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
            obterValorAreaUtilizarAnterior(vm.destinacaoImovel.imovel.parcela.benfeitorias);
            getCompoDadosUtilizacao();
            verificarPodeExibirUploadFotosDescricaoArea();
            somarAreaDisponivel();
            calcularFracaoIdeal();
            prepararArquivos(vm.destinacaoImovel);
            vm.listaArquivosPreview = vm.destinacaoImovel.documentos ? angular.copy(vm.destinacaoImovel.documentos) : [];
        }

        function inicializarDadosBenfeitoriasDestinacaoSalva(destinacaoImovel) {
            if (angular.isDefined(destinacaoImovel) && angular.isDefined(destinacaoImovel.id)) {
                var benfeitorias = destinacaoImovel.imovel.benfeitorias;
                var benfeitoriasDestinadas = destinacaoImovel.benfeitoriasDestinadas;
                angular.forEach(benfeitorias, function(benfeitoria) {
                    benfeitoria.areaUtilizar = getAreaDestinadaBenfeitoria(benfeitoria, benfeitoriasDestinadas);
                });
            }
        }

        function prepararArquivos(destinacaoImovel) {
            destinacaoImovel.documentos = arquivoService.prepararArquivosRecuperados(destinacaoImovel.documentos);
            destinacaoImovel.fotoVideo = arquivoService.prepararArquivosRecuperados(destinacaoImovel.fotoVideo);
        }

        function obterValorAreaUtilizarAnterior(benfeitorias) {
            if (vm.edicao === true) {
                if (angular.isDefined(benfeitorias)) {
                    angular.forEach(benfeitorias, function(benfeitoria) {
                        benfeitoria.areaUtilizarAnterior = angular.copy(benfeitoria.areaUtilizar);
                    });
                }
            }
        }

        function fechar() {
            $state.go(vm.nomeStateDestinacao);
        }

        function buscar() {
            var rip = vm.dadosUtilizacao.substring(0, 8);
            var sequencialParcela = 'P' + parseInt(vm.dadosUtilizacao.substring(9, 13));
            var tipoDestinacaoEnum = angular.copy(vm.destinacao.tipoDestinacaoEnum);
            imovelDestinacaoService.consultarPorRipParcela(rip, sequencialParcela, tipoDestinacaoEnum, vm.destinacao.codFundamentoLegal, vm.idModalidade)
            .then(function(resposta) {
                vm.destinacaoImovel.imovel = resposta.data.resultado;
                vm.destinacaoImovel.parcelas = vm.destinacaoImovel.imovel.parcelas;
                vm.exibirDadosImovel = true;
                formatarSequencialParcela(vm.destinacaoImovel.imovel);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
            }, function(error) {
                mensagemDestinacaoService.mostrarMensagemError(error.data.erros[0]);
                vm.dadosUtilizacao = '';
            });
        }

        function selecionarImovelFuncional() {
            var rip = vm.dadosUtilizacao.substring(0, 8);
            var parcela = 'P' + parseInt(vm.dadosUtilizacao.substring(9,13));
            var tipoDestinacao = angular.copy(vm.destinacao.tipoDestinacaoEnum);
            imovelDestinacaoService.consultarPorRipParcela(rip, parcela,tipoDestinacao, vm.destinacao.codFundamentoLegal).then(function (resposta) {
                vm.destinacaoImovel.imovel = resposta.data.resultado;
                vm.destinacaoImovel.parcelas = vm.destinacaoImovel.imovel.parcelas;
                vm.exibirDadosImovel = true;
                formatarSequencialParcela(vm.destinacaoImovel.imovel);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
            },function (error) {
                mensagemDestinacaoService.mostrarMensagemError(error.data.erros[0]);
            });

        }

        function formatarCodigoUtilizacao(destinacaoImovel) {
            return inserirImovelParcelaUtil.formatarDadosParcela(destinacaoImovel);
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
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeStateDestinacao);
            $state.go('destinacao.consultarUtilizacaoDisponivel')
        }

        function somarAreaDisponivel() {
            somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
        }

        function verificarAreaUtilizarMaiorAreaDisponivel(benfeitoria) {
            if (benfeitoria.areaUtilizar > benfeitoria.areaDisponivel) {
                benfeitoria.areaUtilizar = undefined;
                mensagemDestinacaoService.mostrarMensagemError($filter('translate')('msg-area-utilizar-maior-area-disponivel'));
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
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
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
                throw mensagem;
            }

            if (inserirDadosImovelParcelaService.validarEditarAreaPermitidaMenor(porcentagemMenorPermitida, benfeitoria.areaUtilizar)) {
                benfeitoria.areaUtilizar = angular.copy(benfeitoria.areaUtilizarAnterior);
                mensagem = $filter('translate')('msg-area-utilizar-menor-permitido');
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
                somarAreasBenfeitorias(vm.destinacaoImovel.imovel.parcela.benfeitorias);
                throw mensagem;
            }

        }

        function verificarPodeExibirUploadFotosDescricaoArea() {
            var benfeitorias = vm.destinacaoImovel.imovel.parcela.benfeitorias;
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

            vm.destinacaoImovel.benfeitoriasDestinadas = addBenfeitoriasDestinadas(vm.destinacaoImovel.imovel.parcela.benfeitorias);
            inserirParcela(vm.destinacaoImovel.imovel.parcela);
            incluirImovel();
            destinacaoEscopoCompartilhadoService.setDestinacao(vm.destinacao, vm.nomeStateDestinacao);
            $state.go(vm.nomeStateDestinacao);
        }

        function inserirParcela(parcela) {
            var descImovelParcela = [];
            for (var i = 0; i < vm.destinacaoImovel.parcelas.length; i++) {
                if (parcela.id === vm.destinacaoImovel.parcelas[i].id) {
                    descImovelParcela.push(angular.copy(parcela));
                }
            }
            vm.destinacaoImovel.parcelas = descImovelParcela;
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
            if (angular.isDefined(vm.indice)) {
                vm.destinacaoImoveis[vm.indice] = vm.destinacaoImovel;
            } else {
                vm.destinacao.destinacaoImoveis.push(vm.destinacaoImovel);
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

        function setDadosMemorialDescritivo(desabilitarMemorialDestcritivo, coordenadas) {
            vm.destinacaoImovel.memorialDescAreaConstruida = coordenadas;
            vm.desabilitarMemorialDescritivo = true;
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

        function abrirDetalharParcela() {
            comumDestinacaoService.buscarUrlHome().then(function (response) {
                var url = response.data.resposta;
                $window.open(url + 'incorporacao/detalharImovel/' + vm.destinacaoImovel.imovel.idCadastroImovel,'_blank');
            });

        }

        function exibirOutrasUtilizacoes() {
          vm.isExibirOutrasUtilizacoes = !vm.isExibirOutrasUtilizacoes;
        }

        function formatarParcela(sequencial) {
            return 'P' + parseInt(sequencial.substring(1, sequencial.length - 1));
        }

    }

})();
