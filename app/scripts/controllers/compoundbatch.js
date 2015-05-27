'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$state','$stateParams','$timeout','CBHCompoundBatch', 'paramsAndForm', 'urlConfig', 
    function ($scope, $rootScope,$state, $stateParams,$timeout,  CBHCompoundBatch, paramsAndForm, urlConfig) {
    $scope.compoundBatches = {data:[]};
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
    $scope.compoundBatchesPerPage = 10; // this should match however many results your API puts on one page
    if(angular.isDefined($stateParams.compoundBatchesPerPage)){
       $scope.compoundBatchesPerPage = $stateParams.compoundBatchesPerPage;    
    }
    $scope.pagination = {
        current: 1
    };
    if(angular.isDefined($stateParams.page)){
       $scope.pagination.current = $stateParams.page;    
    }
    
    var filters = { };

    var multiple_batch_id = $stateParams.multiple_batch_id;
    $scope.baseDownloadUrl = paramsAndForm.paramsUrl;
    //..

    
    filters = paramsAndForm.params;
      


    $scope.pageChanged = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.compoundBatchesPerPage;
        $state.go($state.current.name,newParams);
    };
    $scope.pageChanged2 = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.compoundBatchesPerPage;
        $state.go($state.current.name,newParams);
    };
    var childScope;

    
    function getResultsPage(pageNumber) {

        filters.limit = $scope.compoundBatchesPerPage;
        filters.offset = (pageNumber -1) * $scope.compoundBatchesPerPage;
        CBHCompoundBatch.query(filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            $scope.compoundBatches.data =result.objects;
            CBHCompoundBatch.getImages( result.objects); 
       });        
    }
    getResultsPage($scope.pagination.current);

  }]);
