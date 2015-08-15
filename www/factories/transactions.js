;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .factory('transactionsFactory', transactionsFactory);

  /**
   * Description
   * @method transactionsFactory
   * @return CallExpression
   */
  function transactionsFactory() {
    var self = this;

    return angular.extend(self, {
      importTransactions: importTransactions
    });

    /**
     * Description
     * @method importTransactions
     * @param {} fileOfTransactions
     */
    function importTransactions(fileOfTransactions) {
      console.dir(fileOfTransactions);
    }
  }
})(window, document, angular);
