'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
    .controller('Compoundbatchv2Ctrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'CBHCompoundBatch', 'urlConfig', '$window', '$location', '$anchorScroll', '$filter', 'SearchUrlParamsV2','skinConfig',
        function($scope, $rootScope, $state, $stateParams, $timeout, CBHCompoundBatch, urlConfig, $window, $location, $anchorScroll, $filter, SearchUrlParamsV2, skinConfig) {
            
            $scope.resetCompoundList = function(){
                $scope.compoundBatches = {
                    data: [],
                    redraw: 0,
                    sorts: [],
                    tabular_data_schema : SearchUrlParamsV2.get_tabular_data_schema($stateParams)
                };
            }




        $rootScope.$on("cleanupFilters", function(event, args){
            console.log("cleanup")
            angular.forEach(skinConfig.objects[0].query_schemaform.default.form, function(form){
                if(form.key != "query_type" && form.key){
                    console.log(form.key)
                    args.col.filters[form.key] = skinConfig.objects[0].query_schemaform.default.schema.properties[form.key].default;
                }else if (args.reset_query_type &&  form.key == "query_type"){
                    args.col.filters.query_type = skinConfig.objects[0].query_schemaform.default.schema.properties[form.key].default;
                }

            });
            
        });

        $rootScope.$on("filtersUpdated",function( event, args){
            var index = skinConfig.objects[0].filters_applied.indexOf(args.field_path);
            var changed = false;
            if(index > -1){
              skinConfig.objects[0].filters_applied.splice(index, 1);
              changed = true;
            }
            if(args.addNew ){
              skinConfig.objects[0].filters_applied.push(args.field_path);
              changed = true;
            }
            var params = SearchUrlParamsV2.generate_filter_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });

         $rootScope.$on("removeHide",function( event, args){
            console.log(skinConfig.objects[0].hides_applied)
            console.log(args)
            var index = skinConfig.objects[0].hides_applied.indexOf(args.field_path);
            console.log(index);
            if(index > -1){
              skinConfig.objects[0].hides_applied.splice(index, 1);
            }
            var params = SearchUrlParamsV2.generate_hide_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });

         $rootScope.$on("addHide",function( event, args){
            console.log(skinConfig.objects[0].hides_applied)
            console.log(args)
            var index = skinConfig.objects[0].hides_applied.indexOf(args.field_path);
            console.log(index);
            if(index > -1){
              skinConfig.objects[0].hides_applied.splice(index, 1);
            }
            skinConfig.objects[0].hides_applied.push(args.field_path);
            console.log(skinConfig.objects[0].hides_applied);
            var params = SearchUrlParamsV2.generate_hide_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
            
            
        });

         $rootScope.$on("addSort",function( event, args){
            var index = skinConfig.objects[0].sorts_applied.indexOf(args.field_path);
            if(index > -1){
              skinConfig.objects[0].sorts_applied.splice(index, 1);
            }
            skinConfig.objects[0].sorts_applied.push(args.field_path);
            
            var params = SearchUrlParamsV2.generate_sort_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });


         $rootScope.$on("removeSort",function( event, args){

            var index = skinConfig.objects[0].sorts_applied.indexOf(args.field_path);
            if(index > -1){
              skinConfig.objects[0].sorts_applied.splice(index, 1);
            }
            
            var params = SearchUrlParamsV2.generate_sort_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });
            
            $scope.urlConfig = urlConfig;
            $scope.totalCompoundBatches = 0;
            //$scope.stateProjectKey = $stateParams.projectKey;
            $scope.projects = $scope.cbh.projects.objects;
            $scope.cbh.column = {}

           

            

            
            $scope.cbh.changeSearchParams = function(newParams, notify) {
                //General function to search and move to a new URL
                // var pf = SearchUrlParamsV2.fromForm($scope.cbh.searchForm);
                if (notify) {
                    $scope.pagination.current = 1;
                }
                $state.params = newParams;
                $stateParams = newParams;
                $state.go('cbh.searchv2', newParams, {
                    // prevent the events onStart and onSuccess from firing
                    notify: false,
                    // prevent reload of the current state
                    reload: false,
                    // replace the last record when changing the params so you don't hit the back button and get old params
                    location: 'replace',
                    // inherit the current params on the url
                    inherit: true
                });
                getResultsPage($scope.pagination.current, newParams);
            }

            $scope.changeView = function(){
                $stateParams.viewType = $scope.listOrGallery.choice;
                $state.params.viewType = $scope.listOrGallery.choice;
                $location.search($state.params);
            }

            $scope.cbh.setUpPageNumbers = function() {
                // complicated way of deciding number per page
                $scope.listOrGallery = {
                    choice: "list",
                };
                if ($stateParams.viewType) {
                    $scope.listOrGallery.choice = $stateParams.viewType;
                }
                $scope.pagination = {"current": 1
                                    };
                var listPerPage = [{
                    label: "10/page",
                    value: "10"
                }, {
                    label: "20/page",
                    value: "20"
                }, {
                    label: "50/page",
                    value: "50"
                }, {
                    label: "100/page",
                    value: "100"
                },];


                $scope.itemsPerPage = angular.copy(listPerPage);
                $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
                
                //initialise this as list first
              
                if (angular.isDefined($stateParams.compoundBatchesPerPage)) {
                    var filtered = $filter("filter")($scope.itemsPerPage, $stateParams.compoundBatchesPerPage, true);
                    if (filtered[0]) {
                       
                            $scope.pagination.compoundBatchesPerPage = filtered[0];
                    
                    } else {
                        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[1];
                    }
                }
                //is there a project selected and if so is it an inventory project
              
                if (angular.isDefined($stateParams.page)) {
                    $scope.pagination.current = $stateParams.page;

                }
            }



            //..




            $scope.cbh.patchRecord = function(mol) {
                $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
                CBHCompoundBatch.patch(mol).then(function(data) {
                    CBHCompoundBatch.reindexModifiedCompound(data.id).then(function(reindexed) {
                        $scope.undoChanges = [data.id];
                    });
                });

                $scope.compoundBatches.redraw++;
            };


            $scope.cbh.setUpPageNumbers();
            $scope.blankForm = function(toggleAddingOff, cloned) {
                if (angular.isDefined($scope.cbh.projAddingTo)) {
                    var myform = angular.copy($scope.cbh.projAddingTo.schemaform.form);
                    //we may need to replicate this within the search form...
                    angular.forEach(myform, function(item) {
                        item['feedback'] = false;
                        item['disableSuccessState'] = true;

                    });
                    $scope.myschema = angular.copy($scope.cbh.projAddingTo.schemaform.schema);
                    $scope.formChunks = myform.chunk(Math.ceil($scope.cbh.projAddingTo.schemaform.form.length / 3));

                    $scope.newMol = {
                        "customFields": {}
                    };
                    if(cloned){
                        $scope.newMol.customFields = angular.copy(cloned.customFields);
                        $scope.newMol.id = undefined;
                        $scope.newMol.resource_uri = undefined;
                    }
                    //need to also make the form pristine and remove (usually incorrect) validation cues...
                    //we've removed the feedback because it is broken in angular schema form and therefore inconsistent.
                    angular.forEach($scope.formChunks, function(chunk) {
                        chunk.$pristine = true;
                    });
                    if (toggleAddingOff) {
                        $scope.addingData = false;
                    }
                }


            };

            $scope.cbh.toggleEditMode = function() {
                $scope.cbh.editMode = !$scope.cbh.editMode;
                if ($scope.cbh.editMode) {
                    $scope.cbh.hideSearchForm = true;
                } else {
                    //Nothing - we dont unhide the search form unles the user clicks
                }
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                newParams.editMode = ($scope.cbh.editMode).toString();
                $scope.cbh.changeSearchParams(newParams, false);
            }

            $scope.editModeUnreachable = function() {
                var noEdit = true;
                angular.forEach($rootScope.projects, function(myproj, index) {
                    if (myproj.project_key == $stateParams.project__project_key__in) {
                        if (myproj.editor) {
                            noEdit = false;
                            
                        }
                    }
                });
                if (noEdit) {
                    $scope.blankForm(true);
                }
                return noEdit;
            }
            if ($stateParams.editMode == "true" || $stateParams.editMode == true) {
                $scope.cbh.editMode = true;
                if ($scope.editModeUnreachable()) {
                    $scope.cbh.toggleEditMode();
                }
            } else {
                $scope.cbh.editMode = false;
            }

            $scope.addingData = false;

            $scope.saveSingleCompound = function(toggleAddingOff) {
                CBHCompoundBatch.saveSingleCompound($scope.cbh.projAddingTo.project_key, '', $scope.newMol.customFields).then(
                    function(data) {
                        CBHCompoundBatch.reindexModifiedCompound(data.data.id).then(function(reindexed) {
                            $scope.pageChanged(1);
                            $scope.blankForm(toggleAddingOff);

                        });
                    }
                );
            };

            $scope.$on("cloneAnItem", function(event, item){
                if($scope.cbh.editMode){
                    $scope.cbh.toggleEditMode();
                }
                $scope.addingData = true;
                $scope.cbh.hideSearchForm = true;
                $scope.blankForm(false, item);
            })

            $scope.toggleAddData = function() {
                if (!$scope.addingData) {
                    $scope.addingData = true;
                    $scope.blankForm();
                    $scope.cbh.hideSearchForm=true;
                } else {
                    
                    $scope.addingData = false;
                }
            }

            // $scope.cbh.toggleArchiveFilter = function() {
            //     $scope.cbh.archiveFilter = !$scope.cbh.archiveFilter;
            //     var newParams = angular.copy($stateParams);
            //     newParams.page = 1;
            //     newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
            //     newParams.doScroll = 'true';
            //     newParams.archived = ($scope.cbh.archiveFilter).toString();
            //     $scope.cbh.changeSearchParams(newParams, false);


            // }



            $scope.changeNumberPerPage = function(viewType) {
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                $scope.cbh.changeSearchParams(newParams, false);


            };
            $scope.pageChanged = function(newPage) {
                var newParams = angular.copy($stateParams);
                newParams.page = newPage;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                $scope.cbh.changeSearchParams(newParams);

            };

            $scope.pageChanged2 = function(newPage) {
                var newParams = angular.copy($stateParams);
                newParams.page = newPage;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'false';
                $scope.cbh.changeSearchParams(newParams);

            };


            $scope.imageCallback = function() {
                $scope.compoundBatches.redraw++;
            }




            $scope.cbh.watcher = $scope.$watch(
                    function($scope) {
                        return $scope.cbh.textsearch;
                    },
                    function(newValue, oldvalue) {

                        if (newValue != oldvalue) {

                            $scope.cbh.runSearch();
                        }

                    },
                    true
            );

            var timeSearched;

            function getResultsPage(pageNumber, filters) {
                 // angular.forEach($rootScope.projects, function(myproj, index) {
                 //        if (myproj.project_key == $stateParams.project__project_key__in) {
                 //            if (myproj.editor) {
                 //                 $scope.cbh.projAddingTo = $scope.cbh.projects.objects[index];
                 //                 $scope.cbh.projAddingTo.updateCustomFields();
                 //            }
                 //        }
                 //    });
                // $scope.cbh.includedProjectKeys = ($scope.cbh.searchForm.project__project_key__in.length > 0) ? $scope.cbh.searchForm.project__project_key__in : $scope.cbh.projects.objects.map(function(p) {
                //     return p.project_key
                // });

                var el = document.querySelector('.hot-loading');
                    var angElement = angular.element(el);
                    angElement.addClass("now-showing");
                timeSearched = String(Date.now());

                var localTimeSearched = String(timeSearched);
                filters.limit = $scope.pagination.compoundBatchesPerPage.value;
                filters.offset = (pageNumber - 1) * parseInt($scope.pagination.compoundBatchesPerPage.value);
                filters.sorts = $stateParams.sorts;
                
                $scope.noData = "";


                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    if (timeSearched == localTimeSearched) {
                        $scope.totalCompoundBatches = result.meta.totalCount;
                        $scope.compoundBatches.data = result.objects;
                        $scope.compoundBatches.backup = angular.copy(result.objects);




                        if (result.objects.length > 0) {
                            $scope.imageCallback();
                            $scope.noData = "";

                        } else if (($scope.pagination.current * parseInt($scope.pagination.compoundBatchesPerPage.value)) > ($scope.totalCompoundBatches + $scope.pagination.compoundBatchesPerPage.value)) {
                            $scope.pageChanged(1);
                            $scope.imageCallback();
                        } else {
                            $scope.imageCallback();
                            if ($state.current.name === "cbh.search") {
                                $scope.noData = "No Compounds Found. Why not try amending your search?";
                            } else {
                                $scope.noData = "No Compounds Found. To add compounds use the link above.";
                            }
                        }
                        if (angular.isDefined($stateParams.showBlanks)) {
                            $scope.compoundBatches.showBlanks = JSON.parse($stateParams.showBlanks)
                        }
                        if (angular.isDefined($stateParams.showNonBlanks)) {
                            $scope.compoundBatches.showNonBlanks = JSON.parse($stateParams.showNonBlanks)
                        }
                    }


                }, function(error){
                    $scope.resetCompoundList();
                    $scope.noData = "Sorry, there was an error with that query. No data found.";
                                        $scope.imageCallback();

                }
                );
                if( $scope.cbh.showSingle){
                    //turn oon the add inventory items
                    $scope.toggleAddData();
                    $scope.cbh.showSingle = false;
                    
                }

            }





            $scope.undoChanges = function() {
                console.log("test")
                $scope.currentlyLoading = true;
                $scope.compoundBatches.data = angular.copy($scope.compoundBatches.backup);
                var itemsToChange = $scope.cbh.changesToUndo.map(function(item) {
                    return $scope.compoundBatches.data[item[0]]
                });
                CBHCompoundBatch.patchList({
                    "objects": itemsToChange
                }, $rootScope.projects).then(function(data) {
                    angular.forEach(data, function(d) {

                        CBHCompoundBatch.reindexModifiedCompound(d.id);

                    });
                    $scope.compoundBatches.redraw++;
                    $scope.currentlyLoading = false;
                    $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
                });
            }

            $scope.$on("updateListView", function() {
                $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
            });

            $scope.cbh.saveChangesToCompoundDataInController = function(changes, sourceOfChange) {
                //set the backup before updating
                $scope.cbh.changesToUndo = [];
                if (angular.isDefined(changes)) {
                    if (changes && changes.length > 0) {
                        // $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);


                        // $scope.currentlyLoading = true;
                        $scope.disableButtons = true;
                        var itemsToChange = changes.map(function(item) {
                            return $scope.compoundBatches.data[item[0]]
                        });

                        $scope.cbh.changesToUndo = changes;
                        var patchData = {};
                        patchData.objects = itemsToChange;
                        CBHCompoundBatch.patchList(patchData, $rootScope.projects).then(function(data) {
                            angular.forEach(data, function(d) {

                                CBHCompoundBatch.reindexModifiedCompound(d.id);
                            })
                        });
                    }
                }


            };
            $scope.initialise = function() {
               
                if ($stateParams.mb_id) {
                    $scope.current_dataset_id = $stateParams.mb_id;
                    $scope.datasets[$scope.current_dataset_id] = {
                        multiplebatch: $scope.current_dataset_id
                    }
                }
                if ($stateParams.warningsFilter) {
                    $scope.warningsFilter = $stateParams.warningsFilter;
                } else {
                    $scope.warningsFilter = "";

                }

                
                if (angular.isDefined($stateParams.sorts)) {
                    $scope.compoundBatches.sorts = JSON.parse($stateParams.sorts);
                }


            }
             $scope.cbh.setupParams = function(){
                
                var pf = SearchUrlParamsV2.generate_form($stateParams);
                $timeout(function(){
                    $scope.resetCompoundList();
                    $rootScope.$broadcast("searchParamsChanged");
                    getResultsPage($scope.pagination.current, $stateParams);
                });
                
                
            }

            $scope.cbh.setupParams();
            
            
          


        }
    ]);