'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.Projectpermissions
 * @description
 * # Projectpermissions
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('Projectpermissions', function ($resource, urlConfig) {
    // Service logic
    // ...
    return $resource(urlConfig.cbh_permissions.list_endpoint + '/:codename', {codename:'@codename'}, {
        'update': { method:'PATCH' }
    });
   
  });
