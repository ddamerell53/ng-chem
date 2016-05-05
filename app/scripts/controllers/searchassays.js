'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:SearchAssaysCtrl
 * @description
 * # SearchAssaysCtrl
 * Controller of the chembiohubAssayApp
 * not used
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .controller('SearchAssaysCtrl', ['$scope', '$filter', '$modal', 'urlConfig', '$stateParams', '$state','$location','userList', function ($scope, $filter, $modal, urlConfig, $stateParams, $state, $location, userList) {
    
  	//need to be able to pull in, via this controller or a service:

  	//user list;
  	//available projects (l0) which user has access to (l0_with_permission);
  	//studies available to the selected projects
  	//assays available to the selected studies

  	//and populate into scope models to be used in filters and aggregations on the page
        $scope.cbh.appName = "AssayReg";

    $scope.users = userList;
    $scope.userData = {useruris : []};
  	$scope.cbh.textsearch = $stateParams.textsearch;
    
$scope.$watch(
              function( $scope ) {
                        return $scope.cbh.textsearch;
               },
                function( newValue ) {
                      $stateParams.textsearch = newValue;
                      $state.params.textsearch = newValue;
                      $location.search('textsearch', newValue);

                    }
                );

    

   $scope.selections = {
      'l0': [],
      'l1': [],
      'l2': [],

    };




     //do we have any search params? 
    //for levels they will be URIs in the URL
    if ($stateParams.l0) {

      $scope.selections.l0 = decodeURIComponent($stateParams.l0).split(",");
    }
    if ($stateParams.l1) {
      $scope.selections.l1 = decodeURIComponent($stateParams.l1).split(",");
    }
    if ($stateParams.l2) {
      
      $scope.selections.l2 = decodeURIComponent($stateParams.l2).split(",");
    }
    if ($stateParams.useruris) {
      
      $scope.userData.useruris = decodeURIComponent($stateParams.useruris).split(",");

    }


    
   
    $scope.dates = {
      'start': '',
      'end': '',
      'startES': '',
      'endES': '',
    }



    $scope.modalInstance = {};
    $scope.popup_data = {};

    $scope.indexVMOnInit = [];

   
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
    $scope.$watch(
              function( $scope ) {
                        return $scope.selections.l0;
               },
                function( newValue , oldvalue) {
                      if (!arraysEqual(newValue , oldvalue)){
                        
                        $stateParams.l0 = newValue;
                        $state.params.l0 = newValue;
                        $location.search('l0', newValue.join());
                      }
                    }, true
                );
    $scope.$watch(
              function( $scope ) {
                        return $scope.selections.l1;
               },
                function( newValue , oldvalue) {
                      if (!arraysEqual(newValue , oldvalue)){
                        
                        $stateParams.l1 = newValue;
                        $state.params.l1 = newValue;
                        $location.search('l1', newValue.join());
                      }
                    }, true
                );
    $scope.$watch(
              function( $scope ) {
                        return $scope.selections.l2;
               },
                function( newValue , oldvalue) {
                      if (!arraysEqual(newValue , oldvalue)){
                        
                        $stateParams.l2 = newValue;
                        $state.params.l2 = newValue;
                        $location.search('l2', newValue.join());
                      }
                    }, true
                );

    $scope.$watch(
              function( $scope ) {
                        return $scope.userData.useruris;
               },
                function( newValue , oldvalue) {
                      if (!arraysEqual(newValue , oldvalue)){
                        
                        $stateParams.useruris = newValue;
                        $state.params.useruris = newValue;
                        $location.search('useruris', newValue.join());
                      }
                    }, true
                );


    
    $scope.searchFieldsCount = 0;
    $scope.advancedSearchFields = []
  	$scope.addCustomField = function() {
        var newItemNo = $scope.searchFieldsCount + 1;
        $scope.advancedSearchFields.push({
            'name': '',
            'value': '',
            'id': newItemNo,
            newItemNo: newItemNo,
        });
        $scope.searchFieldsCount++;
    };
    //$scope.filedata = {};
    $scope.removeCustomField = function(item) {

        //$scope.advancedSearchFields.pop(item);
        var index = $scope.advancedSearchFields.indexOf(item);
        $scope.advancedSearchFields.splice(index, 1); 


    };

  	$scope.selectedUris = function(level){
      //return the URIs of the selected items in the multiselect for the appropriate level
      var uris = []

      /*angular.forEach($scope.selections[level], function(lev) {
        var res_uri = lev._source[level].resource_uri;
        uris.push(res_uri);
      })*/
      return $scope.selections[level];

    };

    $scope.isSelectedInUrl = function(level, uri){
      angular.forEach($scope.selections[level], function(item){
        
        if(item == uri) {
          return true;
        }
      })
      return false;
    }

    $scope.clearSelections = function(level) {
      //remove any selections made in the appropriate level selector
      $scope.selections[level] = [];
    }

    $scope.clearUserSelections = function() {
      $scope.userData.useruris = [];
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
      $stateParams[startOrEnd] = oldDate;
      $state.params[startOrEnd] = oldDate;
      $location.search(startOrEnd, oldDate);

    }

    angular.forEach(['start', 'end'], function(startOrEnd){
      if($stateParams[startOrEnd]){
        $scope.dates[startOrEnd] = $stateParams[startOrEnd];
        $scope.dateHandler(startOrEnd);
      }
    });
    $scope.resetForm = function() {

      $state.go('cbh.search_assays',{
        'l0': undefined,
        'l1': undefined,
        'l2': undefined,
        'start': undefined,
        'textsearch': undefined,
        'end': undefined
      });

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

      //look up the custom field config object
      //pass this and the data to the popup
      $http.get(cfc_uri).then(function(response){
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
        if(key.indexOf(level) == 0){
          return val;
        }
      });
      return false;
    }



  }]);
