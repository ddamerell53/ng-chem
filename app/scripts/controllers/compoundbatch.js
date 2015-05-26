'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$stateParams','$state','CBHCompoundBatch', 'paramsAndForm', function ($scope, $state,$stateParams, CBHCompoundBatch, paramsAndForm) {
    $scope.compoundBatches = [];
    $scope.totalCompoundBatches = 0;
    $scope.compoundBatchesPerPage = 20; // this should match however many results your API puts on one page

    $scope.pagination = {
        current: 1
    };

    var filters = { };

    var multiple_batch_id = $stateParams.multiple_batch_id;
    //..

    if($state.name!=="cbh.search"){
        if(multiple_batch_id) {
            filters = { 'multiple_batch_id' : multiple_batch_id,
                      'project__project_key' : $stateParams.projectKey}
        }

        else if($scope.validatedData) {
            filters = { 'multiple_batch_id' : $scope.validatedData.currentBatch,
                            'project__project_key' : $stateParams.projectKey}
        }
        else{
            filters = {
                 'project__project_key' : $stateParams.projectKey
             }
        }
      }else{
            filters = paramsAndForm.params;
      }


    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        filters.limit = $scope.compoundBatchesPerPage;
        filters.offset = (pageNumber -1) * $scope.compoundBatchesPerPage;
        CBHCompoundBatch.query( filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            $scope.compoundBatches = result.objects;
        });        
    }
    getResultsPage(1);

  }]);
