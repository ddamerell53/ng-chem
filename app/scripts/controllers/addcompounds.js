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
    'renderers',
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
        MessageFactory,
        renderers) {

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

        $scope.saveTemporaryCompoundData = function(){
            console.log($scope.datasets[$scope.current_dataset_id].config);
            CBHCompoundBatch.saveMultiBatchMolecules($scope.datasets[$scope.current_dataset_id].config).then(
                    function(data){
                        $state.go("cbh.search",{multiple_batch_id: $scope.datasets[$scope.current_dataset_id].config.multipleBatch, 
                            projectKey: projectKey});
                    }
                );        
        }

        $scope.cbh.saveChangesToTemporaryDataInController = function(changes, sourceOfChange){
            if(changes){
                 $scope.disableButtons = true;
                    var itemsToChange = changes.map(function(item){
                        return $scope.compoundBatches.data[item[0]]
                    });
                    var patchData = angular.copy($scope.datasets[$scope.current_dataset_id].config);
                    patchData.objects = itemsToChange;
                    CBHCompoundBatch.patchTempList(patchData);
            }
           

        }





        $scope.cbh.toggleWarningsFilter = function(filterName){
            

            var wf = filterName;
            if ($scope.warningsFilter == filterName){
                wf = '';
            }
             var newParams = angular.copy($stateParams);
            newParams.page = 1;
            newParams.warningsFilter = wf;
            $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: $state.$current, 
                                            notify: false });
            $stateParams = newParams;
            $scope.initialise();
        }

        $scope.undoDataMapping = function(){
            var newParams = { projectKey: $stateParams.projectKey, mb_id: $scope.undoDataMappingId };
            $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: $state.$current, 
                                            notify: true });
        }

        $scope.cbh.setMappedFieldInController = function(newFieldName, unCuratedFieldName){
            console.log("got")
            if(newFieldName == "SMILES for chemical structures"){
                $scope.datasets[$scope.current_dataset_id].config.struc_col = unCuratedFieldName;
                $scope.undoDataMappingId = angular.copy($scope.datasets[$scope.current_dataset_id].config.multipleBatch);
                $scope.createMultiBatch();
            }else{
                
                $scope.datasets[$scope.current_dataset_id].config.headers = $scope.compoundBatches.uncuratedHeaders;
                CBHCompoundBatch.saveBatchCustomFields($scope.datasets[$scope.current_dataset_id].config)
            }

        };

        $scope.cancelFile = function(field) {
            var newParams = { projectKey: $stateParams.projectKey }
            $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: $state.$current, 
                                            notify: true });
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
            $scope.setup();
        }

        $scope.setup = function(){

            $scope.filedata = {};
            $scope.filesUploading = false;
            $scope.dataReady = false;
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

            $scope.compoundBatches = {data:[], 
                sorts:[],
                excluded: []};
            $scope.itemsPerPage = angular.copy($scope.listPerPage);
            $scope.pagination = {
                    current: 1,
                    compoundBatchesPerPage: $scope.itemsPerPage[0],
                };
            
            var filters = { };
            

        }
        $scope.nullSorts = function(){
            $scope.compoundBatches.sorts =[];
             var newParams = angular.copy($stateParams);
            newParams.page = 1;
            newParams.sorts = undefined;
            $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: $state.$current, 
                                            notify: false });
            $stateParams = newParams;
            $scope.initialise();
        }

        $scope.cbh.renderFilterLink = renderers.renderFilterLink;
        $scope.cbh.addSort =  function(sortColumn){
                var index=0
                var order = "asc";
                var toPop = [];
                angular.forEach($scope.compoundBatches.sorts, function(sort){
                    if(angular.isDefined(sort[sortColumn])){
                        order = angular.copy(sort[sortColumn].order);
                        toPop.push(angular.copy(index));
                        if(order == "desc"){
                            //do nothing - remove from sort and let the compounds be recieved without a sort
                            order = "none";
                            console.log("test");
                        }
                        if(order == "asc"){
                            order = "desc";
                        }
                    }
                    index ++;
                });
                angular.forEach(toPop,function(p){
                    $scope.compoundBatches.sorts.pop(p);
                })
                var dirObj = {};
                if(order != "none"){
                     dirObj[sortColumn] = {"order": order, "missing" : "_last"};
                    $scope.compoundBatches.sorts.unshift(dirObj);
                }else{
                    console.log("test2");

                }
                 var newParams = angular.copy($stateParams);
                newParams.page = 1;
                if($scope.compoundBatches.sorts.length > 0){
                    newParams.sorts = JSON.stringify($scope.compoundBatches.sorts);
                }else{
                    newParams.sorts = undefined;
                }
                $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: $state.$current, 
                                            notify: false });
                $stateParams = newParams;
                $scope.initialise();
            };
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
            $timeout($scope.createMultiBatch,200);
        };
            
        $scope.sketchMolfile={"molecule":{}};
                $scope.molecule={"molfile":""};

        $scope.createMultiBatch = function(){

            CBHCompoundBatch.createMultiBatch(
                $scope.datasets[$scope.current_dataset_id]).then(
                    function(data){
                        $scope.filesInProcessing = false;
                        $scope.datasets[$scope.current_dataset_id].config = data.data;
                        $scope.dataReady = true;
                        $scope.compoundBatches.uncuratedHeaders = data.data.headers;
                        $scope.compoundBatches.excluded = data.data.excluded;
                        CBHCompoundBatch.getImages( data.data.objects, 75, "imageSrc", $scope.imageCallback); 
                        $scope.compoundBatches.data =data.data.objects;
                        $scope.totalCompoundBatches = data.data.batchStats.total;
                        //Here we change the URL without changing the state
                         $state.transitionTo ($state.current.name, 
                                {"mb_id" : $scope.datasets[$scope.current_dataset_id].config.multipleBatch,
                                "projectKey": $stateParams.projectKey}, 
                                { location: true, 
                                    inherit: false, 
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

//Make a function from all the scope setup items that need to change when the paging etc changes

    $scope.initialise = function(){
        if($stateParams.viewType) {
                $scope.listOrGallery.choice = $stateParams.viewType;
            }
          if($stateParams.mb_id) {
                $scope.current_dataset_id = $stateParams.mb_id;
                $scope.datasets[$scope.current_dataset_id] = {multipleBatch : $scope.current_dataset_id}
            }
          if($stateParams.warningsFilter) {
                $scope.warningsFilter = $stateParams.warningsFilter;
            }else{
                $scope.warningsFilter = "";

            }
            
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
             if (angular.isDefined($stateParams.sorts)){
                $scope.compoundBatches.sorts = JSON.parse($stateParams.sorts);
            }

             if (angular.isDefined($stateParams.mb_id)){
                getResultsPage($scope.pagination.current);
            }
            
        // getResultsPage($scope.pagination.current);


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
                                    inherit: false, 
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
                                    inherit: false, 
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

    
    var  getResultsPage = function(pageNumber) {
        var limit = $scope.pagination.compoundBatchesPerPage.value;
        var offset = (pageNumber -1) * $scope.pagination.compoundBatchesPerPage.value;
        var filter = {"bool" : {"must":[],
                                "should": [],
                                "must_not": []}};
        if($scope.warningsFilter != ""){
            var filterBy = "true";
            var field = $scope.warningsFilter;
            if($scope.warningsFilter.indexOf("properties") > -1){
                field = $scope.warningsFilter.split("|")[0];
                filterBy = $scope.warningsFilter.split("|")[1];
            }
            if($scope.warningsFilter == "warnings.withStructure"){
;                filter.bool.must_not.push({"term": {"warnings.withoutStructure": "true"}});
                filter.bool.must_not.push({"term": {"warnings.parseError": "true"}});
            }else{
                var term = {"term": {}};

                term["term"][field] = filterBy;
                filter.bool.must.push(term);
            }
            
        }else{
            console.log($scope.warningsFilter);
        }

        $scope.compoundBatches.data = [];
        
        CBHCompoundBatch.getSearchResults($stateParams.mb_id, 
            limit, 
            offset, 
            filter, 
            $stateParams.sorts).then(function(result){
                $scope.totalCompoundBatches = result.data.meta.totalCount;
                $scope.compoundBatches.data =result.data.objects;
                $scope.compoundBatches.uncuratedHeaders = result.data.headers;
                $scope.compoundBatches.excluded = result.data.excluded;

                $scope.current_dataset_id = $stateParams.mb_id;
                $scope.datasets[$scope.current_dataset_id] = {
                    "config": result.data,
                    "cancellers" : []
                }
             $scope.dataReady = true;

                if(result.data.objects.length > 0){
                    var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                    CBHCompoundBatch.getImages(result.data.objects, 400, "bigImageSrc");
                    CBHCompoundBatch.getImages( result.data.objects, size, "imageSrc", $scope.imageCallback); 

                }else if( ( $scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > $scope.totalCompoundBatches){
                    if($scope.pagination.current != 1){
                        $scope.pageChanged(1);
                    }
                    
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


        $scope.initialise();



  }]);