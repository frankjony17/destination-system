/**
 * Created by gabriel on 29/08/16.
 */
(function(){
  angular.module('su-destinacao')
    .factory('TraducoesDestinacao', factory);

  factory.$inject = ['$translatePartialLoader', '$translate'];

  function factory($translatePartialLoader, $translate) {
      return function() {
        angular.forEach(arguments, function(translationKey) {
          $translatePartialLoader.addPart(translationKey);
        });
        $translatePartialLoader.addPart('scripts-destinacao/app/language');

        return $translate.refresh();
      }
  }
})();
