(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('arquivoService', service);

    function service (mensagemDestinacaoService, $filter, $window, Upload, $http, moment) {

      var CONTENT_TYPE_PDF = 'application/pdf';
      var CONTENT_TYPE_FOTO_JPEG = 'image/jpeg';
      var CONTENT_TYPE_FOTO_PNG = 'image/png';
      var CONTENT_TYPE_FOTO_JPG = 'image/jpg';
      var CONTENT_TYPE_ZIP = 'application/zip';
      var CONTENT_TYPE_MP4 = 'video/mp4';
      var CONTENT_TYPE_TXT = 'text/plain';
      var CONTENT_TYPE_DOC = 'application/msword';
      var CONTENT_TYPE_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      var CONTECT_TYPE_ODT = 'application/vnd.oasis.opendocument.text';

      var TAMANHO_20_MB = 20480;
      var TAMANHO_5_MB = 5120;

      var URL_UPLOAD_NOVO_PADRAO = 'destinacao/api/arquivo/uploadNovo';
      var URL_UPLOAD = 'destinacao/api/arquivo/upload';
      var URL_UPLOAD_COM_SHAPEFILE = 'destinacao/api/arquivo/uploadComShapeFile';
      var URL_API = 'destinacao/api/arquivo/';

      function validarFormatoDocumento (formato){
        if(formato !== CONTENT_TYPE_PDF &&
          formato !== CONTENT_TYPE_TXT &&
          formato !== CONTENT_TYPE_DOC &&
          formato !== CONTENT_TYPE_DOCX &&
          formato !== CONTECT_TYPE_ODT){
          var mensagem = $filter('translate')('msg-documento-formato-invalido');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarFormatoFoto (formato){
        if(formato !== CONTENT_TYPE_FOTO_JPG &&
          formato !== CONTENT_TYPE_FOTO_JPEG &&
          formato !== CONTENT_TYPE_FOTO_PNG){
          var mensagem = $filter('translate')('msg-foto-formato-invalido');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarTamanho5MB(tamanhoArquivo) {
        if (tamanhoArquivo === TAMANHO_5_MB) {
          var mensagem = $filter('translate')('msg-arquivo-vinte-mb');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarFormatoArquivo (formato) {
          if (formato !== CONTENT_TYPE_PDF &&
          formato !== CONTENT_TYPE_DOC &&
          formato !== CONTENT_TYPE_DOCX) {
              //modifiquei a mensagem por conta da mensagem do doação, caso em outras diretivas a mensagem for diferente colocar msg-arquivo-formato-invalido
              var mensagem = $filter('translate')('msg-formato-invalido-pdf');
              mensagemDestinacaoService.mostrarMensagemError(mensagem);
              throw mensagem;
          }
      }

      function validarFormatoArquivoFotoVideo(formato){
        if (formato !== CONTENT_TYPE_FOTO_JPEG &&
          formato !== CONTENT_TYPE_FOTO_PNG &&
          formato !== CONTENT_TYPE_FOTO_JPG &&
          formato !== CONTENT_TYPE_MP4) {
          var mensagem = $filter('translate')('msg-arquivo-formato-invalido');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarTamanhoArquivo(tamanhoArquivo) {
        if (tamanhoArquivo === TAMANHO_20_MB) {
          var mensagem = $filter('translate')('msg-arquivo-vinte-mb');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarFormatoArquivoMemorialDescritivo(file){
        var formato = getFileType(file);
        if (formato !== CONTENT_TYPE_PDF && formato !== CONTENT_TYPE_ZIP) {
          var mensagem = $filter('translate')('msg-formato-arquivo-memorial-descritivo');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }
      }

      function validarFormatoArquivoFotoPDF (formato) {
        if ((formato !== CONTENT_TYPE_FOTO_JPEG)
                && (formato !== CONTENT_TYPE_FOTO_PNG)
                && (formato !==CONTENT_TYPE_FOTO_JPG)
                && (formato !== CONTENT_TYPE_PDF)) {
          var mensagem = $filter('translate')('msg-formatos-nao-permitidos');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }

      }

      function uploadNovo(arquivo, descricao, dataArquivo) {
        var dataFormatada = null;
        if(dataArquivo !== ''){
          dataFormatada = moment(dataArquivo).format('YYYY-MM-DD');
        }
        return Upload.upload({url: URL_UPLOAD_NOVO_PADRAO+'/'+descricao+'/'+dataFormatada ,data: {file: arquivo}});
      }

      function uploadFotoPdf(arquivo) {
        return Upload.upload({url: URL_UPLOAD, data: {file: arquivo}});
      }

      function gerarPreview (arquivo) {
        $http.get(baixarArquivo(arquivo), {responseType: 'arraybuffer'}).then(function (resposta) {
          var file = new Blob([resposta.data], {type: 'application/pdf'});
          var url = URL.createObjectURL(file);
          $window.open(url);
        });
      }

      function upload (file, callBack) {
        Upload.upload({url: URL_UPLOAD, data: {file: file}}).then(function (resposta) {
          file.id = resposta.data.resultado.id;
          if (angular.isDefined(callBack)) {
            callBack(file);
          }
        }, function(error) {
          var mensagem = error.data.erros;
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
        });
      }

        function uploadDocumento (file, callBack) {
            Upload.upload({url: URL_UPLOAD, data: {file: file}}).then(function (resposta) {
                if (angular.isDefined(callBack)) {
                    callBack(resposta);
                }
            }, function(error) {
                var mensagem = error.data.erros;
                mensagemDestinacaoService.mostrarMensagemError(mensagem);
            });
        }

      function uploadComShapeFile (file) {
        return Upload.upload({url: URL_UPLOAD_COM_SHAPEFILE, data: {file: file}});
      }

      function downloadArquivoRequerimento(id) {
        return URL_API + 'downloadArquivoRequerimento/' + id;
      }

      function downloadGestaoPraia(nomeArquivo) {
        return URL_API + 'downloadArquivoRequerimentoGestaoPraia/' + nomeArquivo;
      }

      function listarArquivosRequerimento(idRequerimento, idDocumento) {
        return  $http.get(URL_API + 'listarArquivosRequerimento/' + idRequerimento + '/' + idDocumento);
      }

      function baixarArquivo(arquivo) {
        return URL_API + 'baixarArquivo/' + arquivo.id;
      }

      function removerArquivo(id) {
        return $http.delete(URL_API + 'remover/' + id);
      }

        function removerAtoComplementar(id) {
            return $http.delete(URL_API + 'removerAtoComplementar/' + id);
        }

      function getFileType($file) {
        if(($window.navigator.appVersion.indexOf("Win")!==-1)){
          var extensao = getFileExtension($file.name);
          if(extensao === 'zip'){
            return CONTENT_TYPE_ZIP;
          }
        }
        return retornaTipoArquivo($file);
      }

      function retornaTipoArquivo($file) {
        if (angular.isDefined($file.contentType)) {
          return $file.contentType;
        }
        return $file.type;
      }

      function validarShapeFile($file) {
        var formato = getFileType($file);
        return formato === CONTENT_TYPE_ZIP;
      }

      function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext === null ? "" : ext[1];
      }

      function uploadFotoVideo(file, descricao, data) {
        var dataFormatada = moment(data).format('YYYY-MM-DD');
        return Upload.upload({url: URL_API + 'uploadFotoVideo/' + descricao + '/' + dataFormatada , data: {file: file}});
      }

      function isVideo(arquivo) {
        return arquivo.type === CONTENT_TYPE_MP4;
      }

      function isImagem(arquivo) {
        return arquivo.type === CONTENT_TYPE_FOTO_JPEG
          || arquivo.type === CONTENT_TYPE_FOTO_PNG
          || arquivo.type === CONTENT_TYPE_FOTO_JPG;
      }

      function validarFormatoValido(formatos, formato) {
        var formatosUpperCase = formatos.map(function (elem) {
          return elem.toUpperCase();
        });

        var extensao = formato.replace('application/','').replace('image/', '').replace('video/', '');

        if (formatosUpperCase.indexOf(extensao.toUpperCase()) < 0) {
          var mensagem = $filter('translate')('msg-arquivo-formato-invalido');
          mensagemDestinacaoService.mostrarMensagemError(mensagem);
          throw mensagem;
        }

      }

      function prepararArquivosRecuperados(arquivos) {
        if (angular.isDefined(arquivos)) {
          var arquivosPreparados = [];
          angular.forEach(arquivos, function(arquivo) {
            var novoArquivo = {id: arquivo.id,
                               descricao: arquivo.descricao,
                               documento: arquivo,
                               exibirPreview: false,
                               imagem: arquivo.imagem};
            if (arquivo.contentType === CONTENT_TYPE_MP4) {
              novoArquivo.tipoArquivo = 'VIDEO';
            } else if (isTipoImagem(arquivo.contentType)) {
              novoArquivo.tipoArquivo = 'IMAGEM';
            } else {
              novoArquivo.exibirPreview = true;
            }
            arquivosPreparados.push(novoArquivo);
          });

          return arquivosPreparados;
        }
      }

      function isTipoImagem(tipo) {
        return tipo === CONTENT_TYPE_FOTO_JPEG
        || tipo === CONTENT_TYPE_FOTO_PNG
        || tipo === CONTENT_TYPE_FOTO_JPG;
      }

      return {
        validarFormatoArquivo: validarFormatoArquivo,
        gerarPreview: gerarPreview,
        upload: upload,
        downloadArquivoRequerimento: downloadArquivoRequerimento,
        listarArquivosRequerimento: listarArquivosRequerimento,
        uploadFotoPdf: uploadFotoPdf,
        validarFormatoArquivoFotoPDF: validarFormatoArquivoFotoPDF,
        downloadGestaoPraia: downloadGestaoPraia,
        baixarArquivo: baixarArquivo,
        removerArquivo: removerArquivo,
        validarFormatoArquivoMemorialDescritivo : validarFormatoArquivoMemorialDescritivo,
        uploadComShapeFile : uploadComShapeFile,
        validarShapeFile : validarShapeFile,
        getFileType : getFileType,
        validarTamanhoArquivo: validarTamanhoArquivo,
        validarFormatoArquivoFotoVideo: validarFormatoArquivoFotoVideo,
        uploadFotoVideo: uploadFotoVideo,
        isVideo: isVideo,
        isImagem: isImagem,
        uploadNovo: uploadNovo,
        validarFormatoDocumento: validarFormatoDocumento,
        validarFormatoFoto: validarFormatoFoto,
        validarTamanho5MB: validarTamanho5MB,
        validarFormatoValido: validarFormatoValido,
        prepararArquivosRecuperados: prepararArquivosRecuperados,
        uploadDocumento: uploadDocumento,
          removerAtoComplementar: removerAtoComplementar
      };
    }

})();
