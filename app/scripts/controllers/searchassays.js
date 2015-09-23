'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchAssaysCtrl
 * @description
 * # SearchAssaysCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('SearchAssaysCtrl', ['$scope', '$filter', function ($scope, $filter) {
    
  	//need to be able to pull in, via this controller or a service:

  	//user list;
  	//available projects (l0) which user has access to (l0_with_permission);
  	//studies available to the selected projects
  	//assays available to the selected studies

  	//and populate into scope models to be used in filters and aggregations on the page

  	
    $scope.selections = {
      'l0': [],
      'l1': [],
      'l2': [],

    };

    $scope.dates = {
      'start': '',
      'end': '',
      'startES': '',
      'endES': '',
    }
  	

  	$scope.selectedUris = function(level){
      //return the URIs of the selected items in the multiselect for the appropriate level
      var uris = []

      angular.forEach($scope.selections[level], function(lev) {
        var res_uri = lev._source[level].resource_uri;
        uris.push(res_uri);
      })
      return uris;

    };

    $scope.clearSelections = function(level) {
      //remove any selections made in the appropriate level selector
      $scope.selections[level] = [];
    }

    $scope.dateHandler = function(startOrEnd) {
      console.log('date handler',startOrEnd);
      //convert the date to the required format for the elasticsearch filter
      var oldDate = $scope.dates[startOrEnd];
      var dateObj = new Date(oldDate);
      $scope.dates[startOrEnd + 'ES'] = $filter('date')(dateObj, 'yyyy-MM-dd');


    }








  }]);
