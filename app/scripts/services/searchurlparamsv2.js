'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SearchUrlParamsV2
 * @description
 * # SearchUrlParamsV2
 * Provider in the chembiohubAssayApp.
 */


angular.module('chembiohubAssayApp')
    .factory('SearchUrlParamsV2', function($filter, $state) {

        // Private variables

        // Private constructor

        var searchUrlParamsV2 = {};

        searchUrlParamsV2.generate_form = function(stateParams) {
            var data = {
                        "searchForm" : {"query": []},
                        "params": {},
                        "paramsUrl": ""
                    }
            if(stateParams.encoded_query){
               data.searchForm.query = JSON.decode(stateParams.encoded_query);
               data.params.encoded_query = stateParams.encoded_query;
               data.paramsUrl = "?encoded_query=" + stateParams.encoded_query;
            }
            return data
                
          };

      searchUrlParamsV2.generate_new_params = function(searchForm){
            var params = {}
            params.encoded_query = JSON.stringify(searchForm.query);
            return SearchUrlParams.generate_form(params);
            
        };

        return searchUrlParamsV2;

        // Public API for configuration


    });