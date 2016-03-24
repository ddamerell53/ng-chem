'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SearchUrlParamsV2
 * @description
 * # SearchUrlParamsV2
 * Provider in the chembiohubAssayApp.
 */


angular.module('chembiohubAssayApp')
    .factory('SearchUrlParamsV2', ['$filter', '$state', 'skinConfig', '$rootScope', 'CBHCompoundBatch','urlConfig', function($filter, $state, skinConfig, $rootScope, CBHCompoundBatch, urlConfig) {

        // Private variables

        // Private constructor

        var searchUrlParamsV2 = {"params":{"query": []}};

        searchUrlParamsV2.generate_form = function(stateParams, cbh) {
            skinConfig.objects[0].refresh_tabular_schema();
            
            
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var filteredColumns = [];
            var filterObjects = [];
             if(stateParams.encoded_query){
               var qs = JSON.parse(atob(stateParams.encoded_query));
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
                var hides = JSON.parse(atob(stateParams.encoded_hides));
                var hideObjs = [];
                angular.forEach(hides, function(hide){
                  schema[hide].hide = "hide";
                   hideObjs.push(schema[hide]);
                });
                skinConfig.objects[0].hides_applied = hides;
                skinConfig.objects[0].hide_objects = hideObjs ;
            }else{
              skinConfig.objects[0].hides_applied = [];
                skinConfig.objects[0].hide_objects = [] ;
            }

            if(stateParams.encoded_sorts){
                var sorts = JSON.parse(atob(stateParams.encoded_sorts));
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
            
            var projids = [];
            if(stateParams.pids){
              projids = stateParams.pids.split(",");
            }

            
            cbh.selected_projects = [];
            
            angular.forEach(cbh.projects.objects, function(p){
              if (projids.indexOf(p.id.toString()) > -1){
                p.filtered = true;
                cbh.selected_projects.push(p);
              }else{
                p.filtered = false;
              }
            });


            if(stateParams.textsearch){
              cbh.textsearch = atob(stateParams.textsearch);
            }else{
              cbh.textsearch = '';
            }



            
          };

      function ngParamSerializer(params) {
            if (!params) return '';
            var parts = [];
            angular.forEach(params, function(value, key) {
              if (value === null || angular.isUndefined(value)) return;
              if (angular.isArray(value)) {
                angular.forEach(value, function(v) {
                  parts.push(encodeURIComponent(key)  + '=' + encodeURIComponent(v));
                });
              } else {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
              }
            });

            return parts.join('&');
          };
      searchUrlParamsV2.setBaseDownloadUrl = function(cbh, params){
         cbh.baseDownloadUrl = urlConfig.cbh_compound_batches_v2.list_endpoint + "?";
         cbh.baseDownloadUrl += ngParamSerializer(params);
      }

      searchUrlParamsV2.generate_filter_params = function(params){
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var filteredColumns = [];
           
            var query = skinConfig.objects[0].filters_applied.map(function(item){
              var subQ = {};
              //Select only the filters that have a value - note that the data has been validated already
              angular.forEach(skinConfig.objects[0].query_schemaform.default.schema.properties, function(value, key){
                if(schema[item].filters[key]){
                  subQ[key] = schema[item].filters[key];
                  
                }
                
              });
              subQ["field_path"] = schema[item].filters["field_path"];
              filteredColumns.push(schema[item]);
              return subQ;
            });
            params.encoded_query = btoa(JSON.stringify(query));

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
          params.encoded_hides = btoa(JSON.stringify(hides));
          
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

          params.encoded_sorts = btoa(JSON.stringify(sorts));
          
          $rootScope.$broadcast("searchParamsChanged");
          return params;
        }
        

        
         searchUrlParamsV2.get_textsearch_params = function(stateParams, textsearch){
            //Adding a function here so everything is in one place that affects the search params
            stateParams.textsearch = btoa(textsearch);
            return stateParams;
         }

         searchUrlParamsV2.get_project_params = function(stateParams, selected_projects){
            var pids = selected_projects.map(function(p){return p.id});
            stateParams.pids = pids.join(",");
            return stateParams
         }

         /* For saved search, we are limiting the set of returned items to provide a snapshot 
            of that search at the time specified.
            To do this, we need to get the result returned by the search with the highest batch ID */
         searchUrlParamsV2.generate_capped_saved_search = function(params){
            //get the params as JSON
            var paramsObj = JSON.parse(atob(params.encoded_query));
            var backend_query = {'limit':1, 'offset': 0};
            var importantParams = ['pids', 'archived', 'encoded_query'];
            angular.forEach(importantParams, function(p){
              backend_query[p] = params[p];

            })
            //TODO hanlde error from this call
            var promise = CBHCompoundBatch.queryv2(backend_query).then(function(result) {

              //get the single result, and add this as a parameter to encoded_query
              var cap_batch_id = result.objects[0].id
              var capping_query = {
                "query_type":"less_than",
                "less_than": cap_batch_id,
                "field_path":"id"
              }
              paramsObj.push(capping_query);
              params.encoded_query = btoa(JSON.stringify(paramsObj));
              //we haven't changed the search parameters - we're just getting what they would be if capped so no need to notify about parameter changes
              return params

              
            });

            return promise;

            
         }


        return searchUrlParamsV2;

        // Public API for configuration


    }]);
