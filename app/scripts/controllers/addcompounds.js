'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:AddCompoundsCtrl
 * @description
 * # AddcompoundsCtrl
 * This controller is used to manage adding items to the system. It provides methods for the addition single page app and manages the flow of file upload, checking chemical data, storing temporary compound data (for editing via the system before final registration), sorting and filtering file content previews, reporting errors and warnings and submitting data to the server.
 * Controller of the chembiohubAssayApp
 * This Controller is responsible for adding compound batches to the system in the bulk upload
 */
angular.module('chembiohubAssayApp')
  .controller('AddCompoundsCtrl',['$scope', 
    '$state', 
    '$stateParams', 
    '$cookies', 
    '$timeout', 
    '$location',
    '$filter',
    'project_key', 
    'prefix', 
    'urlConfig', 
    'CBHCompoundBatch', 
    'MessageFactory',
    'renderers',
    'searchUrlParams',
    '$modal',
    'skinConfig',
    'csrftoken',
    function ($scope, 
        $state, 
        $stateParams,
        $cookies, 
        $timeout,
        $location, 
        $filter,
        project_key, 
        prefix, 
        urlConfig, 
        CBHCompoundBatch,
        MessageFactory,
        renderers,
        searchUrlParams,
        $modal,
        skinConfig,
        csrftoken
        ) {
        $scope.skinConfig = skinConfig.objects[0];

        $scope.csrftoken = csrftoken;
       
        //build an object to hold all of the changed information each time the user does something
        $scope.projects = $scope.cbh.projects.objects;
                      angular.forEach($scope.projects, function(proj) {
                        if(proj.project_key == project_key) {
                          $scope.proj = proj;
                        }
                      });

        $scope.flowinit = {
                target: $scope.proj.flowjs_upload_url,
                headers: {
                    'X-CSRFToken': $scope.csrftoken
                },
                generateUniqueIdentifier: function (file) {
                    return file.name + "-" + file.size + "-" + Date.now();
                }
        };

        $scope.toggleDataSummary = {
            showFlag: true,
        }
                $scope.cbh.appName = "ChemiReg";

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.setLoadingMessageHeight
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         * Set the position on the page of the loading message (ensuring it is always 200px from the top no matter where the user has scrolled to)
         *
         */
        $scope.setLoadingMessageHeight = function(){
            var scrollTop = $(window).scrollTop();
            $("#loading-message").css("top", (scrollTop +200) + "px")
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.saveTemporaryCompoundData
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         * Save all of the previewed compound batches and redirect the user to the search page
         *
         */
        $scope.saveTemporaryCompoundData = function(){
            $scope.setLoadingMessageHeight();
            $scope.currentlyLoading = true;
            $scope.cbh.justAdded = true;
            var postData = {
                "multiplebatch" : $scope.datasets[$scope.current_dataset_id].config.multiplebatch,
                "task_id_for_save" : $scope.datasets[$scope.current_dataset_id].config.task_id_for_save
            }
            CBHCompoundBatch.saveMultiBatchMolecules($scope.datasets[$scope.current_dataset_id].config).then(
                    function(data){
                        if(data.status == 202){
                            //not yet saved properly
                            $scope.datasets[$scope.current_dataset_id].config.task_id_for_save = data.data.task_id_for_save;
                            $scope.saveTemporaryCompoundData();
                        }else if(data.status == 201){
                            $state.transitionTo("cbh.searchv2", 
                                        {encoded_query: $filter("encodeParamForSearch")({"field_path": "multiple_batch_id", "value": $scope.datasets[$scope.current_dataset_id].config.multiplebatch + ""}), 
                             pids : [$scope.proj.id]},
                            { location: true, 
                                            inherit: false, 
                                            relative: null, 
                                            notify: true }
                                        );
                        }
                        

                    }, function(error){
                        $scope.currentlyLoading = false;
                    }
                )       
        }
        $scope.cbh.statename = $state.current.name;

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cbh.saveChangesToTemporaryDataInController
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         * This function is called by the handsontable directive in order to save actions when a user fills down.
         * @param {array} changes List of objects representing an individual change which has been applied in edit mode
         * @param {array} sourceOfChange Not currently used. Supplied from a handsontable hook.
         *
         */
        $scope.cbh.saveChangesToTemporaryDataInController = function(changes, sourceOfChange){

            if(changes && changes.length > 0){
                // $scope.currentlyLoading = true;
                $scope.disableButtons = true;
                var itemsToChange = changes.map(function(item){
                    return $scope.compoundBatches.data[item[0]]
                });
                var patchData = angular.copy($scope.datasets[$scope.current_dataset_id].config);
                patchData.objects = itemsToChange;
                //TODO handle error here
                CBHCompoundBatch.patchTempList(patchData).then(function(data){
                    // $scope.currentlyLoading = false;
                    // $scope.imageCallback();
                    $scope.compoundBatches.savestats = data.data.savestats;
                });
            }
           

        }


       /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cbh.toggleWarningsFilter 
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @param {string} filterName the name of the filter
         * @description
         * Filter the previewed data based on whether it has a certain warning against it, changing the url without reloading
         * @param {string} filterName  the name of the filter which may have warnings
         *
         */
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


       /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cbh.openStatusExplanation 
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         * Open a modal to explain how the statuses work against a particular uploaded molecule
         *
         */
        $scope.cbh.openStatusExplanation = function(){
          $scope.modalInstance = $modal.open({
            templateUrl: 'views/statuses.html',
            size: 'md',
            controller: function($scope, $modalInstance, MessageFactory) {
              $scope.modalInstance = $modalInstance;
              $scope.legends = MessageFactory.getStatuses();
              $scope.actions = MessageFactory.getUploadActions();
            }
          });
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cbh.setMappedFieldInController 
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  Function is called when the user maps a particular field in the check boxes in the field mapping modal
         *  Column data is re-saved to the back end
         * @param {string} newFieldName name of the existing field which is having another field mapped to it
         * @param {string} unCuratedFieldName name of the field to be mapped to an existing field
         *
         */
        $scope.cbh.setMappedFieldInController = function(newFieldName, unCuratedFieldName){
            $scope.datasets[$scope.current_dataset_id].config.headers = $scope.compoundBatches.uncuratedHeaders;
            if ($scope.datasets[$scope.current_dataset_id].config.struccol == unCuratedFieldName && newFieldName== "SMILES for chemical structures"){
                //Reset the field name in this case
                $scope.datasets[$scope.current_dataset_id].config.struccol = "";
                $scope.createMultiBatch();
            }
            else if(newFieldName == "SMILES for chemical structures"){
                $scope.datasets[$scope.current_dataset_id].config.struccol = unCuratedFieldName;
                $scope.createMultiBatch();
            }
            else{
                
                CBHCompoundBatch.saveBatchCustomFields($scope.datasets[$scope.current_dataset_id].config)
            }

        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cancelFile
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  Cancel the current file and delete the dataset on the back end (although the file record itself is not removed)
         * @param {string} field Not used - should be removed
         *
         */
        $scope.cancelFile = function(field) {
            var newParams = { project_key: $stateParams.project_key };
            if($scope.datasets[$scope.current_dataset_id].config.multiplebatch){
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


        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.setNull
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  reset the dataset id and rebuild the scope
         *
         */
        $scope.setNull = function(){
            $scope.current_dataset_id = "none";
            $scope.setup();
        }



        /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.changeView
             * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
             * @description
             * Change to the gallery view. Not used
             * @deprecated 
             *
            */
        $scope.changeView = function(){
                $stateParams.viewType = $scope.listOrGallery.choice;
                $state.params.viewType = $scope.listOrGallery.choice;
                $location.search($state.params);
            }


        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.setup
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  reset the scope of the addcompounds page
         *
        */
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
            if ($stateParams.viewType) {
                    $scope.listOrGallery.choice = $stateParams.viewType;
                }

             $scope.listPerPage = [
                    { label: "10/page", value: "10" },
                    { label: "20/page", value: "20" },
                    { label: "50/page", value: "50" },
                    { label: "100/page", value: "100" },

            ];

            $scope.compoundBatches = {data:[], 
                sorts:[],
                excluded: [],
                redraw: 0,
                columns: []};

            $scope.itemsPerPage = angular.copy($scope.listPerPage);
            $scope.pagination = {
                    current: 1,
                    compoundBatchesPerPage: $scope.itemsPerPage[2],
                };
            
            var filters = { };
            

        }


        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.nullSorts
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  remove the sorts on the add compounds preview
         *
        */
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
        $scope.cbh.fileextension = "";



        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.cbh.addSort
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  Add a sort to the compound preview page
         * @param {string} sortColumn The key of the column to add the sort on
         * @param {string} order The sort direction
         *
        */
        $scope.cbh.addSort =  function(sortColumn, order){
           
            var i = $scope.compoundBatches.sorts.length;
            var toggeldOff = false;
            while (i--) {
                if(angular.isDefined($scope.compoundBatches.sorts[i][sortColumn])){
                    if($scope.compoundBatches.sorts[i][sortColumn].order == order){
                        var toggeldOff = true;
                    }
                    $scope.compoundBatches.sorts.pop(i);
                }
            }
             
            var dirObj = {};
            if(!toggeldOff){
                 dirObj[sortColumn] = {
                    "order": order, 
                    "missing" : "_last", 
                    "unmapped_type" : "string"
                };
                $scope.compoundBatches.sorts.unshift(dirObj);
            }
             var newParams = angular.copy($stateParams);
            
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





        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.assignFile
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  The assignFile function is called on completion of an upload by flowjs.
         *  The chembiohub backend provides a flowfile identifier
         * This is added to a configuration object and set back again to the backend via the createMultipleBatch function
         * @param {string} id  Current dataset id
         * @param {string} ext File extension to use
         * @param {object} file FlowFile object
        */
        $scope.assignFile = function(id, ext, file) {

            $scope.current_dataset_id = id;
            $scope.cbh.fileextension = ext;
            var conf =  {
                    "file_name": id,
                    "multiplebatch": null,
                    "type": "file",
                    "fileextension" : ext,
                    "project_key" : project_key,
                    "struccol" : "",
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
            $timeout($scope.createMultiBatch,1000);
        };
            
        $scope.sketchMolfile={"molecule":{}};
                $scope.molecule={"molfile":""};



        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.createMultiBatch
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  Sends the information about an uploaded file back to the backend in order to create a multiple batch object and to index the data from the file
         * into elasticsearch. Once the data has been indexed then we change the URL to include the multiple batch ID that the user has just created
         * This will enable the user to reload the page and to see the same data
         * The initial request from the back end will bring back a list of the first page of items
        */
        $scope.createMultiBatch = function(){
            $scope.setLoadingMessageHeight();
            $scope.currentlyLoading = true;
            $timeout(function(){ $scope.setLoadingMessageHeight();});
            CBHCompoundBatch.createMultiBatch(
                $scope.datasets[$scope.current_dataset_id]).then(
                    function(data){
                        // $scope.currentlyLoading = false;
                        // $scope.filesInProcessing = false;
                        $scope.datasets[$scope.current_dataset_id].config = data.data;
                        // $scope.dataReady = true;
                        // $scope.compoundBatches.uncuratedHeaders = data.data.headers;
                       

                        // $scope.imageCallback();
                        // $scope.compoundBatches.data =data.data.objects;
                        // $scope.compoundBatches.savestats = data.data.savestats;
                        // $scope.totalCompoundBatches = data.data.batchstats.total;


                        //Here we change the URL without changing the state
                        var newParams =  {"mb_id" : $scope.datasets[$scope.current_dataset_id].config.multiplebatch,
                                "project_key": $stateParams.project_key}
                         $state.transitionTo($state.current.name, 
                                             newParams, 
                                            { location: true, 
                                                inherit: false, 
                                                relative: $state.$current, 
                                                notify: false });
                         $stateParams = newParams;
                         $scope.initialise();
                        // $stateParams.mb_id = $scope.datasets[$scope.current_dataset_id].config.multiplebatch;

                        //returns a multiple batch id and a status
                        //Run a second get request to get a list of compounds
                    },
                    function(error){
                        if($scope.datasets[$scope.current_dataset_id].config.type == "file"){
                            var mess = MessageFactory.getMessage(error.data.error);
                            if (angular.isDefined(mess) && mess !== ""){
                                $scope.datasets[$scope.current_dataset_id].config.errors = [mess];
                            }
                            else{
                                $scope.datasets[$scope.current_dataset_id].config.errors = [MessageFactory.getMessage("file_error")];
                            }
                            if($scope.skinConfig.file_errors_from_backend){
                                $scope.datasets[$scope.current_dataset_id].config.errors[0] = error.data.error;

                            }
                        }
                        if($scope.datasets[$scope.current_dataset_id].config.type == "smilesdata"){
                            $scope.datasets[$scope.current_dataset_id].config.errors = [MessageFactory.getMessage("ids_not_processed")];
                        }
                        $scope.datasets[$scope.current_dataset_id].config.status = "add";
                        $scope.dataReady = false;
                        $scope.currentlyLoading = false;

             }); 
        }



        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.processSmilesData
         * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
         * @description
         *  Process the list of SMILES identifiers from the text box when the user presses the appropriate button
        */
        $scope.processSmilesData = function(){
            $scope.current_dataset_id = $scope.inputData.inputstring;
            var conf =   {
                    "multiplebatch": null,
                    "smilesdata" : $scope.inputData.inputstring,
                    "type": "smilesdata",
                    "project_key" : project_key,
                    "struccol" : "",
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




    /**
     * @ngdoc method
     * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.initialise
     * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
     * @description
     *  Tidy up and re-initialise the parts of the scope that rely on the data preview without cancelling the file
    */
    $scope.initialise = function(){
        if($stateParams.viewType) {
                $scope.listOrGallery.choice = $stateParams.viewType;
            }
          if($stateParams.mb_id) {
                $scope.current_dataset_id = $stateParams.mb_id;
                $scope.datasets[$scope.current_dataset_id] = {multiplebatch : $scope.current_dataset_id}
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
                $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
               }
            }
            else {
                $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
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
    $scope.cbh.includedProjectKeys = [$scope.proj.project_key];
          



    /**
     * @ngdoc method
     * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.changeNumberPerPage
     * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
     * @description
     *  Change the number of results shown per page in the compound preview
     * @param {string} viewType Whether this is list or gallery view 
    */
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


    /**
     * @ngdoc method
     * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.pageChanged
     * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
     * @description
     *  Paginate through the table view in the addcompounds preview
     * @param {integer} newPage page number of page to use
    */
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



    var childScope;


    /**
     * @ngdoc method
     * @name chembiohubAssayApp.controller:AddCompoundsCtrl#$scope.imageCallback
     * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
     * @description
     *  Tell the table view to update after the new data has been loaded
     * (we don't user two way data binding with handsontable for performance reasons and because in our other use case we want to keep a copy of the data in order to undo)
    */
    $scope.imageCallback = function() {
        

        $timeout(function(){
                    $scope.compoundBatches.redraw ++;

        });
    }

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.controller:AddCompoundsCtrl#getResultsPage
     * @methodOf chembiohubAssayApp.controller:AddCompoundsCtrl
     * @description
     *  Get a page compound preview of results from the back end
     * @param {integer} pageNumber The page of results to use (after factoring in offset)
    */
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
                filter.bool.must_not.push({"term": {"warnings.parseerror": "true"}});
            }else{
                var term = {"term": {}};

                term["term"][field] = filterBy;
                filter.bool.must.push(term);
            }
            
        }else{
            //TODO handle
        }

        $scope.compoundBatches.data = [];
        
        //TODO handle error here
        CBHCompoundBatch.getAddCompoundsResults($stateParams.mb_id, 
            limit, 
            offset, 
            filter, 
            $stateParams.sorts).then(function(result){
                $scope.cbh.fileextension = result.data.fileextension;
                $scope.totalCompoundBatches = result.data.meta.totalCount;
                $scope.compoundBatches.data =result.data.objects;
                $scope.compoundBatches.uncuratedHeaders = result.data.headers;
                $scope.compoundBatches.savestats = result.data.savestats;
                $scope.current_dataset_id = $stateParams.mb_id;
                $scope.datasets[$scope.current_dataset_id] = {
                    "config": result.data,
                    "cancellers" : []
                }
                $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
                var pf = searchUrlParams.setup($stateParams, {molecule: {}});
                $scope.searchForm = false; //angular.copy(pf.searchForm);

             $scope.dataReady = true;
             $scope.currentlyLoading = false;
            $scope.filesInProcessing = false;

                if(result.data.objects.length > 0){
                    var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;

                    $scope.imageCallback();

                }else if( ( $scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > $scope.totalCompoundBatches){
                    if($scope.pagination.current != 1){
                        $scope.pageChanged(1);
                    }
                    
                }
                else{
                    if($state.current.name==="cbh.search" || $state.current.name==="cbh.searchv2"){
                        $scope.noData = "No Compounds Found. Why not try amending your search?";
                    }else{
                         $scope.noData = "No Compounds Found. To add compounds use the link above.";
                    }
                }
                        
            
       }, function(error){
          if(error.status == 409){
            $timeout(function(){
                getResultsPage(pageNumber);
            }, 500);
          };
       });    

       
    }


        $scope.initialise();



  }]);