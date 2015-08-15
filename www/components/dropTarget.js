;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .directive('fnDropTarget', dropTarget);

  function dropTarget() {
    return {
      restrict: 'E',
      template: '<div id="dropTarget" ng-transclude></div>',
      controller: '@',
      name: 'fnController',
      transclude: true,
      scope: {
        handleDroppedFiles: '&fnOnDropped'
      },
      link: function(scope, element, attr, ctrl) {
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
