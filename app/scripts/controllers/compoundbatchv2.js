'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl
 * @description
 * # Compoundbatchv2Ctrl
 * This controller handles edit functionality and result retrieval within the compound search page. It is the backing for the tables displaying search results, and handles switching to edit mode (and saving changes) and archive mode, along with pagination, 
 * filter and sort functionality, as well as applying search form selections and parameters to the displayed results.
 */
angular.module('chembiohubAssayApp')
    .controller('Compoundbatchv2Ctrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'CBHCompoundBatch', 'urlConfig', '$window', '$location', '$anchorScroll', '$filter', 'SearchUrlParamsV2','skinConfig', 'FlowFileFactory', 'chemicalSearch',
        function($scope, $rootScope, $state, $stateParams, $timeout, CBHCompoundBatch, urlConfig, $window, $location, $anchorScroll, $filter, SearchUrlParamsV2, skinConfig, FlowFileFactory, chemicalSearch) {
            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.resetSearch
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Set the search form to its default empty state, with no search parameters. Also resets the URL.
             *
             */
            $scope.cbh.resetSearch = function(){
                $state.go($state.current.name,  {}, {reload: true, inherit: false});
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.resetCompoundList
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Clears prevous search hits list for searches that hit an error or simply return no hits.
             *
             */
            $scope.resetCompoundList = function(){
                //We need the base statename, not the modal statename
                $scope.totalCompoundBatches = 0;
                var stateName = $state.current.name.replace(".record", "")
                $scope.cbh.tabular_data_schema = skinConfig.objects[0].get_filtered_table_schema(stateName, $scope.cbh.selected_projects);

                $scope.compoundBatches = {
                    data: [],
                    redraw: 0,
                    sorts: [],
                };
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Initialises chemical search by posting chemical search parameter data which has been assembled in skinConfig
             * @param {string} chemicalSearch  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("chemicalSearch", function(event ){
                var data = skinConfig.objects[0].chemicalSearch
                data.id = undefined;
                chemicalSearch.save(data, function(data){
                    skinConfig.objects[0].chemicalSearch = data;
                    $rootScope.$broadcast("chemicalSearchReady");
                });
            });

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Clears structure search related parameters from the page.
             * @param {string} removeStructureSearch  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("removeStructureSearch", function(){
                var qt = angular.copy(skinConfig.objects[0].chemicalSearch.query_type);
                skinConfig.objects[0].chemicalSearch.molfile = "";
                skinConfig.objects[0].chemicalSearch.filter_is_applied = false;
                skinConfig.objects[0].chemicalSearch.inprogress = false;
                skinConfig.objects[0].chemicalSearch.smiles = "";
                skinConfig.objects[0].chemicalSearch.id = undefined;
                skinConfig.objects[0].chemicalSearch.image = undefined;
                var params = $stateParams;
                params.chemical_search_id=undefined;
                $scope.cbh.changeSearchParams(params, true);

                
                $scope.$broadcast("chemicalSearchReady");
                $rootScope.$broadcast("setMolecule");
                    
                    
            });

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Calls the function to serialize chemical search parameters into a URL friendly format. In turn notifies 
             * cbh object that its should update the URL parameters in the state.
             * @param {string} chemicalFilterApplied  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("chemicalFilterApplied",function( event, args){
                    var params = SearchUrlParamsV2.generate_chemical_params($stateParams);
                    $scope.cbh.changeSearchParams(params, true);
                    $scope.cbh.justAdded = false;
            });


            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Calls the function to serialize chemical search parameters into a URL friendly format. In turn notifies 
             * cbh object that 
             * @param {string} openedSearchDropdown  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedSearchDropdown", function(event, args){
                var filters = angular.copy($stateParams);
                var activeCol = null;
                angular.forEach($scope.cbh.tabular_data_schema, function(c){
                    if(c.showFilters){
                        activeCol = c;
                    }
                });
                filters.autocomplete_field_path = activeCol.data;
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    //this is broadcasting to a dynamic $on method within the pickfromlist widget (within cbh_angular_schema_form_extension.js)
                    //which is why if you look for the braodcast name elsewhere you won't find it.
                    //it looks for the name defined in dataArrivesEventName within the schema form element
                    $rootScope.$broadcast("autoCompleteData", result);
                });
                
            })
            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.sendToSearch
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Change the current search parameters and broadcast a columnSelection event based on filter selections for a supplied column.
             * @param {object} col object representing a handsontable column
             *
             */
            $scope.cbh.sendToSearch = function(col){
                
                $timeout(function(){
                        angular.forEach($scope.cbh.tabular_data_schema, function(c){
                            c.showFilters = false;
                        });
                        col.showFilters = true;
                        $scope.cbh.column = col;
                        $rootScope.$broadcast("columnSelection", $scope.cbh.column);
                        $scope.cbh.changeSearchParams($stateParams, true);
                }); 
            }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Removes filters from the scope objects and resets them to their defaults.
         * @param {string} cleanupFilters  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("cleanupFilters", function(event, args){
            angular.forEach(skinConfig.objects[0].query_schemaform.default.schema.properties, function(value, key){
                if(key != "query_type" && key){
                    args.col.filters[key] = angular.copy(value.default);
                }else if (args.reset_query_type &&  key == "query_type"){
                    args.col.filters.query_type = angular.copy(value.default);
                }
            });
            
        });


     
        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Notifies the app that filters have been changed in the form or via url. This listener sends the changes to generate new url parameters
         * @param {string} filtersUpdated  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("filtersUpdated",function( event, args){
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
            $scope.cbh.justAdded = false;
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Remove all filters which hide columns and send to generate new search parameters with these removed.
         * @param {string} removeAllHides  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("removeAllHides",function( event, args){
            
            skinConfig.objects[0].hides_applied = [];
            var params = SearchUrlParamsV2.generate_hide_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Show a previously hidden column and send to generate new search parameters with this accounted for.
         * @param {string} removeHide  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("removeHide",function( event, args){
            
            var index = skinConfig.objects[0].hides_applied.indexOf(args.field_path);
            if(index > -1){
              skinConfig.objects[0].hides_applied.splice(index, 1);
            }
            var params = SearchUrlParamsV2.generate_hide_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Hide a previously shown column and send to generate new search parameters with this accounted for.
         * @param {string} addHide  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("addHide",function( event, args){
            var index = skinConfig.objects[0].hides_applied.indexOf(args.field_path);
            if(index > -1){
              skinConfig.objects[0].hides_applied.splice(index, 1);
            }
            skinConfig.objects[0].hides_applied.push(args.field_path);
            var params = SearchUrlParamsV2.generate_hide_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
            
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Sort a column and send to generate new search parameters with this accounted for.
         * @param {string} addSort  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("addSort",function( event, args){
            var index = skinConfig.objects[0].sorts_applied.indexOf(args.field_path);
            if(index > -1){
              skinConfig.objects[0].sorts_applied.splice(index, 1);
            }
            skinConfig.objects[0].sorts_applied.push(args.field_path);
            
            var params = SearchUrlParamsV2.generate_sort_params($stateParams);
            $scope.cbh.changeSearchParams(params, true);
        });

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
         * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
         * @description
         * Remove a sort on a column, reverting to any default sort direction and send to generate new search parameters with this accounted for.
         * @param {string} removeSort  The name of the broadcast to act on
         * @param {function} callback  the callback function to trigger functionality
         *
         */
        $scope.$on("removeSort",function( event, args){

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

           $scope.cbh.watcher = $scope.$watch(
                function($scope) {
                    return $scope.cbh.textsearch;
                },
                function(newValue, oldvalue) {
                    if (newValue != oldvalue) {
                        var params = SearchUrlParamsV2.get_textsearch_params($stateParams, newValue);
                        $scope.cbh.changeSearchParams(params, true);
                    }
                },
                true
            );

           /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.selectAllProjects
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Add all projects to the projects filter and generate new search parameters for this selection
             *
             */
           $scope.cbh.selectAllProjects = function(){
                $scope.cbh.selected_projects = [];
                angular.forEach($scope.cbh.projects.objects, function(p){
                    $scope.cbh.selected_projects.push(p);
                });
                
                angular.forEach($scope.cbh.projects.objects, function(p){
                    p.filtered = true;
                });
                var params = SearchUrlParamsV2.get_project_params($stateParams, $scope.cbh.selected_projects);
                $scope.cbh.changeSearchParams(params, true);
                $scope.cbh.justAdded = false;
           }
            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.deSelectAllProjects
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Remove all projects from the projects filter and generate new search parameters for this selection
             *
             */
            $scope.cbh.deSelectAllProjects = function(){
                $scope.cbh.selected_projects = [];
                angular.forEach($scope.cbh.projects.objects, function(p){
                    p.filtered = false;
                });
                var params = SearchUrlParamsV2.get_project_params($stateParams, $scope.cbh.selected_projects);
                $scope.cbh.changeSearchParams(params, true);
                $scope.cbh.justAdded = false;
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.toggleProjectFiltered
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Add or remove specified project from the projects filter and generate new search parameters for this selections
             * @param {object} proj The project object which has been toggled in the project selector.
             *
             */
            $scope.cbh.toggleProjectFiltered = function(proj){
                var justToggledOn = true;

                angular.forEach($scope.cbh.selected_projects,function( sel, index, array){
                    if(proj.id == sel.id){
                        array.splice(index, 1);
                        justToggledOn = false;
                        proj.filtered = false;
                    }
                });

                if(justToggledOn){
                    $scope.cbh.selected_projects.push(proj);
                    proj.filtered = true;
                }
                var params = SearchUrlParamsV2.get_project_params($stateParams, $scope.cbh.selected_projects);

                $scope.cbh.changeSearchParams(params, true);
                $scope.cbh.justAdded = false;
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.changeSearchParams
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Main function to search and move to a new URL. Checks first that user is not in edit mode.
             * @param {object} newParams Search parameters which have been newly built from other filter broadcast events.
             * @param {boolean} notify Flag that the new search result should be set at page 1
             *
             */
            $scope.cbh.changeSearchParams = function(newParams, notify) {
                //General function to search and move to a new URL
                // var pf = SearchUrlParamsV2.fromForm($scope.cbh.searchForm);

                if($scope.editModeUnreachable() && $scope.cbh.editMode){
                    //reset the edit mode if the conditions are not met
                    $scope.cbh.editMode = false;
                    params.editMode = false;
                }

                if (notify) {
                    $scope.pagination.current = 1;
                }
                $state.params = newParams;
                $stateParams = newParams;
                $state.go($state.current.name, newParams, {
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

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.changeView
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Switches between list and gallery views and re-applies to search. Called from paging bar html.
             *
             */
            $scope.changeView = function(){
                $stateParams.viewType = $scope.listOrGallery.choice;
                $state.params.viewType = $scope.listOrGallery.choice;
                $location.search($state.params);
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.setUpPageNumbers
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Initialises the choices available for number of results per search page
             *
             */
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

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.patchRecord
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Make changes to an existing molecule record. Uses a PATCH web service call. Sends a call to refresh displayed records.
             * @param {object} mol The molecule object to be patched
             *
             */
            $scope.cbh.patchRecord = function(mol) {
                $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
                //TODO handle error here

                CBHCompoundBatch.patch(mol).then(function(data) {
                    angular.forEach($scope.compoundBatches.data, function(m){
                        if(m.id == mol.id){
                            $scope.changesToUndo = [[data.id]];
                        }
                    });
              
                });

                $scope.compoundBatches.redraw++;
            };


            $scope.cbh.setUpPageNumbers();

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.toggleEditMode
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Switch edit mode on or off. Also changes search parameters to refelct choice of edit mode, and scrolls to start of data set.
             *
             */
            $scope.cbh.toggleEditMode = function() {
                $scope.cbh.editMode = !$scope.cbh.editMode;
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                newParams.editMode = ($scope.cbh.editMode).toString();
                $scope.cbh.changeSearchParams(newParams, false);
            }

     
            $scope.addingData = false;

            $scope.errormess = "";

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.doSingleCompoundValidation
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Perform client side validation of the compound addition form.
             * @param {object} myForm Whole form object for client-side validation.
             *
             */
            $scope.doSingleCompoundValidation = function(myForm){
                $scope.errormess = "";
                //this step is necessary to ensure that required fields have data
                //and for validation check on the form as a whole to fail if required fields are missing
                //don't look for this in the angular schema form examples - it's not there...
                $scope.$broadcast("schemaFormValidate");
                if(myForm.$valid && !myForm.$pristine){
                    $scope.saveSingleCompound();
                }
                else if(myForm.$pristine){
                    $scope.errormess = "You must add some data before you can submit your form.";
                }
                else {
                    $scope.errormess = "You have required fields missing or incorrect data - please correct these and try again.";
                }
                //TODO: account for string being too long for text field length (1028 chars)

            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.saveSingleCompound
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Save one compound from the addition form. Object to be saved is in the scope as newMol. 
             * Convenience method for the CBHCompoundBatch web service. On completion, signals that the page has changed.
             *
             */
            $scope.saveSingleCompound = function() {
                //adding validation here

                CBHCompoundBatch.saveSingleCompound($scope.newMol).then(
                    function(data) {
                        
                        $scope.blankForm($scope.cbh.toggleAddingOff);
                        $scope.pageChanged(1);
                    }
                );
            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Remove the currently displayed form. Not yet implemented here.
             * @param {string} removeForm  The name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("removeForm", function(){
                //TODO handle
            })

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Convenience command to turn on the add data form with data pre-populated when user requests to clone an item.
             * @param {string} cloneAnItem  The name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("cloneAnItem", function(event, item){
                $scope.toggleAddData(item);

            })

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.toggleAddData
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Switch the item addition form on or off. If currently in edit mode, switches off edit mode first
             *
             */
            $scope.toggleAddData = function(item) {
                if($scope.cbh.editMode){
                    $scope.cbh.toggleEditMode();
                }
                if (!$scope.addingData) {
                    $scope.addingData = true;
                    $scope.blankForm(false, item);
                } else {
                    
                    $scope.addingData = false;
                }
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Listens for use of a tagging/uiselect form element to populate the available choices from the back end.
             * @param {string} openedTaggingDropdown  The name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedTaggingDropdown", function(event, args){
                var filters = {};
                filters.pids = $scope.cbh.projAddingTo.id;
                
                filters.autocomplete_field_path = "custom_fields." + args.key;
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    $rootScope.$broadcast("autoCompleteTaggingData", result);
                });
                
            })

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.blankForm
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Set up a new blank form with the correct prject fields for adding a new batch record.
             * @param {boolean} toggleAddingOff Indicates whether this form is intended to add a new record from scratch.
             * @param {boolean} cloned Whether this is called from a clone command
             *
             */
            $scope.blankForm = function(toggleAddingOff, cloned) {
                if (angular.isDefined($scope.cbh.projAddingTo)) {
                    var myform = angular.copy($scope.cbh.projAddingTo.schemaform.form);
                    //we may need to replicate this within the search form...
                    angular.forEach(myform, function(item) {
                        item['feedback'] = "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }";
                        item['disableSuccessState'] = true;

                    });
                    $scope.myschema = angular.copy($scope.cbh.projAddingTo.schemaform.schema);
                    $scope.formChunks = myform.chunk(Math.ceil($scope.cbh.projAddingTo.schemaform.form.length / 3));

                    $scope.newMol = {
                        "custom_fields": {},
                        "project": {"pk" : $scope.cbh.projAddingTo.id}
                    };
                    if(cloned){
                        $scope.newMol.custom_fields = angular.copy(cloned.custom_fields);
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
                    //swithch off the validation info message
                    $scope.errormess = "";
                }


            };



  

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.changeNumberPerPage
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Change the number of records per page and start at page 1
             * Initiates changes to search parameters and consequently URL.
             * @param {string} viewType Either 'list' or 'gallery'.
             *
             */
            $scope.changeNumberPerPage = function(viewType) {
                var newParams = angular.copy($stateParams);
                newParams.page = 1;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                $scope.cbh.changeSearchParams(newParams, false);


            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.pageChanged
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Listens for paging actions and sets the paging search parameters correctly. 
             * Initiates changes to search parameters and consequently URL.
             * @param {integer} newPage .
             *
             */
            $scope.pageChanged = function(newPage) {
                var newParams = angular.copy($stateParams);
                newParams.page = newPage;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'true';
                $scope.cbh.changeSearchParams(newParams);

            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.pageChanged2
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Listens for paging actions and sets the paging search parameters correctly. 
             * Initiates changes to search parameters and consequently URL.
             * @param {integer} newPage .
             *
             */
            $scope.pageChanged2 = function(newPage) {
                var newParams = angular.copy($stateParams);
                newParams.page = newPage;
                newParams.compoundBatchesPerPage = $scope.pagination.compoundBatchesPerPage.value;
                newParams.doScroll = 'false';
                $scope.cbh.changeSearchParams(newParams);

            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.imageCallback
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Forces a page re-render to cascade down to chemical images.
             * Initiates changes to search parameters and consequently URL.
             *
             */
            $scope.imageCallback = function() {
                $scope.compoundBatches.redraw++;
            }





            var timeSearched;

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#getResultsPage
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Sets up the correct search URL to use for the current parameters and filters (including paging) and carries out the searchvia web service call.
             * After web service calls, results set populated into scope.
             * @param {integer} pageNumber The page number of the results set returned.
             * @param {object} filters The currently set search filters on the form.
             *
             */
            function getResultsPage(pageNumber, filters) {

                SearchUrlParamsV2.setBaseDownloadUrl($scope.cbh, $stateParams);
                $scope.resetCompoundList();
                if($scope.cbh.selected_projects.length == 1){
                    if($scope.cbh.selected_projects[0].editor){
                        $scope.cbh.projAddingTo = $scope.cbh.selected_projects[0];
                    }
                }else{
                    $scope.cbh.projAddingTo = undefined;
                }

                var el = document.querySelector('.hot-loading');
                    var angElement = angular.element(el);
                    angElement.addClass("now-showing");
                timeSearched = String(Date.now());

                var localTimeSearched = String(timeSearched);
                filters.limit = $scope.pagination.compoundBatchesPerPage.value;
                filters.offset = (pageNumber - 1) * parseInt($scope.pagination.compoundBatchesPerPage.value);

                $scope.noData = "";


                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    if (timeSearched == localTimeSearched) {
                        $scope.totalCompoundBatches = result.meta.total_count;
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
                            $scope.noData = "No " + skinConfig.objects[0].result_alias + " found.";
                            if (!$scope.editModeUnreachable()){
                                $scope.noData += " To add " + skinConfig.objects[0].result_alias + " click the Add Single or Add Multiple links below."
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
                    if(error.status == 503){
                        $timeout(function(){
                           getResultsPage(pageNumber, filters); 
                       }, 5000);
                        
                    }else{
                        $scope.resetCompoundList();
                        $scope.noData = "Sorry, there was an error with that query. No data found.";
                        $scope.imageCallback();
                    }
                    
                }
                );
                if( $scope.cbh.showSingle){
                    //turn oon the add inventory items
                    $scope.toggleAddData();
                    $scope.cbh.showSingle = false;   
                }
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.undoChanges
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Reset changes on a temporary batch item and re-patch them if necessary back to their original state.
             *
             */
            $scope.undoChanges = function() {
                $scope.compoundBatches.data = angular.copy($scope.compoundBatches.backup);
                var itemsToChange = $scope.cbh.changesToUndo.map(function(item) {
                    return $scope.compoundBatches.data[item[0]]
                });
                //TODO handle error here
                CBHCompoundBatch.patchList({
                    "objects": itemsToChange
                        }, $rootScope.projects).then(function(data) {
                            
                            $scope.compoundBatches.redraw++;
                            $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
                });
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Listens for updates to list view and creates a backup version to use for undo.
             * @param {string} updateListView  The name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("updateListView", function() {
                $scope.compoundBatches.backup = angular.copy($scope.compoundBatches.data);
            });            

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.saveChangesToCompoundDataInController
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Sets up the correct search URL to use for the current parameters and filters (including paging) and carries out the searchvia web service call.
             * After web service calls, results set populated into scope.
             * @param {integer} changes The page number of the results set returned.
             * @param {object} sourceOfChange The currently set search filters on the form.
             *
             */
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
                        //TODO handle error here
                        CBHCompoundBatch.patchList(patchData, $rootScope.projects).then(function(data) {
                           
                        });
                    }
                }


            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.initialise
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Sets up the datasets and filters from the url on page load.
             *
             */
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

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.editModeUnreachable
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * This function works out whether the current loggeed in user can enter edit mode with the currently  selected project.
             * @returns {boolean} boolean Answer to the question "Is edit mode unreachable?"
             *
             */
            $scope.editModeUnreachable = function() {
                if($stateParams.archived == true && !angular.isUndefined($stateParams.archived)){
                    //You can't edit archived items except to
                    //un archive them
                    return true;
                }
                if ($scope.cbh.selected_projects.length == 1){
                    if($scope.cbh.selected_projects[0].editor){
                        return false;
                    }
                }
                return true;
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.cbh.setupParams
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Performs the first params setup on page load. Examines the url to locate search parameters, uses the SearchUrlParamsV2 service 
             * to create a properly encoded url string to use in a web service call in another part of the application. Broadcasts a 
             * searchParamsChanged event.
             *
             */
            $scope.cbh.setupParams = function(){
                
                
                var pf = SearchUrlParamsV2.generate_form($stateParams, $scope.cbh);
                getResultsPage($scope.pagination.current, $stateParams);
                $timeout(function(){
                    
                    $scope.$apply(function(){
                        $rootScope.$broadcast("searchParamsChanged");
                    })
                    
                });

                if ($stateParams.editMode == "true" || $stateParams.editMode == true) {
                    $scope.cbh.editMode = true;
                    if ($scope.editModeUnreachable()) {
                        $scope.cbh.toggleEditMode();
                    }
                } else {
                    $scope.cbh.editMode = false;
                }
                
            }

            $scope.cbh.setupParams();

            /* File attachment functions */
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.success
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Call a POST command to save the uploaded attachment file's URL and unique identifier against the batch record.
             * and also the saved record. This function is injected into the angular schema form file upload widget.
             * @param {object} file  the FlowFile object to be uploaded
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             *
             */
            $scope.success = function(file, form_key) {
                //apply the urls of the flowfile object to the correct custom field of $scope.mol.customFields - find the attachments array and add it
                //put a new method in FlowFileFactory

                //TODO handle error here
                var AttachmentFactory = FlowFileFactory.cbhChemFlowFile;
                AttachmentFactory.get({
                    'identifier': file.uniqueIdentifier
                }, function(data) {
                    //add this to attachments in the form element (find it by form key in mol.customFields)
                    var downloadUri = data.download_uri
                    var attachment_obj = {
                        url: downloadUri,
                        printName: file.name,
                        mimeType: file.file.type,
                    }
                    $scope.newMol.custom_fields[form_key[0]].attachments.push(attachment_obj)

                })

            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.removeFile
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Remove a file from the list of uploaded files on a File Upload field's attachments object. This is to remove it from the display
             * and also the saved record. This function is injected into the angular schema form file upload widget.
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             * @param {integer} index  the position of the upoaded file in the attachments list
             * @param {string} url  the URL fo the file to be used as a condition check for removal.
             *
             */
            $scope.removeFile = function(form_key, index, url) {
                $scope.newMol.custom_fields[form_key[0]].attachments = $filter('filter')($scope.newMol.custom_fields[form_key[0]].attachments, function(value, index) {
                    return value.url !== url; })
            }
            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Compoundbatchv2Ctrl#$scope.sizeCheck
             * @methodOf chembiohubAssayApp.controller:Compoundbatchv2Ctrl
             * @description
             * Check an uploaded file for attachment is less than 20Mb. File is removed from the upload queue if it exceeds this limit.
             * This function is injected into the angular schema form file upload widget.
             * @param {object} file  the FlowFile object to be checked for file size limits
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             * @returns {boolean} boolean  false returned if validation fails
             *
             */
            $scope.sizeCheck = function(file, form_key){
                
                //get the file
                if (file.size > 20000000) {
                    //cancel the file
                    file.flowObj.removeFile(file);
                    //get the form element ad change the validation message, mark as invalid
                    alert("This system has a file size limit of 20Mb per file. Please try with a smaller file.");
                    return false;
                    

                }
                
            }

            
          
            angular.element($window).bind('resize', function() {
                    //On resize we needto go to the underlying controiller to ensure that the whole of the directive is rebuilt
                    //That way the scrollbars will work properly
                    if($state.current.name.indexOf("record") == -1){
                        $scope.$apply(function() {
                            $rootScope.$broadcast("filtersUpdated",{});
                        });
                    }
                   
                });

        }
    ]);