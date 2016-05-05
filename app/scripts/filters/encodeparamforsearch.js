'use strict';

/**
 * @ngdoc filter
 * @name chembiohubAssayApp.filter:encodeParamForSearch
 * @description
 * # encodeParamForSearch
 * Converts data from a multi-select, pick-from-list form element to a string for use in web service calls
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
