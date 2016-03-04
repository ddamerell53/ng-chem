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
      controller: ['$scope', '$rootScope', '$filter', function($scope, $rootScope, $filter){

      	$scope.breadcrumbList = [
      		{
      			name:"test", 
      			query_type: "string", 
      			query : {}, 
      			sort_direction:"asc"
      		},
      		{
      			name:"test2", 
      			query_type: "string", 
      			query : {}, 
      			sort_direction:"desc"
      		}
      	];

      	/* Close action for a breadcrumb. Remove from list */
      	$scope.closeBreadcrumb = function(bcid){
      	
  			//use underscore.js differnce method to remove item from array
  			$scope.breadcrumbList = _.reject( $scope.breadcrumbList, function(item){ return item.name == bcid; })

      		//broadcast that item has been removed
      		console.log($scope.breadcrumbList)
      	};

      	/* Function watching for a search altered event to add or remove breadcrumb */
      	$scope.$on('searchChanged', function(){

      	});

      	$scope.filterClicked = function(filter){
      		$rootScope.$broadcast('columnSelection', filter);
      	}


      }],

    };
  });
