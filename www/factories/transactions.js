;(function(window, document, angular, undefined) {
  'use strict';

  // declare these here so we don't regerenate them repeatedly.
  var datePattern = /(\d{2})\/(\d{2})\/(\d{4})/,
    regionStateCountryPattern = /(\s+(\w+)\s+(\w{2})\s+(\w{2,3}))$/,
    stateCountryPattern = /\s+(\w{2})\s+(\w{2,3})$/,
    countryPattern = /\s+(\w{2})$/;

  angular
    .module('money')
    .factory('transactionsFactory', transactionsFactory);

  /**
   * Description
   * @class transactionsFactory
   * @method transactionsFactory
   * @param {} $q
   * @return CallExpression
   */
  function transactionsFactory($q) {
    var self = this,
      transactions = [];

    return angular.extend(self, {
      transactions: transactions,

      importTransactions: importTransactions,
      importFile: importFile
    });

    /**
     * Description
     * @method importFile
     * @param {} file
     * @return MemberExpression
     */
    function importFile(file) {
      var reader = new FileReader(),
        deferred = $q.defer();

      /**
       * Description
       * @method onload
       * @param {} event
       */
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
     * @param {} fileName
     * @param {} transactions
     * @return CallExpression
     */
    function importTransactions(fileName, transactions) {
      var importedTransactions = 0,
        transactionPromises = [];

      angular.forEach(transactions, function withTransaction(transaction, index) {
        if (index === 0 || !transaction) {
          return;
        }

        transactionPromises.push(processTransaction(transaction)
          .then(function withTransactionObj(transactionObj) {
            importedTransactions++;
            self.transactions.push(transactionObj);
          })
          .catch(function onProcessErr(err) {
            console.dir(transaction);
            console.dir(err);
          }));
      });

      return $q.all(transactionPromises).then(function onImported(){
        if (importedTransactions) {
          return $q.when(importedTransactions);
        } else {
          return $q.reject("No transactions were imported, empty or invalid file?");
        }
      });
    }

    /**
     * Description
     * @method processTransaction
     * @param {} transactionStr
     * @return CallExpression
     */
    function processTransaction(transactionStr) {
      var columns = transactionStr.replace(/"/g, '').split(','),
        transactionObj = {
          tags: [],
          raw: {
            date: columns[0],
            id: columns[1],
            description: columns[2],
            fee: columns[3],
            amount: columns[4],
            principleAmount: columns[5],
            interestAmount: columns[6],
            escrowAmount: columns[7],
            lateFees: columns[8],
            otherFees: columns[9],
            postDate: columns[10],
            checkNumber: columns[11]
          }
        };

      setDateData(transactionObj);
      setAmountData(transactionObj);
      setLocationData(transactionObj);
      setDescription(transactionObj);

      return $q.when(transactionObj);


      function setDateData(transaction) {
        var jsDate = new Date(transaction.raw.date.replace(datePattern,'$3-$1-$2'));

        transaction.date = {
          date: jsDate,
          dayOfWeek: jsDate.getDay(),
          month: jsDate.getMonth(),
          year: jsDate.getYear(),
          hours: jsDate.getHours(),
          minutes: jsDate.getMinutes()
        }
      }

      function setAmountData(transaction) {
        transaction.amount = transaction.raw.amount;

        var otherAmount =
          transaction.raw.principleAmount +
          transaction.raw.interestAmount +
          transaction.raw.escrowAmount +
          transaction.raw.lateFees +
          transaction.raw.otherFees;

        if (otherAmount) {
          transaction.totalAmount = otherAmount + transaction.amount;
        }
      }

      function setLocationData(transaction) {
        var matches = transaction.raw.description.match(regionStateCountryPattern),
          locationString = '',
          region = '',
          state = '',
          country = '';

        if (matches && matches.length === 5) {
          locationString = matches[0];
          region = matches[2];
          state = matches[3];
          country = matches[4];
        } else {
          matches = transaction.raw.description.match(stateCountryPattern);

          if (matches && matches.length === 3) {
            locationString = matches[0];
            state = matches[1];
            country = matches[2];
          } else {
            matches = transaction.raw.description.match(countryPattern);

            if (matches && matches.length === 2) {
              locationString = matches[0];
              country = matches[1];
            }
          }
        }

        transaction.location = {
          locationString: locationString,
          region: region,
          state: state,
          country: country
        };
      }

      function setDescription(transaction) {
        transaction.description = transaction.raw.description.replace(transaction.location.locationString, '');
      }
    }
  }
})(window, document, angular);
