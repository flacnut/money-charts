;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .factory('transactionsFactory', transactionsFactory);

  function transactionsFactory() {
    var self = this;

    return angular.extend(self, {
      importTransactions: importTransactions
    });

    function importTransactions(fileOfTransactions) {
      console.dir(fileOfTransactions);
    }
  }
})(window, document, angular);
