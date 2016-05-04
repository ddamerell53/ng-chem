'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:disableAnimation
 * @restrict 'A'
 * @description
 * # disableAnimation
 * not used
 * @deprecated
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
