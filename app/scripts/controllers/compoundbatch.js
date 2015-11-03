'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('CompoundbatchCtrl', ['$scope','$rootScope','$state','$stateParams','$timeout','CBHCompoundBatch','paramsAndForm','urlConfig','$window','$location','$anchorScroll', '$filter', 'searchUrlParams',
    function ($scope, $rootScope,$state, $stateParams,$timeout, CBHCompoundBatch, paramsAndForm, urlConfig, $window, $location, $anchorScroll, $filter, searchUrlParams) {
    $scope.compoundBatches = {data:[], redraw:0, sorts:[]};
    $scope.urlConfig = urlConfig;
    $scope.totalCompoundBatches = 0;
    //$scope.stateProjectKey = $stateParams.projectKey;
    $scope.projects = $scope.cbh.projects.objects;
      angular.forEach($scope.projects, function(proj) {
        if(proj.project_key == $stateParams.projectKey) {
          $scope.proj = proj;
        }
      });
    
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
     if (angular.isDefined($stateParams.sorts)){
                $scope.compoundBatches.sorts = JSON.parse($stateParams.sorts);
            }
    if(angular.isDefined($stateParams.showBlanks)){
        $scope.showBlanks = $stateParams.showBlanks;
    }

    if(angular.isDefined($stateParams.showNonBlanks)){
        $scope.showNonBlanks = $stateParams.showNonBlanks;
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
            if(onlyInvProjects() == true){
               $scope.pagination.compoundBatchesPerPage = { label: "50/page", value: "50" }; 
            } 
            else {
                $scope.pagination.compoundBatchesPerPage = filtered[0]; 
            }
        
       }
       else if(angular.isDefined($scope.projects)){
            
            if(onlyInvProjects() == true){

               $scope.pagination.compoundBatchesPerPage = { label: "50/page", value: "50" }; 
            } 
        }
       else {
        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
       }
    }
    //is there a project selected and if so is it an inventory project
    else if(angular.isDefined($scope.proj)){
        if($scope.proj.project_type.name == 'inventory'){

            $scope.pagination.compoundBatchesPerPage = { label: "50/page", value: "50" };
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
      
    $scope.cbh.patchRecord = function(mol){
        $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
        CBHCompoundBatch.patch(mol).then(function(data){
            CBHCompoundBatch.reindexModifiedCompound(data.id).then(function(reindexed){
                $scope.undoChanges = [data.id];
                });
            });
        
        $scope.compoundBatches.redraw ++;
    };

    if( $stateParams.archived == "true" || $stateParams.archived ==true){
            $scope.cbh.archiveFilter = true;
    }else{
            $scope.cbh.archiveFilter = false;
    }
    $scope.editModeUnreachable = function(){
        var noEdit =true;
        if(angular.isDefined($stateParams.projectKey)){
            angular.forEach($rootScope.projects,function(myproj){
                     if(myproj.project_key == $stateParams.projectKey ){
                    if(myproj.editor){
                            noEdit = false;
                          }
                        }  
        });
            return noEdit;
        };

        if($scope.cbh.includedProjectKeys.length != 1 || $stateParams.project__project_key__in.split(",").length !=1 ){

            return true;
        }else{
            
            angular.forEach($rootScope.projects,function(myproj){
                
                     if(myproj.project_key == $stateParams.project__project_key__in ){
                    if(myproj.editor){
                            noEdit = false;
                          }
                        }
                

               
            });
            return noEdit;
        }
    };
    if( $stateParams.editMode == "true" || $stateParams.editMode ==true){
        $scope.cbh.editMode = true;
        if($scope.editModeUnreachable()){
             $scope.cbh.toggleEditMode();

        }
            
    }else{
        $scope.cbh.editMode = false;
      
    }

    $scope.cbh.toggleArchiveFilter = function(){
       $scope.cbh.archiveFilter = !$scope.cbh.archiveFilter;
       var newParams = angular.copy($stateParams);
        newParams.page = 1;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.doScroll = 'true';
        newParams.archived = ($scope.cbh.archiveFilter).toString();
        $state.go($state.current.name,newParams);
    }
   
   $scope.cbh.toggleEditMode = function(){
       $scope.cbh.editMode = !$scope.cbh.editMode;
       var newParams = angular.copy($stateParams);
        newParams.page = 1;
        newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
        newParams.doScroll = 'true';
        newParams.editMode = ($scope.cbh.editMode).toString();
        $state.go($state.current.name,newParams);
    }
   
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
        
        // console.log("call");
        // call $anchorScroll()
        // if($stateParams.doScroll){
        //     $location.hash('search-bottom');
        //     $anchorScroll();
        // }

        
        $scope.compoundBatches.redraw ++;
        $timeout(function(){
            if($scope.totalCompoundBatches > 0 && $stateParams.doScroll){
                $location.hash('search-bottom');
                $anchorScroll();
            }
            else if(angular.isDefined($stateParams.scrollTop),$stateParams.scrollTop >0){
                $(window).scrollTop($stateParams.scrollTop);
            }else{
                $(window).scrollTop(0);
            }
        
                    $("#myid").scrollLeft($stateParams.scroll);

        },100);

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

    // $scope.refreshSingleCustField = function(url, searchTerm, customField){
    //     $http.get(options.async.url + "?custom__field__startswith=" + searchTerm + "&custom_field=" + customField).then(function(response){
    //         $scope.typeahead = response.data;
    //     });
    // }

    $scope.broadcastFilter = function() {
        console.log("broadcastFilter called");
    }

    $scope.cbh.blanksFilter =  function(sortColumn, showType){

        //have an exclude array for both show blanks and show non blanks
        //containing objects that specify the column name
        var newParams = angular.copy($stateParams);
        newParams.page = 1;
        //add the excludes option here
        //as an object inside filters
        if (!newParams.showBlanks) {
                newParams.showBlanks = [];
            }
        else {
                newParams.showBlanks = JSON.parse(newParams.showBlanks);
        }
        if (!newParams.showNonBlanks) {
                newParams.showNonBlanks = [];
        }
        else {
                newParams.showNonBlanks = JSON.parse(newParams.showNonBlanks);
        }

        if (showType == 'blanks') {
            var index1 = newParams.showBlanks.indexOf(sortColumn.data);
            if(index1 == -1){
                newParams.showBlanks.push(sortColumn.data);
            }else{
                //Toggle off if already selected
                newParams.showBlanks.splice(index1, 1);
            }
            //need to remove the equivalent parameter from showNonBlanks, if exists - you can't have both
            var index = newParams.showNonBlanks.indexOf(sortColumn.data);
            if(index > -1){
                newParams.showNonBlanks.splice(index, 1);
            }
        }
        else if (showType == 'nonblanks') { 
          var index1 = newParams.showNonBlanks.indexOf(sortColumn.data);
            if(index1 == -1){
                newParams.showNonBlanks.push(sortColumn.data);
            }else{
                //Toggle off if already selected
                newParams.showNonBlanks.splice(index1, 1);
            }
            //need to remove the equivalent parameter from showNonBlanks, if exists - you can't have both
            var index = newParams.showBlanks.indexOf(sortColumn.data);
            if(index > -1){
                newParams.showBlanks.splice(index, 1);
            }
        }
        newParams.showBlanks = JSON.stringify(newParams.showBlanks);
        newParams.showNonBlanks = JSON.stringify(newParams.showNonBlanks);
        $scope.cbh.changeSearchParams(newParams);

        // $state.go($state.current.name, newParams, {reload:true, inherit:false});
        //getResultsPage(newParams.page);
    };

    function onlyInvProjects(){
        var onlyInv = true;
        if(!angular.isDefined($stateParams.project__project_key__in)){
            return false;
        }
        angular.forEach($stateParams.project__project_key__in,function(myprojname){
            
            angular.forEach($scope.projects, function(proj){
                
                if(proj.project_key == myprojname){
                    if(proj.project_type.name != 'inventory'){
                        onlyInv = false;
                    }
                }

                
            });
            
           
        });
        
        /*angular.forEach($scope.projects, function(proj){
            console.log('proj', proj)
            if(proj.project_type.name != 'inventory'){
                onlyInv = false;
            }
        });
        console.log('onlyInvProject being called', onlyInv);*/
        return onlyInv;
    }
    
    
    function getResultsPage(pageNumber) {
        filters.limit = $scope.pagination.compoundBatchesPerPage.value;
        filters.offset = (pageNumber -1) * $scope.pagination.compoundBatchesPerPage.value;
        filters.sorts = $stateParams.sorts;
        filters.archived = $stateParams.archived;
        filters.showBlanks = $stateParams.showBlanks;
        if(filters.showBlanks){
            filters.showBlanks = filters.showBlanks.replace("customFields", "custom_fields")
        }
        filters.showNonBlanks = $stateParams.showNonBlanks;
        if(filters.showNonBlanks){
            filters.showNonBlanks = filters.showNonBlanks.replace("customFields", "custom_fields")
        }

        CBHCompoundBatch.query(filters).then(function(result) {
            $scope.totalCompoundBatches = result.meta.totalCount;
            $scope.compoundBatches.data =result.objects;
            $scope.compoundBatches.backup = angular.copy(result.objects);

            $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
            var pf = searchUrlParams.setup($stateParams, {molecule: {}});
            if($state.current.name=="cbh.search"){
                $scope.searchForm = angular.copy(pf.searchForm);

            }else{
                $scope.searchForm = false;
            }
            var custFieldFormItem = $filter('filter')($scope.searchFormSchema.cf_form, {key:'search_custom_fields__kv_any'}, true);
            custFieldFormItem[0].options.async.call = $scope.refreshCustFields;

            //$scope.compoundBatches.uncuratedHeaders = getAllUncuratedHeaders(result.objects);

            if(result.objects.length > 0){
                var size = ($scope.listOrGallery.choice=="gallery") ? 100 : 75;
                CBHCompoundBatch.getImages(result.objects, 400, "bigImageSrc");
                CBHCompoundBatch.getImages( result.objects, size, "imageSrc", $scope.imageCallback); 

            }else if( ( $scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > $scope.totalCompoundBatches){
                $scope.pageChanged(1);
                $scope.imageCallback();
            }
            else{
                $scope.imageCallback();
                if($state.current.name==="cbh.search"){
                    $scope.noData = "No Compounds Found. Why not try amending your search?";
                }else{
                     $scope.noData = "No Compounds Found. To add compounds use the link above.";
                }
            }
            if(angular.isDefined($stateParams.showBlanks)){
                $scope.compoundBatches.showBlanks = JSON.parse($stateParams.showBlanks)
            }
            if(angular.isDefined($stateParams.showNonBlanks)){
                $scope.compoundBatches.showNonBlanks = JSON.parse($stateParams.showNonBlanks)
            }
            
            
       });        
    }
   


        $scope.cbh.changeSearchParams = function(newParams, notify){
            newParams.scroll = $("#myid").scrollLeft();
            newParams.scrollTop = $(window).scrollTop();
            newParams.page = 1;
                $scope.pagination.current = 1;
                $state.transitionTo($state.current.name, 
                                        newParams,
                                        { location: true, 
                                            inherit: false, 
                                            relative: undefined, 
                                            notify: true });
            
                
               
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
        };
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
                     dirObj[sortColumn] = {"order": order, "missing" : "_last", "ignore_unmapped" : true};
                    $scope.compoundBatches.sorts.unshift(dirObj);
                }
                 var newParams = angular.copy($stateParams);
                
                if($scope.compoundBatches.sorts.length > 0){
                    newParams.sorts = JSON.stringify($scope.compoundBatches.sorts);
                }else{
                    newParams.sorts = undefined;
                }
                $scope.cbh.changeSearchParams(newParams);
                
            };

            $scope.changesToUndo = [];

            $scope.undoChanges = function(){
                console.log("test")
                $scope.currentlyLoading = true;
                $scope.compoundBatches.data = angular.copy($scope.compoundBatches.backup);
                var itemsToChange = $scope.changesToUndo.map(function(item){
                    return $scope.compoundBatches.data[item[0]]
                });
                CBHCompoundBatch.patchList({"objects" :itemsToChange}, $rootScope.projects).then(function(data){
                    angular.forEach(data, function(d){

                        CBHCompoundBatch.reindexModifiedCompound(d.id);

                    });
                    $scope.compoundBatches.redraw ++;
                    $scope.currentlyLoading = false;
                    $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
                });
            }

            $scope.$on("updateListView", function(){
                $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
            });

            $scope.cbh.saveChangesToCompoundDataInController = function(changes, sourceOfChange){
                //set the backup before updating
                $scope.changesToUndo = [];
                if(angular.isDefined(changes)){
                    if( changes && changes.length > 0){
                        // $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);


                        // $scope.currentlyLoading = true;
                        $scope.disableButtons = true;
                        var itemsToChange = changes.map(function(item){
                            return $scope.compoundBatches.data[item[0]]
                        });
                        
                        $scope.changesToUndo = changes;
                        var patchData = {};
                        patchData.objects = itemsToChange;
                        CBHCompoundBatch.patchList(patchData, $rootScope.projects).then(function(data){
                            angular.forEach(data, function(d){

                                CBHCompoundBatch.reindexModifiedCompound(d.id);
                            })
                        });
                    }
                }
              
           
    };
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

    getResultsPage($scope.pagination.current);


  }]);
