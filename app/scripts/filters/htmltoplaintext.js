'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:htmlToPlaintext
 * @description
 * # htmlToPlainText
 * Removes HTML special characters and markup from a supplied string
 */
angular.module('chembiohubAssayApp')
  .filter('htmlToPlaintext', function() {
     return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);
