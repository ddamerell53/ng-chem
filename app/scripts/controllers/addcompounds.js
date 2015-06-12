'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddcompoundsCtrl
 * @description
 * # AddcompoundsCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('AddCompoundsCtrl',['$scope', 
    '$state', 
    '$stateParams', 
    '$cookies', 
    '$timeout', 
    '$location',
    '$filter',
    'projectKey', 
    'prefix', 
    'urlConfig', 
    'CBHCompoundBatch', 
    'MessageFactory',
    function ($scope, 
        $state, 
        $stateParams,
        $cookies, 
        $timeout,
        $location, 
        $filter,
        projectKey, 
        prefix, 
        urlConfig, 
        CBHCompoundBatch,
         MessageFactory) {

        $scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
       $scope.flowinit = {
                target: urlConfig.instance_path.url_frag + 'flow/upload/',
                headers: {
                    'X-CSRFToken': $scope.csrftoken
                }
            };
        //build an object to hold all of the changed information each time the user does something
        $scope.projects = $scope.cbh.projects.objects;
                      angular.forEach($scope.projects, function(proj) {
                        if(proj.project_key == projectKey) {
                          $scope.proj = proj;
                        }
                      });
        $scope.topLink = function() {
            $state.go("cbh.projects.list.project", {
                "projectKey": projectKey
            });
        }

        $scope.filterItems = function(reference){

        }

        $scope.cancelFile = function(field) {
            $scope.setNull();
        }
        $scope.datasets = {"none": {"config":{"state": "add",
                                                "new": 0,
                                                "blinded": 0,
                                                "total": 0,
                                                "overlaps": 0,
                                                "errors": 0,
                                                "field_errors": 0,
                                                "dupes": 0}}};

        $scope.setNull = function(){
            $scope.current_dataset_id = "none";
            $scope.filedata = {};
            $scope.filesUploading = false;
        }
        $scope.setNull();
        $scope.assignFile = function(id, ext, file) {
            $scope.current_dataset_id = id;
            var conf =  {
                    "file_name": id,
                    "multipleBatch": null,
                    "type": "file",
                    "file_extension" : ext,
                    "projectKey" : projectKey,
                    "struc_col" : "",
                    "state" : "validate"};

            if(["sdf", "xlsx", "cdx", "cdxml"].indexOf(ext) == -1){
                conf.errors = [MessageFactory.getMessage("file_format_error")];
                conf.status = "add";
                
            }else{
                $scope.filesInProcessing  = true;      
            }
            $scope.datasets[$scope.current_dataset_id] = {
                "config": conf,
                "cancellers" : []
            }
            $timeout($scope.createMultiBatch,100);
        };
            
           
        $scope.dataReady = false;
        
        $scope.createMultiBatch = function(){
            CBHCompoundBatch.createMultiBatch(
                $scope.datasets[$scope.current_dataset_id]).then(
                    function(data){
                        $scope.filesInProcessing = false;
                        $scope.datasets[$scope.current_dataset_id].config = data.data;
                        $scope.dataReady = true;
                        CBHCompoundBatch.getImages( data.data.objects, 75, "imageSrc", $scope.imageCallback); 
                        $scope.compoundBatches.data =data.data.objects;
                        $scope.totalCompoundBatches = data.data.batchStats.total;
                        //Here we change the URL without changing the state
                         $state.transitionTo ($state.current.name, 
                                {"mb_id" : $scope.datasets[$scope.current_dataset_id].config.multipleBatch}, 
                                { location: true, 
                                    inherit: true, 
                                    relative: $state.$current, 
                                    notify: false });
                        $stateParams.mb_id = $scope.datasets[$scope.current_dataset_id].config.multipleBatch;

                        //returns a multiple batch id and a status
                        //Run a second get request to get a list of compounds
                    },
                    function(error){
                        if($scope.datasets[$scope.current_dataset_id].config.type == file){
                            $scope.datasets[$scope.current_dataset_id].config.errors = [MessageFactory.getMessage("file_error")];
                        }
                        $scope.datasets[$scope.current_dataset_id].config.status = "add";
                        $scope.dataReady = false;
             }); 
        }

       




// Copied from

// the other controller

    $scope.stateName = $state.current.name;
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
$scope.listOrGallery = {
        choice: "list",
    };

 $scope.listPerPage = [
        { label: "10/page", value: "10" },
        { label: "20/page", value: "20" },
        { label: "50/page", value: "50" },
    ];

  $scope.compoundBatches = {data:[]};
      $scope.itemsPerPage = angular.copy($scope.listPerPage);

    $scope.pagination = {
        current: 1,
        compoundBatchesPerPage: $scope.itemsPerPage[2],
    };
    var filters = { };

   

//Make a function from all the scope setup items that need to change when the paging etc changes

    $scope.initialise = function(){
        if($stateParams.viewType) {
                $scope.listOrGallery.choice = $stateParams.viewType;
            }
          
          
            
            if(angular.isDefined($stateParams.compoundBatchesPerPage)){
               var filtered = $filter("filter")($scope.itemsPerPage, $stateParams.compoundBatchesPerPage, true);
               if(filtered[0]) {
                $scope.pagination.compoundBatchesPerPage = filtered[0]; 
               }
               else {
                $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
               }
            }
            else {
                $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
            }
            if(angular.isDefined($stateParams.page)){
               $scope.pagination.current = $stateParams.page;  
            }
             if (angular.isDefined($stateParams.mb_id)){
                getResultsPage($scope.pagination.current);
            }
        getResultsPage($scope.pagination.current);


    }   
    

          

    $scope.changeNumberPerPage = function(viewType) {
        var newParams = angular.copy($stateParams);
        newParams.page = 1;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.viewType = viewType;
        newParams.doScroll = 'true';
        $state.transitionTo($state.current.name, 
                                newParams,
                                { location: true, 
                                    inherit: true, 
                                    relative: $state.$current, 
                                    notify: false });
        $stateParams = newParams;
        $scope.initialise();
    };
    $scope.pageChanged = function(newPage) {
        var newParams = angular.copy($stateParams);
        newParams.page = newPage;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.doScroll = 'true';
        $state.transitionTo($state.current.name, 
                                newParams,
                                { location: true, 
                                    inherit: true, 
                                    relative: $state.$current, 
                                    notify: false });
        $stateParams = newParams;
        $scope.initialise();

    };
    $scope.pageChanged2 = function(newPage) {
        $scope.pageChanged();
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
       //  filters.limit = $scope.pagination.compoundBatchesPerPage.value;
       //  filters.offset = (pageNumber -1) * $scope.pagination.compoundBatchesPerPage.value;
       //  CBHCompoundBatch.query(filters).then(function(result) {
       //      $scope.totalCompoundBatches = result.meta.totalCount;
       //      $scope.compoundBatches.data =result.objects;
       //      if(result.objects.length > 0){
       //          var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
       //          CBHCompoundBatch.getImages(result.objects, 400, "bigImageSrc");
       //          CBHCompoundBatch.getImages( result.objects, size, "imageSrc", $scope.imageCallback); 

       //      }else if( ( $scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > $scope.totalCompoundBatches){
       //          $scope.pageChanged(1);
       //      }
       //      else{
       //          if($state.current.name==="cbh.search"){
       //              $scope.noData = "No Compounds Found. Why not try amending your search?";
       //          }else{
       //               $scope.noData = "No Compounds Found. To add compounds use the link above.";
       //          }
       //      }
            
       // });        
    }


        $scope.initialise();






















  }]);
