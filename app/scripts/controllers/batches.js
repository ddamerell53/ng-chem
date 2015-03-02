'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:BatchesCtrl
 * @description
 * # BatchesCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
    .controller('BatchesCtrl',['$scope', '$modal', '$timeout', 'gridconfig', 'projectKey', function ($scope, $modal, $timeout, gridconfig, projectKey) {
    var filters = { };
    if($scope.validatedData) {
      filters = {multiple_batch_id : $scope.validatedData.currentBatch }
    }


    $scope.projectKey = projectKey;
    $scope.gridconfig = gridconfig;
    $timeout(function() {
        $scope.gridconfig.initializeGridParams(projectKey, filters).then(function(result) {
        $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
        $scope.gridconfig.configObject.compounds = result.objects;
      }, 200);
    });
    //watches the paging buttons to pull in new results for the window
    $scope.$watch('gridconfig.configObject.pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
        console.log('paging change');
        $scope.gridconfig.initializeGridParams(projectKey,filters).then(function(result) {
          $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
          $scope.gridconfig.configObject.compounds = result.objects;
        });
      }
    }, true);
    $scope.modalInstance = {};
    $scope.mol = {}; 

    $scope.openSingleMol = function(uox_id, batch_id) {
      angular.forEach($scope.gridconfig.configObject.compounds, function(item) {
        
        if (item.chemblId == uox_id) {
          //$scope.mol = item;
          if(item.multipleBatchId == batch_id) {
            $scope.mol = item;
          }

        }
      });
      console.log($scope.mol);
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/single-compound.html',
        size: 'lg',
        resolve: {
          mol: function () {
            return $scope.mol;
          }
        }, 
        controller: function($scope, $modalInstance, mol) {
          $scope.mol = mol;
          $scope.modalInstance = $modalInstance;
        }
      });
    };
  }]);
