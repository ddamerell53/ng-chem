'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:searchBreadcrumbs
 * @restrict 'E'
 * @description
 * # searchBreadcrumbs
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
        $scope.$on("searchParamsChanged", function(){

              $scope.filter_objects = skinConfig.objects[0].filter_objects;
          $scope.queryAsfForm = angular.copy(skinConfig.objects[0].query_schemaform.default.form);

          angular.forEach($scope.filter_objects, function(obj){
              $scope.setfilterAsString(obj);
      
           
          });
          $scope.hide_objects = skinConfig.objects[0].hide_objects;

          $scope.sort_objects = skinConfig.objects[0].sort_objects;

          

        })
      
        $scope.filterTypeName = function(obj){
            var name = "";
              angular.forEach($scope.queryAsfForm[0].titleMap,function(item){
                if(item.value == obj.filters.query_type){
                   name = item.name;
                }
              });
              return name;
            }

            $scope.setfilterAsString = function(obj){
              
              if(obj.filters.greater_than && obj.filters.less_than){
                obj.display_filter = "Between " +  obj.filters.greater_than  + " and " +  obj.filters.less_than;
              }
              
              else{
                obj.display_filter = $scope.filterTypeName(obj)  ;
                if(obj.filters.query_type=='pick_from_list'){
                    if(obj.filters[obj.filters.query_type].length < 4){
                        obj.display_filter += ": " + obj.filters[obj.filters.query_type]
                    }else{
                        obj.display_filter += ": " + obj.filters[obj.filters.query_type].length + " items selected";
                    }

                }else if(obj.filters[obj.filters.query_type]){
                  obj.display_filter += ": " + obj.filters[obj.filters.query_type];
                }
              }
            }

      	/* Close action for a breadcrumb. Remove from list */
      	$scope.closeSortBreadcrumb = function(bc){
      	
          bc.sort_direction = "No Sort";
          $rootScope.$broadcast("removeSort", {"field_path": bc.data});
        
  			
      	};

        $scope.unHideAll = function(){
          angular.forEach($scope.hide_objects, function(bc){
            bc.hide= 'show';
          });;
          $rootScope.$broadcast("removeAllHides");

        }

        $scope.toggleHide = function(bc){
          if(bc.hide=='hide'){
            bc.hide = "show";
          $rootScope.$broadcast("removeHide", {"field_path": bc.data});
        }else{
          bc.hide = "hide";
          $rootScope.$broadcast("addHide", {"field_path": bc.data});

        }
          
        
        };

        $scope.closeHideBreadcrumb = function(bc){

          bc.hide = "show";
          $rootScope.$broadcast("removeHide", {"field_path": bc.data});
        
        
        };
        $scope.closeFilterBreadcrumb = function(bc){
          
          bc.display_filter = "";
          $rootScope.$broadcast("cleanupFilters",{"col": bc, "reset_query_type" : true })         
          $rootScope.$broadcast("filtersUpdated", {"addNew" : false,  "field_path" : bc.data , "col" : bc} ); 


        };

        $scope.removeStructureSearch = function(){
          $rootScope.$broadcast("removeStructureSearch");
        }

        $scope.$on("removeStructureSearch", function(){
          $scope.chemicalfilter = undefined;
        });

        $scope.filterClicked = function(bc){
          $rootScope.$broadcast("columnSelection", bc);
        };
        $scope.chemicalfilter = undefined;
        $scope.$on("chemicalFilterApplied", function(){
            //get whatever the applied filter is
            $scope.chemicalfilter = angular.copy(skinConfig.objects[0].chemicalSearch);
            angular.forEach($scope.cbh.tabular_data_schema, function(col){
              if(col.knownBy=="Structure"){
                $scope.structureCol = col;
              }
              
            });
            var titles = skinConfig.objects[0].chem_query_schemaform.default.form[0].items[0].titleMap;
            angular.forEach(titles, function(t){
              if(t.value == $scope.chemicalfilter.query_type){
                $scope.queryName = t.name;
              }
            })
        });
      


      }],

    };
  });
