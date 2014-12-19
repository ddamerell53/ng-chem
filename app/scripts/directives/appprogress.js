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
      scope: { wizard: '=' }
    };
  }]);
