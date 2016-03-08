'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:searchBreadcrumbs
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
            $timeout(function(){
              $scope.setfilterAsString(obj);
            });
           
          });
          $scope.sort_objects = skinConfig.objects[0].sort_objects;

          $scope.hide_objects = skinConfig.objects[0].hide_objects;


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
                obj.display_filter = "> " +  obj.filters.greater_than  + " and < " +  obj.filters.less_than;
              }
              else if(obj.filters.less_than ){
                obj.display_filter = "< " +  obj.filters.less_than;
              }
              else if(obj.filters.greater_than ){
                obj.display_filter = "> " +  obj.filters.greater_than;
              }
              else{
                obj.display_filter = $scope.filterTypeName(obj) + " " ;
                if(obj.filters[obj.filters.query_type]){
                  obj.display_filter += obj.filters[obj.filters.query_type];
                }
              }
            }

      	/* Close action for a breadcrumb. Remove from list */
      	$scope.closeBreadcrumb = function(bcid){
      	
  			//use underscore.js differnce method to remove item from array
  			
      	};

      


      }],

    };
  });
