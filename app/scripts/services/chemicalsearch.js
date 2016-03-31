'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.chemicalSearch
 * @description
 * # chemicalSearch
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('chemicalSearch', function ($resource, urlConfig) {
    // Service logic
    // ...


    // Public API here
    return $resource(urlConfig.cbh_chemical_search.list_endpoint)
  });
