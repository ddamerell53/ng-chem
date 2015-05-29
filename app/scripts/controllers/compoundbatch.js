'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$state','$stateParams','$timeout','CBHCompoundBatch','paramsAndForm','urlConfig','$window','$location','$anchorScroll', 
    function ($scope, $rootScope,$state, $stateParams,$timeout, CBHCompoundBatch, paramsAndForm, urlConfig, $window, $location, $anchorScroll) {
    $scope.compoundBatches = {data:[]};
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
    //$scope.compoundBatchesPerPage = 10; // this should match however many results your API puts on one page
    if(angular.isDefined($stateParams.compoundBatchesPerPage)){
       $scope.compoundBatchesPerPage = $stateParams.compoundBatchesPerPage;    
    }
    else {
        $scope.compoundBatchesPerPage = 10;
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
      

    $scope.listOrGallery = {
        choice: "list",
    };
    if($stateParams.viewType) {
        $scope.listOrGallery.choice = $stateParams.viewType;
    }
    $scope.changeNumberPerPage = function(viewType) {
        var newParams = angular.copy($stateParams);
        newParams.page = 1;
        if(viewType == 'list') {
            newParams.compoundBatchesPerPage = 10;
        }
        else {
            var w = angular.element($window);
            if(w.width() > 1200) {
                newParams.compoundBatchesPerPage = 30;
            }
            else {
                newParams.compoundBatchesPerPage = 30;
            }
        }
        
        newParams.viewType = viewType;
        newParams.doScroll = 'true';
        $state.go($state.current.name,newParams);
    };
    $scope.pageChanged = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.compoundBatchesPerPage;
        newParams.doScroll = 'true';
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
            if(result.objects.length > 0){
                var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                CBHCompoundBatch.getImages(result.objects, 400, "bigImageSrc");
                CBHCompoundBatch.getImages( result.objects, size, "imageSrc"); 

            }else{
                if($state.current.name==="cbh.search"){
                    $scope.noData = "No Compounds Found. Why not try amending your search?";
                }else{
                     $scope.noData = "No Compounds Found. To add compounds use the link above.";
                }
            }
            
       });        
    }
    getResultsPage($scope.pagination.current);
    $timeout(function() {
        $location.hash('search-bottom');

        // call $anchorScroll()
        if($stateParams.doScroll == true){
            $anchorScroll();
        }
    }, 2000)
    


  }]);
