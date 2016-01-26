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
    
    var list = $resource(urlConfig.instance_path.url_frag + 'datastore/saved_searches/');

    return {
      "list": list,
    }

    
  }]);
