(function () {

    'use strict';

    angular
        .module('su-destinacao')
        .factory('mensagemDestinacaoService', mensagem);

    function mensagem ($filter, destinacaoEscopoCompartilhadoService, $mdToast, $mdDialog) {

      function mostrarCamposInvalidos (form) {
        var titulo = $filter('translate')('msg-campos-obrigatorios');
        var error = form.$error;
        var mensagens = [];
        var msgPersonalizada = $filter('translate')('msg-campos-invalidos');

        verificarCamposObrigatorios(error, mensagens);
        verificarCamposCpf(error, mensagens, msgPersonalizada);
        verificarCamposCnpj(error, mensagens, msgPersonalizada);
        verificarCamposTelefone (error, mensagens);

        if (mensagens.length > 0)
          exibirMesagemErroVariosCampos(titulo, mensagens);

      }

      function verificarCamposObrigatorios(error, mensagens) {
        angular.forEach(error.required, function (field) {
            if (field.$invalid) {
                if (!verificarExisteCampo(mensagens, field.$name))
                    mensagens.push(field.$name);
            }
        });
      }

      function verificarCamposTelefone (error, mensagens, msgPersonalizada) {
        angular.forEach(error.brPhoneNumber, function (phone) {
          if (phone.$invalid) {
            if (!verificarExisteCampo(mensagens, phone.$name))
              addMensagem(phone.$name, msgPersonalizada, mensagens);
          }
        });
      }

      function verificarCamposCpf(error, mensagens, msgPersonalizada) {
        angular.forEach(error.cpf, function (cpf) {
          if (cpf.$invalid) {
            if (!verificarExisteCampo(mensagens, cpf.$name))
              addMensagem(cpf.$name, msgPersonalizada, mensagens);
          }
        });
      }

      function verificarCamposCnpj(error, mensagens, msgPersonalizada) {
        angular.forEach(error.cnpj, function (cnpj) {
          if (cnpj.$invalid) {
            if (!verificarExisteCampo(mensagens, cnpj.$name))
              addMensagem(cnpj.$name, msgPersonalizada, mensagens);
          }
        });
      }

      function addMensagem(campo, msgPersonalizada, mensagens) {
        if (msgPersonalizada) {
          mensagens.push(msgPersonalizada);
        } else {
          mensagens.push(campo);
        }
      }

      var exibirMesagemErroVariosCampos = function (titulo, mensagens) {
          destinacaoEscopoCompartilhadoService.setObjetos('mensagens', mensagens);
          destinacaoEscopoCompartilhadoService.setObjetos('titulo', titulo);

          $mdToast.show({
              controller: toastController,
              templateUrl: 'scripts-destinacao/app/toast/error-toast-titulo-template.html',
              focusOnOpen: false,
              hideDelay: 30000,
              position: 'top right'
          });
        };

      function verificarExisteCampo (mensagens, campo) {
        var existe = false;
        angular.forEach(mensagens, function (item) {
            if (item == campo)
                existe = true;
        });
        return existe;
      }

      function toastController ($scope, $mdToast, destinacaoEscopoCompartilhadoService) {

                $scope.show = false;
                $scope.titulo = angular.copy(destinacaoEscopoCompartilhadoService.getObjeto('titulo'));
                $scope.msgs = angular.copy(destinacaoEscopoCompartilhadoService.getMensagens());

                $scope.isArray = $scope.msgs instanceof Array;

                $scope.$on("toast-close", function () {
                    $scope.show = false;
                    $mdToast.hide();
                });

                function showToast() {
                    if (!$scope.show) {
                        $scope.show = true;
                    } else {
                        $scope.$broadcast('toast-close');
                    }
                }

                function cleanUp() {
                    angular.element(window).off('click', showToast);
                }

                angular.element(window).on('click', showToast);
                $scope.$on('$destroy', cleanUp);

        }

        function mostrarMensagemError (msg) {
            destinacaoEscopoCompartilhadoService.limparMensagens();
            destinacaoEscopoCompartilhadoService.setObjetos('mensagens', msg);
            $mdToast.show({
                controller: toastController,
                templateUrl: 'scripts-destinacao/app/toast/error-toast-titulo-template.html',
                focusOnOpen: false,
                hideDelay: 30000,
                position: 'top right'
            });
        }


        function mostrarMensagemErrorValidacao (msg) {
            destinacaoEscopoCompartilhadoService.limparMensagens();
            $mdToast.show({
                controller: toastController,
                templateUrl: 'scripts-destinacao/app/toast/error-toast-titulo-template.html',
                focusOnOpen: false,
                hideDelay: 30000,
                position: 'top right'
            });
        }

        function confirmar (mensagem, confirmar, cancelar) {
          var confirm = $mdDialog.confirm({focusOnOpen: false})
           .title($filter('translate')('label-titulo-confirmacao'))
           .textContent(mensagem)
           .ok($filter('translate')('btn-sim'))
           .cancel($filter('translate')('btn-nao'));
           $mdDialog.show(confirm).then(confirmar, cancelar);
        }

      function confirmarEditandoBotoes (mensagem, confirmar, cancelar) {
        var confirm = $mdDialog.confirm({focusOnOpen: false})
          .title($filter('translate')('label-titulo-confirmacao'))
          .textContent(mensagem)
          .ok($filter('translate')('btn-confirmar'))
          .cancel($filter('translate')('btn-cancelar'));
        $mdDialog.show(confirm).then(confirmar, cancelar);
      }

        function mostrarMensagemSucesso (msg) {

          var mensagem = msg instanceof Array ? verificarPossuiMensagem(msg) : msg;

          destinacaoEscopoCompartilhadoService.limparMensagens();
          destinacaoEscopoCompartilhadoService.setMensagens(mensagem);
          $mdToast.show({
              controller: toastController,
              templateUrl: 'scripts-componentes/toast/toast-template-success.html',
              focusOnOpen: false,
              hideDelay: 30000,
              position: 'top right'
          });
        }

        function verificarPossuiMensagem (mensagens) {
          try {
            return mensagens[0];
          } catch(error) {
            return '';
          }
        }

        return {
          mostrarCamposInvalidos: mostrarCamposInvalidos,
          exibirMesagemErroVariosCampos: exibirMesagemErroVariosCampos,
          mostrarMensagemError: mostrarMensagemError,
          confirmar: confirmar,
          mostrarMensagemSucesso: mostrarMensagemSucesso,
          confirmarEditandoBotoes: confirmarEditandoBotoes,
            mostrarMensagemErrorValidacao: mostrarMensagemErrorValidacao
        };
    }

})();
