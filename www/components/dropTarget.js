;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .directive('fnDropTarget', dropTarget)
    .controller('dropTargetCtrl', dropTargetCtrl);

  /**
  * The Controller to handle behavior on dropped files.
  * @class dropFilesCtrl
  * @param {} transactionsFactory
  * @return CallExpression
  */
  function dropTargetCtrl(transactionsFactory, _) {
    var files = [];

    return angular.extend(this, {
      files: files,

      chooseFile: chooseFile,
      removeFile: removeFile,
      handleDroppedFiles: handleDroppedFiles
    });

    /**
     * Description
     * @method handleDroppedFiles
     * @param {} files
     */
    function handleDroppedFiles(droppedFiles) {
      angular.forEach(droppedFiles, function withFile(file) {
        files.push(file);
      });
    }

    function chooseFile(file) {
      console.dir(file);
    }

    function removeFile(file) {
      _.remove(files, file);
    }
  }

  /**
   * Description
   * @method dropTarget
   * @return ObjectExpression
   */
  function dropTarget() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'dropTarget.html',
      controller: 'dropTargetCtrl',
      controllerAs: 'targetCtrl',
      transclude: true,
      link: link
    };

    /**
     * Description
     * @method link
     * @param {} scope
     * @param {} element
     * @param {} attr
     * @param {} ctrl
     */
    function link(scope, element, attr, ctrl) {

      /**
       * Description
       * @method handleDrop
       * @param {} event
       */
      function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        if (ctrl.hasOwnProperty('handleDroppedFiles') &&
            typeof ctrl.handleDroppedFiles === 'function') {
          ctrl.handleDroppedFiles(event.dataTransfer.files);
        } else {
          console.dir("No handleDroppedFiles function found!");
        }
        scope.$apply();
      };

      /**
       * Description
       * @method handleDragOver
       * @param {} event
       */
      function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      };

      // Setup the dnd listeners.
      var dropTargetEl = element[0];
      dropTargetEl.addEventListener('dragover', handleDragOver, false);
      dropTargetEl.addEventListener('drop', handleDrop, false);
    }
  }
})(window, document, angular);
