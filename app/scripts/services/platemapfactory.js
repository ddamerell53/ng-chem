'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.PlateMapFactory
 * @description
 * # PlateMapFactory
 * Factory which provides convenient, parameterised access to plate map related web service endpoints (cbh_plate_map).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} object Object containing keyed $resource objects
 */
angular.module('chembiohubAssayApp')
  .factory('PlateMapFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.PlateMapFactory#list
     * @propertyOf chembiohubAssayApp.PlateMapFactory
     * @description
     * Resource alias for retrieveing lists of available platemaps, or a single platemap by ID. Alos provides a custom PATCH alias (update).
     * @param {string} [id] unique ID for a plate map batch object
     */
    var list = $resource(urlConfig.cbh_plate_map.list_endpoint + '/:id', {id:'@id'}, {
        'update': { method:'PATCH' }
    });

    /*.queryv2 = function(filters) {
        
         var promise = $http( 
            {
                url: urlConfig.cbh_compound_batches_v2.list_endpoint ,
                method: 'GET',
                params: filters
            }
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };*/

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.PlateMapFactory#list_es
     * @propertyOf chembiohubAssayApp.PlateMapFactory
     * @description
     * Resource alias for accessing platemap objects stored in the elasticsearch index. 
     * Optional parameter to limit by user who has created the plate record.
     * @param {string} [creator_uri] user ID to limit plate records to.
     */
    var list_es = $resource(urlConfig.cbh_plate_map.list_endpoint + '/get_list_elasticsearch/', {creator_uri: '@creator_uri'}, {});

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.PlateMapFactory#reindex
     * @propertyOf chembiohubAssayApp.PlateMapFactory
     * @description
     * Resource alias for reindexing a batch record representing a plate map.
     */
    var reindex = $resource(urlConfig.cbh_plate_map.list_endpoint + '/reindex_compound', {}, {});

    return {
      "list":list,
      "list_es":list_es,
      "reindex":reindex,
    }

    
  }]);
