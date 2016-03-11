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

        searchUrlParamsV2.generate_form = function(stateParams, cbh) {
            skinConfig.objects[0].refresh_tabular_schema();
            if(stateParams.textsearch){
              cbh.textsearch = stateParams.textsearch;
            }
            
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var filteredColumns = [];
            var filterObjects = [];
             if(stateParams.encoded_query){
               var qs = JSON.parse(stateParams.encoded_query);
               angular.forEach(qs, function(q){
                  schema[q.field_path].filters = q;
                  filterObjects.push(schema[q.field_path]);
                  filteredColumns.push(q.field_path);
               });
               skinConfig.objects[0].filters_applied = filteredColumns;
                skinConfig.objects[0].filter_objects = filterObjects ;
            }else{
              skinConfig.objects[0].filters_applied = [];
                skinConfig.objects[0].filter_objects = [] ;
            }
            if(stateParams.encoded_hides){
                var hides = JSON.parse(stateParams.encoded_hides);
                var hideObjs = [];
                angular.forEach(hides, function(hide){
                  schema[hide].hide = "hide";
                   hideObjs.push(schema[hide]);
                });
                console.log(hideObjs);
                skinConfig.objects[0].hides_applied = hides;
                skinConfig.objects[0].hide_objects = hideObjs ;
            }else{
              skinConfig.objects[0].hides_applied = [];
                skinConfig.objects[0].hide_objects = [] ;
            }

            if(stateParams.encoded_sorts){
                var sorts = JSON.parse(stateParams.encoded_sorts);
                var sort_objects= [];
                var sorts_applied = [];
                angular.forEach(sorts, function(sort){
                  schema[sort.field_path].sort_direction = sort.sort_direction;
                   sort_objects.push(schema[sort.field_path]);
                   sorts_applied.push(sort.field_path);
                });
                skinConfig.objects[0].sorts_applied = sorts_applied;
                skinConfig.objects[0].sort_objects = sort_objects ;
            }else{
              skinConfig.objects[0].sorts_applied = [];
                skinConfig.objects[0].sort_objects = [] ;
            }
            
          };

      searchUrlParamsV2.generate_filter_params = function(params){
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
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
            if(params.encoded_query == "[]"){
              params.encoded_query = undefined;
            }

            skinConfig.objects[0].filter_objects = filteredColumns;
            $rootScope.$broadcast("searchParamsChanged");
            return params

        };

        searchUrlParamsV2.generate_hide_params = function(params){
          var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
          var hides = skinConfig.objects[0].hides_applied;
          console.log(hides)
          var hideObjs = [];
          angular.forEach(hides, function(field_path){
            hideObjs.push(schema[field_path]);
          });
          skinConfig.objects[0].hide_objects = hideObjs ;
          params.encoded_hides = JSON.stringify(hides);
          if(params.encoded_hides == "[]"){
              params.encoded_hides = undefined;
            }
          $rootScope.$broadcast("searchParamsChanged");
          return params;
        }

        searchUrlParamsV2.generate_sort_params = function(params){
          var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
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
          if(params.encoded_sorts == "[]"){
              params.encoded_sorts = undefined;
            }
          $rootScope.$broadcast("searchParamsChanged");
          return params;
        }
        

         searchUrlParamsV2.get_tabular_data_schema = function(stateParams) {
            
            return skinConfig.objects[0].get_table_schema_by_name("search_page");
         };

         searchUrlParamsV2.get_textsearch_params = function(stateParams, textsearch){
            //Adding a function here so everything is in one place that affects the search params
            stateParams.textsearch = textsearch;
            return stateParams;
         }


        return searchUrlParamsV2;

        // Public API for configuration


    });