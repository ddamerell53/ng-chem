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
          $scope.query_objects = skinConfig.objects[0].query_objects;

          $scope.sort_objects = skinConfig.objects[0].sort_objects;

          $scope.hide_objects = skinConfig.objects[0].hide_objects;

        })
      


      	/* Close action for a breadcrumb. Remove from list */
      	$scope.closeBreadcrumb = function(bcid){
      	
  			//use underscore.js differnce method to remove item from array
  			
      	};

      


      }],

    };
  });
