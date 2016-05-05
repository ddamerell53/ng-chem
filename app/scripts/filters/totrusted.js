'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:toTrusted
 * @description
 * # toTrusted
 * Not used
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .filter('toTrusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
