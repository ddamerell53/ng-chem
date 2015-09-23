'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchAssaysCtrl
 * @description
 * # SearchAssaysCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('SearchAssaysCtrl', function ($scope, $filter) {
    
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
      /*var selections = $scope.selections[level];
      console.log('selections', selections)
      var levs = _.pluck(selections, level);
      //console.log('levs', levs);
      return _.pluck(levs, 'resource_uri');*/
      var uris = []

      angular.forEach($scope.selections[level], function(lev) {
        var res_uri = lev._source[level].resource_uri;
        uris.push(res_uri);
      })
      //console.log('uris', uris);
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
      //console.log(oldDate);
      var dateObj = new Date(oldDate);
      //console.log(dateObj);
      $scope.dates[startOrEnd + 'ES'] = $filter('date')(dateObj, 'yyyy-MM-dd');


    }








  });
