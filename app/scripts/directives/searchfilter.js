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
      templateUrl: 'views/templates/search-filter-template.html',
      restrict: 'E',
      transclude: true,
      scope: {
      	cbh: "=",
      },
      controller: ["$scope", "$rootScope", function($scope, $rootScope){
      	
      	$scope.showFilters = false;
      	//has the filter button been pressed in the handsontable?
      	$rootScope.$on("columnSelection", function(event, col){
        	console.log("columnSelection", col)
        	$scope.col = col
        	$scope.cbh.column = col
        	$scope.showFilters = true;
        	$scope.$apply();
        });

        $scope.close = function(){
        	$scope.showFilters = false;
        }

        //now we need a way of getting the correct form and schema for this field from the custom fields


      }],
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the SearchFilter directive');
      }*/
    };
  }]);
