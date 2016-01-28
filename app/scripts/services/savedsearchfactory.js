'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SavedSearchFactory
 * @description
 * # SavedSearchFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('SavedSearchFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {
    
    return $resource(urlConfig.cbh_saved_search, {}, {});

    
  }]);
