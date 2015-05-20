'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.UserFactory
 * @description
 * # UserFactory
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('UserFactory', function ($resource, urlConfig) {
    // Service logic
    // ...

    

    // Public API here
    return $resource(urlConfig.users.list_endpoint, {username:'@username'}, { });
  });
