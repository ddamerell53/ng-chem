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
           

           

          $scope.sort_objects = skinConfig.objects[0].sort_objects;

          $scope.hide_objects = skinConfig.objects[0].hide_objects;

          });
          

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

            $scope.filterAsString = function(obj){
              console.log(obj);
              if(obj.filters.query_type.indexOf("blanks" > -1)){
                console.log("here")
                var name = $scope.filterTypeName(obj);
                console.log(name);
                return name;
              }
              if(obj.query_type.indexOf("less_than" > -1)){
                return "< " +  obj.filters.less_than;
              }
              if(obj.query_type.indexOf("greater_than" > -1)){
                return "> " +  obj.filters.greater_than;
              }
              if(obj.query_type.indexOf("between" > -1)){
                return "> " +  obj.filters.greater_than  + " and < " +  obj.filters.less_than;
              }
              return $scope.filterTypeName(obj) + " " + obj.filters[query_type];
            }

      	/* Close action for a breadcrumb. Remove from list */
      	$scope.closeBreadcrumb = function(bcid){
      	
  			//use underscore.js differnce method to remove item from array
  			
      	};

      


      }],

    };
  });
