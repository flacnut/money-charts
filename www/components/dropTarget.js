;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .directive('fnDropTarget', dropTarget);

  function dropTarget(TransactionService) {
    return {
      restrict: 'E',
      template: '<div id="dropTarget" ng-transclude></div>',
      transclude: true,
      link: function(scope, element) {
        function handleDrop(event) {
          event.stopPropagation();
          event.preventDefault();
          scope.fc.handleDroppedFiles(event.dataTransfer.files);
          scope.$apply();
        };

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
    };
  }
})(window, document, angular);
