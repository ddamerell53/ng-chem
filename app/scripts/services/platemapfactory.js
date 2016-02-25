'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.PlateMapFactory
 * @description
 * # PlateMapFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('PlateMapFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {
    
    //return $resource(urlConfig.cbh_plate_map, {}, {});

    var list = $resource(urlConfig.cbh_plate_map.list_endpoint + '/:id', {id:'@id'}, {
        'update': { method:'PATCH' }
    });
    var list_es = $resource(urlConfig.cbh_plate_map.list_endpoint + '/get_list_elasticsearch/', {creator_uri: '@creator_uri'}, {});
    var reindex = $resource(urlConfig.cbh_plate_map.list_endpoint + '/reindex_compound', {}, {});

    return {
      "list":list,
      "list_es":list_es,
      "reindex":reindex,
    }

    
  }]);
