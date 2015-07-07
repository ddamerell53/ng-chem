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
    'searchUrlParams',
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
        renderers,
        searchUrlParams) {

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
        $scope.toggleDataSummary = {
            showFlag: true,
        }
        $scope.topLink = function() {
            $state.go("cbh.projects.list.project", {
                "projectKey": projectKey
            });
        }

        $scope.setLoadingMessageHeight = function(){
            var scrollTop = $(window).scrollTop();
            $("#loading-message").css("top", (scrollTop +200) + "px")
        }
        $scope.saveTemporaryCompoundData = function(){
            $scope.setLoadingMessageHeight();
            $scope.currentlyLoading = true;

            CBHCompoundBatch.saveMultiBatchMolecules($scope.datasets[$scope.current_dataset_id].config).then(
                    function(data){
                        $state.transitionTo("cbh.search", 
                                        {multiple_batch_id: $scope.datasets[$scope.current_dataset_id].config.multipleBatch, 
                            projectFrom: projectKey},
                            { location: true, 
                                            inherit: false, 
                                            relative: null, 
                                            notify: true }
                                        );

                    }
                ).error(function(error){
                    $scope.currentlyLoading = false;
                })       
        }

        $scope.cbh.saveChangesToTemporaryDataInController = function(changes, sourceOfChange){

            if(changes){
                // $scope.currentlyLoading = true;
                 $scope.disableButtons = true;
                    var itemsToChange = changes.map(function(item){
                        return $scope.compoundBatches.data[item[0]]
                    });
                    var patchData = angular.copy($scope.datasets[$scope.current_dataset_id].config);
                    patchData.objects = itemsToChange;
                    CBHCompoundBatch.patchTempList(patchData).then(function(data){
                        // $scope.currentlyLoading = false;
                        $scope.imageCallback();
                    });
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

 
        $scope.cbh.setMappedFieldInController = function(newFieldName, unCuratedFieldName){
            if(newFieldName == "SMILES for chemical structures"){

                $scope.datasets[$scope.current_dataset_id].config.struc_col = unCuratedFieldName;
                $scope.createMultiBatch();
            }else{
                
                $scope.datasets[$scope.current_dataset_id].config.headers = $scope.compoundBatches.uncuratedHeaders;
                CBHCompoundBatch.saveBatchCustomFields($scope.datasets[$scope.current_dataset_id].config)
            }

        };

        $scope.cancelFile = function(field) {
            var newParams = { projectKey: $stateParams.projectKey };
            if($scope.datasets[$scope.current_dataset_id].config.multipleBatch){
                CBHCompoundBatch.delete_index($scope.datasets[$scope.current_dataset_id].config);
            }
            $scope.setNull();
            $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: false, 
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
            $scope.inputData = {inputstring : ""};
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
                excluded: [],
                redraw: 0,
                columns: []};
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
        $scope.cbh.file_extension = "";
        $scope.cbh.addSort =  function(sortColumn, order){
                var index=0
                var toPop = [];
                angular.forEach($scope.compoundBatches.sorts, function(sort){
                    if(angular.isDefined(sort[sortColumn])){
                        toPop.push(angular.copy(index));
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
            $scope.cbh.file_extension = ext;
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
            $scope.setLoadingMessageHeight();
            $scope.currentlyLoading = true;

            CBHCompoundBatch.createMultiBatch(
                $scope.datasets[$scope.current_dataset_id]).then(
                    function(data){
                        $scope.currentlyLoading = false;
                        $scope.filesInProcessing = false;
                        $scope.datasets[$scope.current_dataset_id].config = data.data;
                        $scope.dataReady = true;
                        $scope.compoundBatches.uncuratedHeaders = data.data.headers;
                        CBHCompoundBatch.getImages( data.data.objects, 75, "imageSrc"); 
                        CBHCompoundBatch.getImages( data.data.objects, 400, "bigImageSrc", $scope.imageCallback); 

                        $scope.compoundBatches.data =data.data.objects;
                        $scope.totalCompoundBatches = data.data.batchstats.total;

                        //setup of uiselect for custom fields filtering
                        /*$scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
                        console.log($scope.searchFormSchema);
                        var pf = searchUrlParams.setup($stateParams, {molecule: {}});
                        $scope.searchForm = angular.copy(pf.searchForm);
                        var custFieldFormItem = $filter('filter')($scope.searchFormSchema.cf_form, {key:'search_custom_fields__kv_any'}, true);
                        custFieldFormItem[0].options.async.call = $scope.refreshCustFields;

                        if($scope.searchForm.search_custom_fields__kv_any) {
                            $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
                        }*/

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
                        if($scope.datasets[$scope.current_dataset_id].config.type == "file"){
                            $scope.datasets[$scope.current_dataset_id].config.errors = [MessageFactory.getMessage("file_error")];
                        }
                        if($scope.datasets[$scope.current_dataset_id].config.type == "smilesdata"){
                            $scope.datasets[$scope.current_dataset_id].config.errors = [MessageFactory.getMessage("ids_not_processed")];
                        }
                        $scope.datasets[$scope.current_dataset_id].config.status = "add";
                        $scope.dataReady = false;
                        $scope.currentlyLoading = false;

             }); 
        }
        $scope.refreshCustFields = function(schema, options, search){
            return $http.get(options.async.url + "?custom__field__startswith=" + search + "&custom_field=" + options.custom_field);
        }
       
        $scope.processSmilesData = function(){
            $scope.current_dataset_id = $scope.inputData.inputstring;
            var conf =   {
                    "multipleBatch": null,
                    "smilesdata" : $scope.inputData.inputstring,
                    "type": "smilesdata",
                    "projectKey" : projectKey,
                    "struc_col" : "",
                    "state" : "validate"};
             $scope.datasets[$scope.current_dataset_id] = {
                "config": conf,
                "cancellers" : []
            };
             $scope.createMultiBatch();
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
        // if($stateParams.doScroll){
        //     $location.hash('search-bottom');
        //     $anchorScroll();
        // }
        $scope.compoundBatches.redraw ++;
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
            if($scope.warningsFilter == "warnings.withstructure"){
;                filter.bool.must_not.push({"term": {"warnings.withoutstructure": "true"}});
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
                $scope.cbh.file_extension = result.data.fileExtension;
                $scope.totalCompoundBatches = result.data.meta.totalCount;
                $scope.compoundBatches.data =result.data.objects;
                $scope.compoundBatches.uncuratedHeaders = result.data.headers;

                $scope.current_dataset_id = $stateParams.mb_id;
                $scope.datasets[$scope.current_dataset_id] = {
                    "config": result.data,
                    "cancellers" : []
                }
                $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
                var pf = searchUrlParams.setup($stateParams, {molecule: {}});
                $scope.searchForm = angular.copy(pf.searchForm);
                var custFieldFormItem = $filter('filter')($scope.searchFormSchema.cf_form, {key:'search_custom_fields__kv_any'}, true);
                custFieldFormItem[0].options.async.call = $scope.refreshCustFields;

                /*if($scope.searchForm.search_custom_fields__kv_any) {
                    $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
                }*/
             $scope.dataReady = true;

                if(result.data.objects.length > 0){
                    var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                    CBHCompoundBatch.getImages( result.data.objects, size, "imageSrc"); 
                    CBHCompoundBatch.getImages(result.data.objects, 400, "bigImageSrc", $scope.imageCallback);

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