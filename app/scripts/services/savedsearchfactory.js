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
    
    //return $resource(urlConfig.cbh_saved_search, {}, {});

    var list = $resource(urlConfig.cbh_saved_search.list_endpoint, {}, {});
    var list_es = $resource(urlConfig.cbh_saved_search.list_endpoint + '/get_list_elasticsearch/', {}, {});
    var reindex = $resource(urlConfig.cbh_saved_search.list_endpoint + '/reindex_compound', {}, {});

    return {
      "list":list,
      "list_es":list_es,
      "reindex":reindex,
    }

    
  }]);
