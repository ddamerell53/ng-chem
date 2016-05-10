'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.Projectpermissions
 * @description
 * # Projectpermissions
 * Factory for providing convenient, parameterised access to the project type related API endpoints ({@link https://github.com/thesgc/chembiohub_ws/wiki/Project-Permission-API cbh_permissions}).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} $resource angular service containing access to the project list endpoint with custom PATCH alias (update).
 */
angular.module('chembiohubAssayApp')
  .factory('Projectpermissions', function ($resource, urlConfig) {
    // Service logic
    // ...
    return $resource(urlConfig.cbh_permissions.list_endpoint + '/:codename', {codename:'@codename'}, {
        'update': { method:'PATCH' }
    });
   
  });
