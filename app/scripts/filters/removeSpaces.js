'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:removeSpaces
 * @description
 * # titleCase
 * Filter in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .filter('removeSpaces', function () {
    return function (input) {

      return input.replace(/__space__/g,' ');

    }
  });