;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .controller('dropFilesCtrl', dropFilesCtrl);

  function dropFilesCtrl(transactionsFactory) {
    return angular.extend(this, {
      handleDroppedFiles: function(files) {
        console.dir(files);
      }
    });
  }
})(window, document, angular);
