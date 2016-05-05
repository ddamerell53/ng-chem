'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:removeSpaces
 * @description
 * # titleCase
 * In order to create unique keys for user-created fields, spaces have to be replaced with text. This filter converts the key into the 
 * originally inputted text for display.
 * Not currently used but a useful example.
 */
angular.module('chembiohubAssayApp')
  .filter('removeSpaces', function () {
    return function (input) {

      return input.replace(/__space__/g,' ');

    }
  });