'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:encodeParamForSearch
 * @function
 * @description
 * # encodeParamForSearch
 * Filter in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .filter('encodeParamForSearch', function () {
    return function (input) {
        var data = [{"pick_from_list" : [input.value], 
                    "field_path": input.field_path,
                    "query_type" : "pick_from_list"}]

      return btoa(JSON.stringify(data));
    };
  });
