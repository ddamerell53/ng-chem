'use strict';

/**
 * @ngdoc filter
 * @name ngChemApp.filter:toTrusted
 * @function
 * @description
 * # toTrusted
 * Filter in the ngChemApp.
 */
angular.module('ngChemApp')
  .filter('toTrusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
