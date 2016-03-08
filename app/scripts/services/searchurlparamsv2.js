'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SearchUrlParamsV2
 * @description
 * # SearchUrlParamsV2
 * Provider in the chembiohubAssayApp.
 */


angular.module('chembiohubAssayApp')
    .factory('SearchUrlParamsV2', function($filter, $state, skinConfig) {

        // Private variables

        // Private constructor

        var searchUrlParamsV2 = {"params":{"query": []}};

        searchUrlParamsV2.generate_form = function(stateParams) {
             if(stateParams.encoded_query){
               data.params.encoded_query = stateParams.encoded_query;
               data.paramsUrl = "?encoded_query=" + stateParams.encoded_query;
            }
                
          };

      searchUrlParamsV2.generate_new_params = function(){

            var params = {}
            var schema = skinConfig.objects[0].tabular_data_schema.schema;
            var filteredColumns = [];
            for (var key in schema) {
              if (schema.hasOwnProperty(key)) {
                schema[key].filter_applied = false;
              }
            }
            var query = skinConfig.objects[0].filters_applied.map(function(item){
              var subQ = {};
              //Select only the filters that have a value - not that the data has been validated already
              angular.forEach(skinConfig.objects[0].query_schemaform.default.form, function(f){
                console.log(f)
                if(schema[item].filters[f.key]){
                  subQ[f.key] = schema[item].filters[f.key];
                  
                }
                
              });
              schema[item].filter_applied = true;
              filteredColumns.push(schema[item]);
              return subQ;
            });

            params.encoded_query = JSON.stringify(query);
            console.log("generating", filteredColumns)
            skinConfig.objects[0].current_query = filteredColumns;
            return params

        };

         searchUrlParamsV2.get_tabular_data_schema = function(stateParams) {
            
            return skinConfig.objects[0].get_table_schema_by_name("search_page");
         };


        return searchUrlParamsV2;

        // Public API for configuration


    });