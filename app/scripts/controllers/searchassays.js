'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchAssaysCtrl
 * @description
 * # SearchAssaysCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('SearchAssaysCtrl', ['$scope', '$filter', '$modal', 'urlConfig', '$stateParams', function ($scope, $filter, $modal, urlConfig, $stateParams) {
    
  	//need to be able to pull in, via this controller or a service:

  	//user list;
  	//available projects (l0) which user has access to (l0_with_permission);
  	//studies available to the selected projects
  	//assays available to the selected studies

  	//and populate into scope models to be used in filters and aggregations on the page

  	$scope.cbh.textsearch = $stateParams.textsearch;
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

    $scope.modalInstance = {};
    $scope.popup_data = {};
  	

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
      //convert the date to the required format for the elasticsearch filter
      var oldDate = $scope.dates[startOrEnd];
      if (oldDate != '') {
        var dateObj = new Date(oldDate);

        $scope.dates[startOrEnd + 'ES'] = $filter('date')(dateObj, 'yyyy-MM-dd');
      }
      else {
        $scope.dates[startOrEnd + 'ES'] = '';
      }
      

    }

    $scope.resetForm = function() {
      angular.forEach($scope.selections, function(val, key){
        $scope.selections[key] = [];
      });
      $scope.dates.start = '';
      $scope.dates.end = '';
      $scope.dates.startES = '';
      $scope.dates.endES = '';
      $scope.cbh.textsearch = '';

    }

    $scope.showChemblPopup = function(chembl_data){
      $scope.popup_data = chembl_data;
      $scope.modalInstance = $modal.open({
              templateUrl: 'views/modal-template.html',
              size: 'lg',
              resolve: {
                popup_data: function () {
                  return $scope.popup_data;
                },

              }, 
              controller: function($scope, $modalInstance, popup_data, $timeout) {
                $scope.popup_data = popup_data;
                $scope.popup_data['main_cfc'] = 'chembl'
                
                $scope.modalInstance = $modalInstance;

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };

              }});
    }

    $scope.showDetailPopup = function(cfc_uri, project_data){
      /*console.log('cfcuri', cfc_uri);
      console.log('proj_data', project_data);*/

      //look up the custom field config object
      //pass this and the data to the popup
      $http.get(cfc_uri).then(function(response){
           //console.log(response.data.project_data_fields);
           //map these to project_data before adding to popup
           //example on the dataoverview template page when initialising popups there
            //$scope.popup_data = angular.copy(response.data);
            $scope.popup_data = {};
            $scope.popup_data['main_cfc'] = response.data;
            $scope.popup_data['main_data'] = {};
            $scope.popup_data.main_data['project_data'] = project_data;

            $scope.modalInstance = $modal.open({
              templateUrl: 'views/modal-template.html',
              size: 'lg',
              resolve: {
                popup_data: function () {
                  return $scope.popup_data;
                },

              }, 
              controller: function($scope, $modalInstance, popup_data, $timeout) {
                $scope.popup_data = popup_data;
                
                $scope.modalInstance = $modalInstance;

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };

              }
            });
       });

    }

    $scope.isHighlightPresent = function(highlights, level){
      //for this highlight set, is there a highlight present for this level?
      
      angular.forEach(highlights, function(val, key){
        /*console.log('val', val);
        console.log('key', key);*/
        if(key.indexOf(level) == 0){
          return val;
        }
      });
      return false;
    }



  }]);
