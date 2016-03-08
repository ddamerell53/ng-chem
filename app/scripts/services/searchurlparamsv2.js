'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SearchUrlParamsV2
 * @description
 * # SearchUrlParamsV2
 * Provider in the chembiohubAssayApp.
 */


angular.module('chembiohubAssayApp')
    .factory('SearchUrlParamsV2', function($filter, $state, skinConfig, $rootScope) {

        // Private variables

        // Private constructor

        var searchUrlParamsV2 = {"params":{"query": []}};

        searchUrlParamsV2.generate_form = function(stateParams) {
            //  if(stateParams.encoded_query){
            //    data.params.encoded_query = stateParams.encoded_query;
            //    data.paramsUrl = "?encoded_query=" + stateParams.encoded_query;
            // }
                
          };

      searchUrlParamsV2.generate_filter_params = function(){

            var params = {}
            var schema = skinConfig.objects[0].tabular_data_schema.schema;
            var filteredColumns = [];
           
            var query = skinConfig.objects[0].filters_applied.map(function(item){
              var subQ = {};
              //Select only the filters that have a value - note that the data has been validated already
              angular.forEach(skinConfig.objects[0].query_schemaform.default.form, function(f){
                if(schema[item].filters[f.key]){
                  subQ[f.key] = schema[item].filters[f.key];
                  
                }
                
              });
              subQ["field_path"] = schema[item].filters["field_path"];
              filteredColumns.push(schema[item]);
              return subQ;
            });

            params.encoded_query = JSON.stringify(query);

            skinConfig.objects[0].query_objects = filteredColumns;
            $rootScope.$broadcast("searchParamsChanged");
            console.log(filteredColumns)
            return params

        };

        searchUrlParamsV2.generate_hide_params = function(){
          var schema = skinConfig.objects[0].tabular_data_schema.schema;
          var params = {}
          var hides = skinConfig.objects[0].hides_applied;
          var hideObjs = [];
          angular.forEach(hides, function(field_path){
            hides.push(field_path);
            hideObjs.push(schema[field_path]);
          });
          skinConfig.objects[0].hide_objects = hideObjs ;
          params.encoded_hides = JSON.stringify(hides);
          $rootScope.$broadcast("searchParamsChanged");
          return params;
        }

        searchUrlParamsV2.generate_sort_params = function(){
          var schema = skinConfig.objects[0].tabular_data_schema.schema;
          var params = {};
          var sorts = [];
          var sortsapp = skinConfig.objects[0].sorts_applied;
          var sortObjs = [];
          angular.forEach(sortsapp, function(field_path){
            var sort = {"field_path" : field_path, "sort_direction" : schema[field_path].sort_direction};
            sorts.push(sort);
            sortObjs.push(schema[field_path]);
          })
          skinConfig.objects[0].sort_objects = sortObjs ;
          params.encoded_sorts = JSON.stringify(sorts);
          $rootScope.$broadcast("searchParamsChanged");
          return params;
        }
        

         searchUrlParamsV2.get_tabular_data_schema = function(stateParams) {
            
            return skinConfig.objects[0].get_table_schema_by_name("search_page");
         };


        return searchUrlParamsV2;

        // Public API for configuration


    });