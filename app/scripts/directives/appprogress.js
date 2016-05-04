'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:appProgress
 * @restrict 'E'
 * @description
 * # appProgress
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .directive('appProgress', [ function () {
    return {
      templateUrl: 'views/templates/app-progress.html',
      restrict: 'E',
      scope: { wizard: '=' },
      controller: function() {
      	//convert svg files in img tags to inline svgs for styling
      	svgify();
      }
    };
  }]);
