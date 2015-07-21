'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.skinning
 * @description
 * # skinning
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('SkinningFactory', function ($resource) {
    // Service logic
    // ...

    return $resource(urlConfig.cbh_skinning.list_endpoint , { }, { });
  });
