'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:CompoundbatchCtrl
 * @description
 * # CompoundbatchCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
    .controller('CompoundbatchCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'CBHCompoundBatch', 'urlConfig', '$window', '$location', '$anchorScroll', '$filter', 'searchUrlParams',
        function($scope, $rootScope, $state, $stateParams, $timeout, CBHCompoundBatch, urlConfig, $window, $location, $anchorScroll, $filter, searchUrlParams) {
            $scope.compoundBatches = {
                data: [],
                redraw: 0,
                sorts: []
            };
            $scope.urlConfig = urlConfig;
            $scope.totalCompoundBatches = 0;
            //$scope.stateProjectKey = $stateParams.projectKey;
            $scope.projects = $scope.cbh.projects.objects;
            $scope.$watch(function($scope) {
                //anchor scroll to top when the search form is hidden or shown
                return $scope.cbh.hideSearchForm;
            }, function() {
                $anchorScroll();
            });


            
            
            $scope.cbh.changeSearchParams = function(newParams, notify) {
                //General function to search and move to a new URL
                var pf = searchUrlParams.fromForm($scope.cbh.searchForm, $scope.cbh.textsearch);
                $scope.cbh.setupParams(pf);
                
                console.log($scope.cbh.withoutCustomFieldsUrl);
                if (notify) {
                    $scope.pagination.current = 1;
                }
                $state.params = newParams;
                $stateParams = newParams;
                // $location.search(newParams);
                $state.go('cbh.search', newParams, {
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

            $scope.cbh.setUpPageNumbers = function() {
                // complicated way of deciding number per page
                $scope.listOrGallery = {
                    choice: "list",
                };
                if ($stateParams.viewType) {
                    $scope.listOrGallery.choice = $stateParams.viewType;
                }
                var listPerPage = [{
                    label: "10/page",
                    value: "10"
                }, {
                    label: "20/page",
                    value: "20"
                }, {
                    label: "50/page",
                    value: "50"
                }, ];

                var galleryPerPage = {
                    largeScreen: [{
                        label: "40/page",
                        value: "40"
                    }, {
                        label: "80/page",
                        value: "80"
                    }, {
                        label: "120/page",
                        value: "120"
                    }, ],
                    smallScreen: [{
                        label: "30/page",
                        value: "30"
                    }, {
                        label: "60/page",
                        value: "60"
                    }, {
                        label: "90/page",
                        value: "90"
                    }, ],
                }
                if (angular.isDefined($stateParams.sorts)) {
                    $scope.compoundBatches.sorts = JSON.parse($stateParams.sorts);
                }
                if (angular.isDefined($stateParams.showBlanks)) {
                    $scope.showBlanks = $stateParams.showBlanks;
                }

                if (angular.isDefined($stateParams.showNonBlanks)) {
                    $scope.showNonBlanks = $stateParams.showNonBlanks;
                }
                //initialise this as list first
                if (angular.isDefined($stateParams.viewType)) {
                    if ($stateParams.viewType == 'list') {
                        $scope.itemsPerPage = angular.copy(listPerPage);
                    } else if ($stateParams.viewType == 'gallery') {

                        var w = angular.element($window);
                        if (w.width() > 1200) {
                            $scope.itemsPerPage = angular.copy(galleryPerPage.largeScreen);

                        } else {
                            $scope.itemsPerPage = angular.copy(galleryPerPage.smallScreen);
                        }
                    }
                } else {
                    $scope.itemsPerPage = angular.copy(listPerPage);
                }
                $scope.pagination = {
                    current: 1,
                    compoundBatchesPerPage: $scope.itemsPerPage[0],
                };
                if (angular.isDefined($stateParams.compoundBatchesPerPage)) {
                    var filtered = $filter("filter")($scope.itemsPerPage, $stateParams.compoundBatchesPerPage, true);
                    if (filtered[0]) {
                        if (onlyInvProjects() == true) {
                            console.log('onlyInvProjects', onlyInvProjects())
                            $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
                        } else {
                            $scope.pagination.compoundBatchesPerPage = filtered[0];
                        }

                    } else if (angular.isDefined($scope.projects)) {

                        if (onlyInvProjects() == true) {
                            console.log('onlyInvProjects', onlyInvProjects())
                            $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
                        }
                    } else {
                        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
                    }
                }
                //is there a project selected and if so is it an inventory project
                else if (angular.isDefined($scope.proj)) {
                    if ($scope.proj.project_type.name == 'inventory') {

                        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
                    }
                } else if (angular.isDefined($stateParams.project__project_key__in)) {
                    if (onlyInvProjects() == true) {
                        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[2];
                    }
                } else {
                    $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
                }
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
            $scope.blankForm = function(toggleAddingOff) {
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
                    //need to also make the form pristine and remove (usually incorrect) validation cues...
                    //we've removed the feedback because it is broken in angular schema form and therefore inconsistent.
                    angular.forEach($scope.formChunks, function(chunk) {
                        chunk.$pristine = true;
                    });
                    if (toggleAddingOff) {
                        $scope.addingData = false;
                        $scope.cbh.hideSearchForm = false;
                    }
                }


            };

            $scope.cbh.toggleEditMode = function() {
                $scope.cbh.editMode = !$scope.cbh.editMode;
                if ($scope.cbh.editMode) {
                    $scope.cbh.hideSearchForm = true;
                } else {
                    $scope.cbh.hideSearchForm = false;
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
                            $scope.cbh.projAddingTo = $scope.cbh.projects.objects[index];
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

            $scope.toggleAddData = function() {
                if (!$scope.addingData) {
                    $scope.cbh.hideSearchForm = true;
                    $scope.addingData = true;
                    $scope.blankForm();
                } else {
                    $scope.cbh.hideSearchForm = false;
                    $scope.addingData = false;
                }
            }

            $scope.cbh.toggleArchiveFilter = function() {
                $scope.cbh.archiveFilter = !$scope.cbh.archiveFilter;
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                newParams.archived = ($scope.cbh.archiveFilter).toString();
                $scope.cbh.changeSearchParams(newParams, false);


            }



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
                $scope.cbh.repaintUiselect();
            }

            function getAllUncuratedHeaders(data) {
                //pull out and merge and uniquify all the uncurated fields
                var uncurated_headers = []
                angular.forEach(data, function(obj) {
                    //get this object's uncurated fields
                    angular.forEach(obj.uncurated_fields, function(field) {
                        uncurated_fields.push(field);
                    });
                });
                return uncurated_headers;
            }


            $scope.cbh.blanksFilter = function(sortColumn, showType) {
                //have an exclude array for both show blanks and show non blanks
                //containing objects that specify the column name
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                //add the excludes option here
                //as an object inside filters
                if (!newParams.showBlanks) {
                    newParams.showBlanks = [];
                } else {
                    newParams.showBlanks = JSON.parse(newParams.showBlanks);
                }
                if (!newParams.showNonBlanks) {
                    newParams.showNonBlanks = [];
                } else {
                    newParams.showNonBlanks = JSON.parse(newParams.showNonBlanks);
                }

                if (showType == 'blanks') {
                    var index1 = newParams.showBlanks.indexOf(sortColumn.data);
                    if (index1 == -1) {
                        newParams.showBlanks.push(sortColumn.data);
                    } else {
                        //Toggle off if already selected
                        newParams.showBlanks.splice(index1, 1);
                    }
                    //need to remove the equivalent parameter from showNonBlanks, if exists - you can't have both
                    var index = newParams.showNonBlanks.indexOf(sortColumn.data);
                    if (index > -1) {
                        newParams.showNonBlanks.splice(index, 1);
                    }
                } else if (showType == 'nonblanks') {
                    var index1 = newParams.showNonBlanks.indexOf(sortColumn.data);
                    if (index1 == -1) {
                        newParams.showNonBlanks.push(sortColumn.data);
                    } else {
                        //Toggle off if already selected
                        newParams.showNonBlanks.splice(index1, 1);
                    }
                    //need to remove the equivalent parameter from showNonBlanks, if exists - you can't have both
                    var index = newParams.showBlanks.indexOf(sortColumn.data);
                    if (index > -1) {
                        newParams.showBlanks.splice(index, 1);
                    }
                }
                newParams.showBlanks = JSON.stringify(newParams.showBlanks);
                newParams.showNonBlanks = JSON.stringify(newParams.showNonBlanks);
                $scope.cbh.changeSearchParams(newParams);

                // $state.go($state.current.name, newParams, {reload:true, inherit:false});
                //getResultsPage(newParams.page);
            };

            function onlyInvProjects() {

                var onlyInv = true;

                angular.forEach($stateParams.project__project_key__in, function(myprojname) {
                    angular.forEach($scope.projects, function(proj) {

                        if (proj.project_key == myprojname) {
                            if (proj.project_type.name.toLowerCase() != 'inventory') {
                                onlyInv = false;
                            }
                        }


                    });


                });

                return onlyInv;
            }


            var timeSearched;

            function getResultsPage(pageNumber, filters) {
                $scope.cbh.includedProjectKeys = ($scope.cbh.searchForm.project__project_key__in.length > 0) ? $scope.cbh.searchForm.project__project_key__in : $scope.cbh.projects.objects.map(function(p) {
                    return p.project_key
                });

                timeSearched = String(Date.now());
                var localTimeSearched = String(timeSearched);
                filters.limit = $scope.pagination.compoundBatchesPerPage.value;
                filters.offset = (pageNumber - 1) * $scope.pagination.compoundBatchesPerPage.value;
                filters.sorts = $stateParams.sorts;
                filters.archived = $stateParams.archived;
                filters.showBlanks = $stateParams.showBlanks;
                filters.textsearch = $stateParams.textsearch;
                if (filters.showBlanks) {
                    filters.showBlanks = filters.showBlanks.replace("customFields", "custom_fields")
                }
                filters.showNonBlanks = $stateParams.showNonBlanks;
                if (filters.showNonBlanks) {
                    filters.showNonBlanks = filters.showNonBlanks.replace("customFields", "custom_fields")
                }



                CBHCompoundBatch.query(filters).then(function(result) {
                    if (timeSearched == localTimeSearched) {
                        $scope.totalCompoundBatches = result.meta.totalCount;
                        $scope.compoundBatches.data = result.objects;
                        $scope.compoundBatches.backup = angular.copy(result.objects);



                        //$scope.compoundBatches.uncuratedHeaders = getAllUncuratedHeaders(result.objects);

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


                });

            }




            $scope.nullSorts = function() {
                $scope.compoundBatches.sorts = [];
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.sorts = undefined;
                $state.params = newParams;
                $stateParams = newParams;
                $location.search(newParams);
                $scope.initialise();
            };

            $scope.cbh.addSort = function(sortColumn, order) {

                var i = $scope.compoundBatches.sorts.length;
                var toggeldOff = false;
                while (i--) {
                    if (angular.isDefined($scope.compoundBatches.sorts[i][sortColumn])) {
                        if ($scope.compoundBatches.sorts[i][sortColumn].order == order) {
                            var toggeldOff = true;
                        }
                        $scope.compoundBatches.sorts.pop(i);
                    }
                }

                var dirObj = {};
                if (!toggeldOff) {
                    dirObj[sortColumn] = {
                        "order": order,
                        "missing": "_last",
                        "ignore_unmapped": true
                    };
                    $scope.compoundBatches.sorts.unshift(dirObj);
                }
                var newParams = angular.copy($stateParams);

                if ($scope.compoundBatches.sorts.length > 0) {
                    newParams.sorts = JSON.stringify($scope.compoundBatches.sorts);
                } else {
                    newParams.sorts = undefined;
                }
                $scope.cbh.changeSearchParams(newParams, true);

            };
            if (!angular.isDefined($scope.cbh.changesToUndo)) {
                $scope.cbh.changesToUndo = [];
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
                if ($stateParams.viewType) {
                    $scope.listOrGallery.choice = $stateParams.viewType;
                }
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

                if (angular.isDefined($stateParams.compoundBatchesPerPage)) {
                    var filtered = $filter("filter")($scope.itemsPerPage, $stateParams.compoundBatchesPerPage, true);
                    if (filtered[0]) {
                        $scope.pagination.compoundBatchesPerPage = filtered[0];
                    } else {
                        $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
                    }
                } else {
                    $scope.pagination.compoundBatchesPerPage = $scope.itemsPerPage[0];
                }
                if (angular.isDefined($stateParams.page)) {
                    $scope.pagination.current = $stateParams.page;
                }
                if (angular.isDefined($stateParams.sorts)) {
                    $scope.compoundBatches.sorts = JSON.parse($stateParams.sorts);
                }


                // getResultsPage($scope.pagination.current);


            }

            getResultsPage($scope.pagination.current, $scope.cbh.pf.params);


        }
    ]);