'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:toTrusted
 * @function
 * @description
 * # toTrusted
 * Filter in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .filter('toTrusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
