;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .controller('dropFilesCtrl', dropFilesCtrl);

  /**
   * The Controller to handle behavior on dropped files.
   * @class dropFilesCtrl 
   * @param {} transactionsFactory
   * @return CallExpression
   */
  function dropFilesCtrl(transactionsFactory) {
    return angular.extend(this, {
      handleDroppedFiles: handleDroppedFiles
    });

    /**
     * Description
     * @method handleDroppedFiles
     * @param {} files
     */
    function handleDroppedFiles(files) {
      console.dir(files);
    }
  }
})(window, document, angular);
