'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:diableAnimation
 * @restrict 'A'
 * @description
 * # diableAnimation
 */
angular.module('chembiohubAssayApp')
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
