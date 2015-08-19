'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.UserFactory
 * @description
 * # UserFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('UserFactory', function ($resource, urlConfig) {
    // Service logic
    // ...

    

    // Public API here
    return $resource(urlConfig.users.list_endpoint, {username:'@username'}, { });
  });
