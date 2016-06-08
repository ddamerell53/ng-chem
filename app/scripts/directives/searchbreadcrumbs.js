'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:searchBreadcrumbs
 * @restrict 'E'
 * @scope
 * @param {object} cbh The top level cbh object to help with globals and configuration
 * @description
 * # searchBreadcrumbs
 * Visual representation of applied search parameters. Since each subform is displayed separately, the app needs to show the user 
 * which filters, sorts and searches they've applied. Also simplifies removing one aspect of a search.
 *
 */
angular.module('chembiohubAssayApp')
  .directive('searchBreadcrumbs', function () {
    return {
      templateUrl: 'views/templates/search-breadcrumb-template.html',
      restrict: 'E',
      transclude: true,
      scope: {
      	cbh: "=",
      },
      controller: ['$scope', '$rootScope', '$filter', 'skinConfig', function($scope, $rootScope, $filter, skinConfig){
        
        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.$on
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * The name searchParamsChanged is defined in the schema of the data addition UI for tag fields
         * This function alters the scoped variables for filters and sorts so they can be rendered in the breadcrums template.
         * @param {string} searchParamsChanged  the name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("searchParamsChanged", function(){

              $scope.filter_objects = skinConfig.objects[0].filter_objects;
          $scope.queryAsfForm = angular.copy(skinConfig.objects[0].query_schemaform.default.form);

          angular.forEach($scope.filter_objects, function(obj){
              $scope.setfilterAsString(obj);
      
           
          });
          $scope.hide_objects = skinConfig.objects[0].hide_objects;

          $scope.sort_objects = skinConfig.objects[0].sort_objects;

          

        })
        
        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.filterTypeName
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * This function pulls out the human readable name of the filter for display
         * @param {object} obj  query object containing information about currently applied filter
         *
         */
        $scope.filterTypeName = function(obj){
          var name = "";
          angular.forEach($scope.queryAsfForm[0].titleMap,function(item){
            if(item.value == obj.filters.query_type){
               name = item.name;
            }
          });
          return name;
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.setfilterAsString
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * This function is used to create a human-readable interpretation of the applied filter parameters, such as 'Between', 'and/or' and 
         * descriptive sufixes.
         * @param {object} obj  query object containing information about currently applied filter
         *
         */
        $scope.setfilterAsString = function(obj){
          
          if(obj.filters.greater_than && obj.filters.less_than){
            obj.display_filter = "Between " +  obj.filters.greater_than  + " and " +  obj.filters.less_than;
          }
          
          else{
            obj.display_filter = $scope.filterTypeName(obj)  ;
            if(obj.filters.query_type=='pick_from_list'){
                if(obj.filters[obj.filters.query_type].length < 2){
                    obj.display_filter += ": " + obj.filters[obj.filters.query_type]
                }else{
                    obj.display_filter += ": " + obj.filters[obj.filters.query_type].length + " items selected";
                }

            }else if(obj.filters[obj.filters.query_type]){
              obj.display_filter += ": " + obj.filters[obj.filters.query_type];
            }
          }
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.closeSortBreadcrumb
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Close action for a breadcrumb. Remove from list
         * @param {object} bc  query object containing information about current breadcrumb
         *
         */
      	$scope.closeSortBreadcrumb = function(bc){
      	
          bc.sort_direction = "No Sort";
          $rootScope.$broadcast("removeSort", {"field_path": bc.data});
        
      	};

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.unHideAll
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Function which removes any filters to hide individual columns from the results table. Causes a cascading broadcast of 
         * removeAllHides for other parts of the search mechanism within the app.
         *
         */
        $scope.unHideAll = function(){
          angular.forEach($scope.hide_objects, function(bc){
            bc.hide= 'show';
          });
          $rootScope.$broadcast("removeAllHides");

        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.toggleHide
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Function which adds or removes one filter to show or hide an individual column from the results table. Causes a cascading broadcast of 
         * removeHide or addHide for other parts of the search mechanism within the app.
         * @param {object} bc  query object containing information about current breadcrumb and the command issued
         *
         */
        $scope.toggleHide = function(bc){
          if(bc.hide=='hide'){
            bc.hide = "show";
            $rootScope.$broadcast("removeHide", {"field_path": bc.data});
          }else{
            bc.hide = "hide";
            $rootScope.$broadcast("addHide", {"field_path": bc.data});
          }
        
        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.closeHideBreadcrumb
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Function which removes a filter to redisplay an individual column from the results table. Causes a cascading broadcast of 
         * removeHide for other parts of the search mechanism within the app.
         * @param {object} bc  query object containing information about current breadcrumb
         *
         */
        $scope.closeHideBreadcrumb = function(bc){

          bc.hide = "show";
          $rootScope.$broadcast("removeHide", {"field_path": bc.data});
        
        
        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.closeFilterBreadcrumb
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Function which removes a search filter from the applied search query and breadcrumbs list. Causes cascading broadcasts of 
         * cleanupFilters and filtersUpdated for other parts of the search mechanism within the app.
         * @param {object} bc  query object containing information about current breadcrumb
         *
         */
        $scope.closeFilterBreadcrumb = function(bc){
          
          bc.display_filter = "";
          $rootScope.$broadcast("cleanupFilters",{"col": bc, "reset_query_type" : true })         
          $rootScope.$broadcast("filtersUpdated", {"addNew" : false,  "field_path" : bc.data , "col" : bc} ); 


        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.removeStructureSearch
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Causes cascading broadcast of removeStructureSearch for other parts of the search mechanism within the app and within this directive.
         *
         */
        $scope.removeStructureSearch = function(){
          $rootScope.$broadcast("removeStructureSearch");
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.$on
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * The name removeStructureSearch is defined in the schema of the data addition UI for tag fields
         * This function causes any structure serach information to be deleted (set as undefined).
         * @param {string} removeStructureSearch  the name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("removeStructureSearch", function(){
          $scope.chemicalfilter = undefined;
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.filterClicked
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * Causes cascading broadcast of columnSelection for other parts of the search mechanism within the app and within this directive.
         * @param {object} bc  query object containing information about current breadcrumb
         *
         */
        $scope.filterClicked = function(bc){
          $rootScope.$broadcast("columnSelection", bc);
        };


        $scope.chemicalfilter = undefined;

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.directive:searchBreadcrumbs#$scope.$on
         * @methodOf chembiohubAssayApp.directive:searchBreadcrumbs
         * @description
         * The name chemicalFilterApplied is defined in the schema of the data addition UI for tag fields
         * This function locates the structure column in the results table and processes the chemical search to identify 
         * what sort of structure search to perform.
         * @param {string} chemicalFilterApplied  the name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */

        $scope.$on("chemicalFilterApplied", function(){
            //get whatever the applied filter is
            console.log("chemfilt")
            $scope.chemicalfilter = angular.copy(skinConfig.objects[0].chemicalSearch);
            
            var titles = skinConfig.objects[0].chem_query_schemaform.default.form[0].items[0].titleMap;
            angular.forEach(titles, function(t){
              if(t.value == $scope.chemicalfilter.query_type){
                $scope.queryName = t.name;
              }
            })
        });
      
      angular.forEach($scope.cbh.tabular_data_schema, function(col){
              if(col.knownBy=="Structure"){
                $scope.structureCol = col;
              }
              
            });


      }],

    };
  });
