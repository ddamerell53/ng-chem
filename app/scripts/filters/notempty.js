'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:notEmpty
 * @description
 * # notEmpty
 * Ensures that an object is not empty.
 */
angular.module('chembiohubAssayApp')
  .filter('notEmpty', function () {
    return function (input) {
        if(input){
            return Object.keys(input).length > 0;
        }else{
            return false;
        }
      
    };
  });
