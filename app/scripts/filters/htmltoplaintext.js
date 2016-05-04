'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:htmlToPlaintext
 * @description
 * # htmlToPlainText
 * Filter in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .filter('htmlToPlaintext', function() {
     return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);
