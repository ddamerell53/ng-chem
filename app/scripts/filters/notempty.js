'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:notEmpty
 * @description
 * # notEmpty
 * Tests that a JSON object is not empty. Used as a display conditional.
 * @returns {boolean} boolean whether the object is empty or not. 
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
