'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:notEmpty
 * @function
 * @description
 Ensures that an object is not empty
 * # notEmpty
 * Filter in the chembiohubAssayApp.
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
