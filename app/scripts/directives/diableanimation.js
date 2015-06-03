'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:diableAnimation
 * @description
 * # diableAnimation
 */
angular.module('ngChemApp')
  .directive('disableAnimation', function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
});
