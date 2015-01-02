'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.LoginService
 * @description
 * # LoginService
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('LoginService', function () {
    // Service logic
    // ...

    // Public API here
    return {
      getLogin: function () {
        
        return meaningOfLife;
      }
    };
  });
