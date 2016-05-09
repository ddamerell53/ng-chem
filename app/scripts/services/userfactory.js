'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.UserFactory
 * @description
 * # UserFactory
 * Factory for providing convenient, parameterised access to the user account related API endpoint (users).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} $resource angular service containing access to the project list endpoint.
 */
angular.module('chembiohubAssayApp')
  .factory('UserFactory', function ($resource, urlConfig) {
    
    return $resource(urlConfig.users.list_endpoint, {username:'@username'}, { });

  });
