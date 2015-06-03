'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$state','$stateParams','$timeout','CBHCompoundBatch','paramsAndForm','urlConfig','$window','$location','$anchorScroll', '$filter', 
    function ($scope, $rootScope,$state, $stateParams,$timeout, CBHCompoundBatch, paramsAndForm, urlConfig, $window, $location, $anchorScroll, $filter) {
    $scope.compoundBatches = {data:[]};
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
    
    $scope.listOrGallery = {
        choice: "list",
    };
    if($stateParams.viewType) {
        $scope.listOrGallery.choice = $stateParams.viewType;
    }
    var listPerPage = [
        { label: "10/page", value: 10 },
        { label: "20/page", value: 20 },
        { label: "50/page", value: 50 },
    ];

    var galleryPerPage = {
        largeScreen : [
            { label: "40/page", value: 40 },
            { label: "80/page", value: 80 },
            { label: "120/page", value: 120 },
        ],
        smallScreen: [
            { label: "30/page", value: 30 },
            { label: "60/page", value: 60 },
            { label: "90/page", value: 90 },
        ],
    } 
    //initialise this as list first
    if(angular.isDefined($stateParams.viewType)) {
        if($stateParams.viewType == 'list') {
            $scope.itemsPerPage = angular.copy(listPerPage);
        }
        else if($stateParams.viewType == 'gallery'){
            
            var w = angular.element($window);
            if(w.width() > 1200) {
                console.log(galleryPerPage.largeScreen);
                $scope.itemsPerPage = angular.copy(galleryPerPage.largeScreen);
            }
            else {
                console.log("wide window");
                $scope.itemsPerPage = angular.copy(galleryPerPage.smallScreen);
            }
        }
    }
    else {
        $scope.itemsPerPage = angular.copy(listPerPage);
    }
    $scope.pagination = {
        current: 1,
        compoundBatchesPerPage: $scope.itemsPerPage[0],
    };
    //$scope.pagination.compoundBatchesPerPage = 10; // this should match however many results your API puts on one page
    if(angular.isDefined($stateParams.compoundBatchesPerPage)){
       //$scope.compoundBatchesPerPage = $stateParams.compoundBatchesPerPage;    
       var filtered = $filter("filter")($scope.itemsPerPage, $stateParams.compoundBatchesPerPage, true);
       if(filtered[0]) {
        $scope.pagination.compoundBatchesPerPage = filtered[0]; 
       }
       else {
        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
       }
    }
    else {
        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
    }
    if(angular.isDefined($stateParams.page)){
       $scope.pagination.current = $stateParams.page;    
    }
    
    var filters = { };

    var multiple_batch_id = $stateParams.multiple_batch_id;
    $scope.baseDownloadUrl = paramsAndForm.paramsUrl;
    //..

    
    filters = paramsAndForm.params;
      

    $scope.changeNumberPerPage = function(viewType) {
        var newParams = angular.copy($stateParams);
        newParams.page = 1;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.viewType = viewType;
        /*if(viewType == 'list') {         
            newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        }
        else {
            var w = angular.element($window);
            if(w.width() > 1200) {
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
            }
            else {
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
            }
        }*/
        
        newParams.doScroll = 'true';
        $state.go($state.current.name,newParams);
    };
    $scope.pageChanged = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.doScroll = 'true';
        $state.go($state.current.name,newParams);
    };
    $scope.pageChanged2 = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        $state.go($state.current.name,newParams);
    };
    var childScope;

    $scope.imageCallback = function() {
        

        // call $anchorScroll()
        if($stateParams.doScroll){
            $location.hash('search-bottom');
            $anchorScroll();
        }
    }

    
    function getResultsPage(pageNumber) {
        filters.limit = $scope.pagination.compoundBatchesPerPage.value;
        filters.offset = (pageNumber -1) * $scope.pagination.compoundBatchesPerPage.value;
        CBHCompoundBatch.query(filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            $scope.compoundBatches.data =result.objects;
            if(result.objects.length > 0){
                var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                CBHCompoundBatch.getImages(result.objects, 400, "bigImageSrc");
                CBHCompoundBatch.getImages( result.objects, size, "imageSrc", $scope.imageCallback); 

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
    /*$timeout(function() {
        $location.hash('search-bottom');

        // call $anchorScroll()
        if($stateParams.doScroll == true){
            $anchorScroll();
        }
    }, 500)*/

    


  }]);
