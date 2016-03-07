'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:searchFilter
 * @description
 * # SearchFilter
 */
angular.module('chembiohubAssayApp')
  .directive('searchFilter', [ function () {
    return {
      templateUrl: 'views/templates/search-filter-templatev2.html',
      restrict: 'E',
      transclude: true,
      scope: {
      	cbh: "=",
      },
      controller: ["$scope", "$rootScope", "skinConfig", "$timeout", function($scope, $rootScope, skinConfig, $timeout){
      	
      	$scope.showFilters = false;
      	//has the filter button been pressed in the handsontable?
      	$rootScope.$on("columnSelection", function(event, col){
        	$scope.col = col;
          if(!$scope.col.filters){
            $scope.col.filters = {};
          }
        	// $scope.cbh.column = col
          $scope.asfForm = angular.copy(skinConfig.objects[0].query_form);
          $scope.asfSchema = angular.copy(skinConfig.objects[0].query_schema);
          
        	$scope.showFilters = true;
          

           
        });
        
        $scope.updated = function(foo, form){
            // document.getElementById('html5ValidationForm').submit();
            if(form.key != "query_type"){

            
            $timeout(function(){
              document.getElementById('validatorId').click();
            });
            }
            
        }
      
        	
        $scope.submit = function(form){
          $scope.$broadcast("schemaFormValidate");
          console.log("submit", form);
          return false;
        }

        $scope.close = function(){
          $scope.watcher();
        	$scope.showFilters = false;
        }

        //now we need a way of getting the correct form and schema for this field from the custom fields


      }],
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the SearchFilter directive');
      }*/
    };
  }]);
