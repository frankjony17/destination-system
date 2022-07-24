(function () {
    'use strict';

    angular.module('su-destinacao')
        .config(configLocalStorage)
        .config(configProgressBar)
        .config(configDataFormatacao);

        function configLocalStorage (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('destinacao');
        }

        function configProgressBar (cfpLoadingBarProvider) {
          cfpLoadingBarProvider.includeBar = false;
        }

        function configDataFormatacao ($mdDateLocaleProvider, moment) {
          $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
          };

          $mdDateLocaleProvider.parseDate = function(dateString) {
            if (dateString == null || dateString.length == 0) {
              return null;
            }

            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : '';
          }
        }

})();
