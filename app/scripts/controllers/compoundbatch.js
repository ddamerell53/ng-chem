'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$state','$stateParams','$timeout','CBHCompoundBatch','paramsAndForm','urlConfig','$window','$location','$anchorScroll', '$filter', 'searchUrlParams', 
    function ($scope, $rootScope,$state, $stateParams,$timeout, CBHCompoundBatch, paramsAndForm, urlConfig, $window, $location, $anchorScroll, $filter, searchUrlParams) {
    $scope.compoundBatches = {data:[], redraw:0};
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
    
    $scope.listOrGallery = {
        choice: "list",
    };
    if($stateParams.viewType) {
        $scope.listOrGallery.choice = $stateParams.viewType;
    }
    var listPerPage = [
        { label: "10/page", value: "10" },
        { label: "20/page", value: "20" },
        { label: "50/page", value: "50" },
    ];

    var galleryPerPage = {
        largeScreen : [
            { label: "40/page", value: "40" },
            { label: "80/page", value: "80" },
            { label: "120/page", value: "120" },
        ],
        smallScreen: [
            { label: "30/page", value: "30" },
            { label: "60/page", value: "60" },
            { label: "90/page", value: "90" },
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
                $scope.itemsPerPage = angular.copy(galleryPerPage.largeScreen);

            }
            else {
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
    if(angular.isDefined($stateParams.compoundBatchesPerPage)){
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
        $scope.compoundBatches.redraw ++;

    }
    function getAllUncuratedHeaders(data) {
        //pull out and merge and uniquify all the uncurated fields
        var uncurated_headers = []
        angular.forEach(data, function(obj){
            //get this object's uncurated fields
            angular.forEach(obj.uncurated_fields, function(field) {
                uncurated_fields.push(field);
            });
        });
        return uncurated_headers;
    }

    $scope.refreshCustFields = function(schema, options, search){
            
            return $http.get(options.async.url + "?custom__field__startswith=" + search + "&custom_field=" + options.custom_field);
            //var resp = $http.get(options.async.url + "?custom__field__startswith=" + search + "&custom_field=" + options.custom_field);
        }
    $scope.typeahead = ["test"];

    $scope.refreshSingleCustField = function(searchTerm, customField){
        $http.get(options.async.url + "?custom__field__startswith=" + searchTerm + "&custom_field=" + customField).then(function(response){
            $scope.typeahead = response.data;
        });
    }

    $scope.broadcastFilter = function() {
        console.log("broadcastFilter called");
    }
    
    
    function getResultsPage(pageNumber) {
        filters.limit = $scope.pagination.compoundBatchesPerPage.value;
        filters.offset = (pageNumber -1) * $scope.pagination.compoundBatchesPerPage.value;
        CBHCompoundBatch.query(filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            $scope.compoundBatches.data =result.objects;

            $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
            var pf = searchUrlParams.setup($stateParams, {molecule: {}});
            $scope.searchForm = angular.copy(pf.searchForm);
            var custFieldFormItem = $filter('filter')($scope.searchFormSchema.cf_form, {key:'search_custom_fields__kv_any'}, true);
            custFieldFormItem[0].options.async.call = $scope.refreshCustFields;

            //$scope.compoundBatches.uncuratedHeaders = getAllUncuratedHeaders(result.objects);

            if(result.objects.length > 0){
                var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                CBHCompoundBatch.getImages(result.objects, 400, "bigImageSrc");
                CBHCompoundBatch.getImages( result.objects, size, "imageSrc", $scope.imageCallback); 

            }else if( ( $scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > $scope.totalCompoundBatches){
                $scope.pageChanged(1);
            }
            else{
                if($state.current.name==="cbh.search"){
                    $scope.noData = "No Compounds Found. Why not try amending your search?";
                }else{
                     $scope.noData = "No Compounds Found. To add compounds use the link above.";
                }
            }
            
       });        
    }
    getResultsPage($scope.pagination.current);


  }]);
