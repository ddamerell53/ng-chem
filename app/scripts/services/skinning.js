'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.skinning
 * @description
 * # skinning
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('SkinningFactory', function ($resource) {
    // Service logic
    // ...

    return $resource(urlConfig.cbh_skinning.list_endpoint , { }, { });
  });
