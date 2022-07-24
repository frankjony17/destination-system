angular.module('su-destinacao')
  .directive('carouselDestinacao', function () {
    return {
      restrict: 'EA',
      templateUrl: 'scripts-destinacao/app/directives/carousel/templates/carousel.html',
      scope: {
        imagens: '='
      },
      controller: function ($scope, $timeout, $mdDialog) {

        $scope.selectedIndex = 0;
        $scope.transition = '';
        $scope.transitionTime = 500;

        $scope.avanca = avanca;
        $scope.retorna = retorna;

        $scope.exibirVideo = exibirVideo;

        function avanca () {
          if ($scope.selectedIndex <= $scope.imagens.length) {
            $scope.transition = 'right';
            $timeout(function () {
              $scope.transition = 'left';
              $scope.selectedIndex++;
              $timeout(function () {
                $scope.transition = '';
              }, $scope.transitionTime);
            }, $scope.transitionTime);
          }
        }

        function retorna () {
          if ($scope.selectedIndex > 0) {
            $scope.transition = 'left';
            $timeout(function () {
              $scope.transition = 'right';
              $scope.selectedIndex--;
              $timeout(function () {
                $scope.transition = '';
              }, $scope.transitionTime);
            }, $scope.transitionTime);
          }
        }

        $scope.$watch('imagens', function () {
            $scope.selectedIndex = 0;
            $scope.transition = '';
        });

        function exibirVideo(media){
          if(media.tipoArquivo === 'VIDEO' || media.extensao === '.mp4'){
            $mdDialog.show({
              controller: 'modalVideoController',
              controllerAs: 'modalVideoCtrl',
              templateUrl: 'scripts-destinacao/app/directives/carousel/templates/partials/modalVideo.html',
              locals: {
                video: angular.copy(media)
              }
               }).then(function () {

            });
          }
        }

      }

    };
  });
