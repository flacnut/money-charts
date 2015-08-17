;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .directive('fnTransactionsList', transactionsList)
    .controller('transactionsListCtrl', transactionsListCtrl);

  /**
   * The Controller to handle behavior on dropped files.
   * @class dropFilesCtrl
   * @method transactionsListCtrl
   * @param {} transactionsFactory
   * @param {} _
   */
  function transactionsListCtrl(transactionsFactory, _) {
    var self = this;
    
    angular.extend(self, {
      transactions: transactionsFactory.transactions,
      filteredTransactions: [],

      getSum: getSum
    });

    function getSum() {
      return _.sum(self.filteredTransactions, function(t) {
        return t.amount;
      });
    }
  }

  /**
   * Description
   * @method transactionsList
   * @return ObjectExpression
   */
  function transactionsList() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'transactionsList.html',
      controller: 'transactionsListCtrl',
      controllerAs: 'listCtrl'
    };
  }
})(window, document, angular);
