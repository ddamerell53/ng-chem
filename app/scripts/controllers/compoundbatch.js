'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$compile','$stateParams','$timeout','$state','CBHCompoundBatch', 'paramsAndForm', function ($scope, $rootScope,$compile, $state,$stateParams,$timeout, CBHCompoundBatch, paramsAndForm) {
    $scope.compoundBatches = {data:[]};
    $scope.totalCompoundBatches = 0;
    $scope.compoundBatchesPerPage = 3; // this should match however many results your API puts on one page

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
        console.log("test");
        getResultsPage(newPage);
    };
    var childScope;

    
    function getResultsPage(pageNumber) {

        filters.limit = $scope.compoundBatchesPerPage;
        filters.offset = (pageNumber -1) * $scope.compoundBatchesPerPage;
        CBHCompoundBatch.query(filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            console.log(result);
            $scope.compoundBatches.data =result.objects;

            CBHCompoundBatch.getImages( result.objects).then(
                function(){
                    console.log(result);
                }
                );
            
            
            // $rootScope.redrawCompounds();
        });        
    }
    getResultsPage(1);

  }]);
