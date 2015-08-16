;(function(window, document, angular, undefined) {
  'use strict';

  angular
    .module('money')
    .filter('bytesFormatter', bytesFormatter);

  // Filter: usage {{ file.fileObj.size | bytesFormatter }}
  function bytesFormatter() {
    return function format(input) {
      var result = +input;
      var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      var unit = 0;

      if (result === NaN) {
        return 'Invalid input \'' + input + '\'';
      }

      while (result > 750) {
        result = result / 1000;
        unit++;
      }

      if (result > 100) {
        result = Math.round(result);
      } else if (result > 10) {
        result = Math.round(result*10)/10;
      } else {
        result = Math.round(result*100)/100;
      }

      return result + " " + units[unit];
    }
  }
})(window, document, angular);
