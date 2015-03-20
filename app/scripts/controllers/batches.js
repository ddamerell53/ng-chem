'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:BatchesCtrl
 * @description
 * # BatchesCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('BatchesCtrl',['$scope', '$modal', '$timeout', '$q', '$state', '$stateParams','$location', 'gridconfig', 'projectKey', function ($scope, $modal, $timeout, $q, $state, $stateParams, $location, gridconfig, projectKey) {
    var filters = { };
    if($scope.validatedData) {
      filters = {multiple_batch_id : $scope.validatedData.currentBatch }
    }

    //initialise from URL parameters - page size and filters

    $scope.projectKey = projectKey;
    $scope.gridconfig = gridconfig;

    
      if($state.params.offset && $state.params.limit) {
          $scope.gridconfig.configObject.pagingOptions.pageSize = ($state.params.limit || 20);
          $scope.gridconfig.configObject.pagingOptions.currentPage = parseInt($state.params.offset) / parseInt($state.params.limit);
        }
        else {
          $scope.gridconfig.configObject.pagingOptions.pageSize = 20;
          $scope.gridconfig.configObject.pagingOptions.currentPage = 1;
        }
        //empty the compounds?
        $scope.gridconfig.configObject.compounds = [];
        $scope.gridconfig.configObject.filters = filters;
        var projkey_frag = ($scope.projectKey) ? "project__project_key=" + $scope.projectKey + "&" : "" ;
        var batch_frag = ($scope.validatedData) ? "multiple_batch_id=" + filters.multiple_batch_id + "&" : "" ;
        $scope.gridconfig.configObject.paramsUrl = projkey_frag + batch_frag;
    

    
    
    
    
    
    //$scope.gridconfig.configObject.pagingOptions

    $timeout(function() {
        console.log(filters);
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
          //this.configObject.filters = coreFilters;
          $location.search('limit', newVal.pageSize).search('offset', parseInt(newVal.currentPage * newVal.pageSize)).replace();
          //$scope.$apply();
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

    $scope.exportSearch = function(format) {
      $scope.gridconfig.exportFullResults(format);
    }

  }]);
