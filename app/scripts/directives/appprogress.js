'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:appProgress
 * @description
 * # appProgress
 */
angular.module('ngChemApp')
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
