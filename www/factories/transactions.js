;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .factory('transactionsFactory', transactionsFactory);

  /**
   * Description
   * @class transactionsFactory
   * @return A transactionFactory
   */
  function transactionsFactory($q) {
    var self = this;

    return angular.extend(self, {
      importTransactions: importTransactions,
      importFile: importFile
    });

    function importFile(file) {
      var reader = new FileReader(),
        deferred = $q.defer();

      reader.onload = function onReaderLoad(event) {
        var text = event.target['result'];
        if (!text || typeof(text) !== 'string') {
          return deferred.reject('File contents unexpected type.');
        }

        importTransactions(file.name, text.split(/[\r\n]+/g))
          .then(function onSuccess() {
            deferred.resolve();
          })
          .catch(function onError(error) {
            deferred.reject("Error: " + file.name + " - " + error);
          });
      };

      reader.readAsText(file);
      return deferred.promise;
    }

    /**
     * Description
     * @method importTransactions
     * @param {} fileOfTransactions
     */
    function importTransactions(fileName, transactions) {
      console.dir(transactions);

      // import a transaction here
      return $q.reject("nope");
    }
  }
})(window, document, angular);
