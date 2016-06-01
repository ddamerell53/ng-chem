'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:PlatemapCtrl
 * @description
 * # PlatemapCtrl
 * This is used to control Plate Map functionality - users can define some required parameters to set up their plate, then sequentially add data to each well. 
 * It is intended to link added records by their system ID to a particular plate for an overview.
 */
angular.module('chembiohubAssayApp')
    .controller('PlatemapCtrl', ['$scope', '$rootScope', 'urlConfig', '$filter', 'loggedInUser', '$stateParams','$state', 'projectKey', 'projectList', 'CBHCompoundBatch', 'SearchUrlParamsV2', 'PlateMapFactory',
        function($scope, $rootScope, urlConfig, $filter, loggedInUser, $stateParams, $state, projectKey, projectList, CBHCompoundBatch, SearchUrlParamsV2, PlateMapFactory) {
        	/* Setup stuff */
            angular.forEach(projectList.objects, function(myproj) {
                if (myproj.project_key === projectKey) {
                    $scope.projectObj = myproj;
                }
            });
            $scope.newPlateForm = {};
            $scope.schemaFormHolder = {};
            $scope.plateSearchForm = {};

            //we need to use the searchform object in order to list UOX IDs for compounds
            //cherry pick the form and schema elements
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);

            var plateForm = angular.copy($scope.projectObj.schemaform.form);

            $scope.projectObj.schemaform.schema.required = ['Name', 'Plate Size', 'Plate Type']

            angular.forEach($scope.projectObj.schemaform.form, function(item) {
                        item['feedback'] = "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }";
                        item['disableSuccessState'] = true;

                    });

            //this needs replacing with the new 'staticItems' for the pick from list widget

            //we end up passing schemaFormHolder through to the platemap directive
            //so that if this ends up coming from a service we can alter it here

            $scope.pagination = {"current": 1
                                    };

            $scope.batchesPerPage = 5;
            
            

            /**
             * @ngdoc property
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.schemaFormHolder.well_form
             * @propertyOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Form definition for the angular schema form for an individual plate well.
             *
             */
            $scope.schemaFormHolder.well_form = [
                //need: name, plate size, description, plate type
                //choices here hard coded for now
                {
                    "key": "barcode",
                    "knownBy": "barcode",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "title": "Barcode ID",
                    "required": true,
                    "feedback": false
                }, {
                    "key": "units",
                    "knownBy": "units",
                    "title": "Units",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "feedback": false

                }, {
                    "key": "conc",
                    "knownBy": "conc",
                    "title": "Concentration",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "feedback": false
                }, 
                { 
                        'title' : 'ChemBio Hub ID',
                        'key' : 'uuid', 
                        'knownBy' : 'uuid', 
                        "htmlClass": "col-sm-6",
                        "onChange": "updated(modelValue,form)",
                        "disableSuccessState":true,
                        "feedback": true,
                        "type" : "filtereddropdown",
                        "options":{
                          "tagging" : true,
                          "fetchDataEventName" : "openedSearchDropdownWell",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }


                        
                    },
                { 
                        'title' : 'SGC Global ID',
                        'key' : 'sgcglobalid', 
                        'knownBy' : 'sgcglobalid', 
                        "htmlClass": "col-sm-6",
                        "onChange": "updated(modelValue,form)",
                        "disableSuccessState":true,
                        "feedback": true,
                        "type" : "filtereddropdown",
                        "options":{
                          "tagging" : true,
                          "fetchDataEventName" : "openedSearchDropdownSGC",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }


                        
                    },
            ];

            /**
             * @ngdoc property
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.schemaFormHolder.well_schema
             * @propertyOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Schema definition for the angular schema form for an individual plate well.
             *
             */
            $scope.schemaFormHolder.well_schema = {
                "type": "object",
                "properties": {
                    "barcode": {
                        "title": "Barcode ID",
                        "type": "string",
                        "pattern": "^[a-zA-Z0-9_ /&]*$",
                        "validationMessage": {
                            202: "Only letters, spaces, numbers, dashes, slashes, & signs and underscores in project names"
                        },

                    },
                    "units": {
                        "title": "Units",
                        "type": "string"
                    },
                    "conc": {
                        "title": "Concentration",
                        "type": "string",
                        "pattern": "^[a-zA-Z0-9_ /&]*$",
	                    "disableSuccessState": true,
	                    "feedback": false

                    },
                    "uuid":{
                      "type" : "filtereddropdown",
                      "items": {
                        "type": "string"
                      },
                      'format': "filtereddropdown",
                      "default" : [],
                      "options":{
                          "tagging" : true,
                          "fetchDataEventName" : "openedSearchDropdownWell",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }

                    },
                    "sgcglobalid":{
                      "type" : "filtereddropdown",
                      "items": {
                        "type": "string"
                      },
                      'format': "filtereddropdown",
                      "default" : [],
                      "options":{
                          "tagging" : true,
                          "fetchDataEventName" : "openedSearchDropdownSGC",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }

                    },

                    
                },
                "required":[]
            }

            /**
             * @ngdoc property
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.schemaFormHolder.well_schema
             * @propertyOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Form definition for the angular schema form for narrowing down the platemap list based on a CBH ID or SGCOxford ID.
             *
             */
            $scope.schemaFormHolder.plate_search_form = [
                { 
                        'title' : 'Choose a UOX ID',
                        'key' : 'uuidglobal', 
                        'knownBy' : 'uuidglobal', 
                        "htmlClass": "col-xs-3",
                        "onChange": "updated(modelValue,form)",
                        "disableSuccessState":true,
                        "feedback": true,
                        "type" : "filtereddropdown",
                        "options":{
                          "tagging" : false,
                          "fetchDataEventName" : "openedSearchDropdown",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }


                        
                    },
                    {
                    "key": "oxid",
                    "knownBy": "oxid",
                    "title": "SGC Oxford ID",
                    "htmlClass": "col-xs-3",
                    "disableSuccessState": true,
                    "feedback": false

                }

            ];

            /**
             * @ngdoc property
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.schemaFormHolder.well_schema
             * @propertyOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Schema definition for the angular schema form for narrowing down the platemap list based on a CBH ID or SGCOxford ID.
             *
             */
            $scope.schemaFormHolder.plate_search_schema = {
                "type": "object",
                "properties": {
                    
                    "uuidglobal":{
                      "type" : "filtereddropdown",
                      "items": {
                        "type": "string"
                      },
                      'format': "filtereddropdown",
                      "default" : [],
                      "options":{
                          "tagging" : false,
                          "fetchDataEventName" : "openedSearchDropdown",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }

                    },
                    "oxid": {
                        "title": "SGC Oxford ID",
                        "type": "string"
                    },

                    
                },
                "required":[]
            };            

            /* Functional Stuff */

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.clearForm
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Remove all information from the specified plate form and reset to pristine state.
             * @param {object} form  the form object to be reset to a pristine state
             *
             */
            $scope.clearForm = function(form){
            	$scope.newPlateForm = {}
            	form.$setPristine();
            	$scope.showPlate = false;
            }

            $scope.showPlate = false;

            $scope.showSearchFormInstead = function(){
              $scope.showEditingForm = false;
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.setupNewPlateFromForm
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Validates the form for setting up a new plate and sets thee sshowPlate flag to true, which unhides the plate graphic.
             * Parameters are then passed through to the platemap directive directly and held in scope here.
             * @param {object} form  the form object used to set up a new plate.
             *
             */
            $scope.setupNewPlateFromForm = function(form){

                //the form now comes from the current project's custom field config
                $scope.errormess = "";
            	  if(form.$valid && $scope.newPlateForm["Name"] != "" && $scope.newPlateForm["Plate Size"] != "" && $scope.newPlateForm["Plate Type"] != "" && !form.$pristine){
                    //build the well objects
                    $scope.showPlate = true;
                    $scope.errormess = "";
	            	//being done in directive
	            	//buildPlate($scope.newPlateForm)
                }
                else if(form.$pristine){
                    $scope.errormess = "You must add some details";
            
                }
                else if(form.$error){
                    
                    if($scope.newPlateForm["Name"] == ""){
                        $scope.errormess = $scope.errormess + "Name, ";
                    }
                    if(!$scope.newPlateForm["Plate Size"]){
                        $scope.errormess = $scope.errormess + "Plate Size, ";
                    }
                    if($scope.newPlateForm["Plate Type"] == ""){
                        $scope.errormess = $scope.errormess + "Plate Type ";
                    }
                    $scope.errormess = $scope.errormess + "cannot be empty.";

                }
                else {
                    $scope.errormess = "Some other error";
                }

            	
            	

            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.saveWholePlate
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * We need two different functions for the save action when saving a plate. 
             * When we have a new plate from scratch, we want to create it in the DB. 
             * When we are editing a plate, we want to patch the plate. 
             * Create a plate object from the current form so that when it is saved using the batch mechanism, it is patched if appropriate.
             * Pass this function to the directive for the appropriate page. 
             *
             */
            $scope.saveWholePlate = function(){
            	
                //TODO handle error here
                var plateMapObj = {
                    "project": {"pk": $scope.projectObj.id},
                    "blinded_batch_id": "EMPTY_STRING",
                    //"customFields": $scope.newPlateForm,
                    "custom_fields": {
                    	"Description": $scope.newPlateForm['Description'],
          						"Name": $scope.newPlateForm['Name'],
          						"Plate Size": $scope.newPlateForm['Plate Size'],
          						"Plate Type": $scope.newPlateForm['Plate Type'],
          						"wells": $scope.newPlateForm.wells,
                    },
                    "uncurated_fields":{},
                    "warnings" :{}, 
                    "properties" :{},  
                    "errors" :{}
                }

               CBHCompoundBatch.saveSingleCompound(plateMapObj).then(function(data){
                    $scope.plateSaved = true;
                    //forward to list?
                    $state.go("cbh.projects.project.listplates", {"projectKey": projectKey});
               });
                                 
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.cbh.changeSearchParams
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Overrides a global cbh method for searching and moving to a new URL
             * @param {object} newParams Search parameters to use for this page transition
             * @param {boolean} notify not used - defaults to false in this instance
             *
             */
            $scope.cbh.changeSearchParams = function(newParams, notify) {
                //General function to search and move to a new URL
                
                $state.params = newParams;
                $stateParams = newParams;
                
                $state.go($state.current, newParams, {
                    // prevent the events onStart and onSuccess from firing
                    notify: false,
                    // prevent reload of the current state
                    reload: false,
                    // replace the last record when changing the params so you don't hit the back button and get old params
                    location: 'replace',
                    // inherit the current params on the url
                    inherit: true
                });
                
            }

            /* Listings page code */

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.loadPlateMaps
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Fetch the list of all platemaps for the given project (via URL). This includes any paging or search parameters that may be set.
             *
             */
            $scope.loadPlateMaps = function(){

                //has the user specified a UOX ID to narrow down the plates with?
                console.log("loadPlateMaps", $scope.plateSearchForm);
                if(typeof $scope.plateSearchForm.uuidglobal === "string"){
                    //tried setting up a textsearch to see if the uuid is anywhere in the object - 
                    //needed config adding to the elasticsearch client and also adding to the indexed fields list in base.py
                    var filters = angular.copy($stateParams);
                    filters = SearchUrlParamsV2.get_textsearch_params(filters, $scope.plateSearchForm.uuidglobal);

                }
                else if($scope.plateSearchForm.oxid){
                  console.log("found oxid");
                    var filters = angular.copy($stateParams);
                    filters = SearchUrlParamsV2.get_textsearch_params(filters, $scope.plateSearchForm.oxid);
                }
                else {
                    var filters = angular.copy($stateParams);
                    filters.textsearch = undefined;
                }

                
                $scope.cbh.changeSearchParams(filters, false);
                filters = angular.copy($stateParams);
                if(!filters.page){
                    filters.page = 1;
                }
                filters.limit = $scope.batchesPerPage;
                filters.offset = (filters.page - 1) * 5;
                filters.pids = $scope.projectObj.id;
                
                
                var pmf = PlateMapFactory.list;
                pmf.get(filters, function(data){
                    //search is now saved - close the modal
                    //make sure reindex is called on the correct thing within data
                    $scope.totalCount = data.meta.total_count;
                    $scope.plates = data.objects;
                    //$scope.$apply();
                    if($stateParams.plate){
                        $scope.loadPlateSpecifiedInUrl();
                        
                    }

                });

                //TODO handle error here
	        };


	        $scope.editingPlate = {}
	        $scope.showEditingForm = false;
	        $scope.editingPlateId = 0

            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.cbh.loadPlateSpecifiedInUrl
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Load the specified plate - batch id from URL - into the platemap directive form for editing.
             *
             */
            $scope.loadPlateSpecifiedInUrl = function(){
                $scope.loadPlateForEditing(parseInt($stateParams.plate));
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.cbh.loadPlateSpecifiedInUrl
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Load the specified plate - batch id from URL - into the platemap directive form for editing.
             *
             */
	        $scope.loadPlateForEditing = function(plateId){
	        	//find the plate in the list
                $scope.plateSaved = false;
	        	var fullPlateObj = $filter('filter')($scope.plates, {
	                id: plateId
	            }, true);
	            //set a flag to say the plate template should be shown
                //We have multiple plates per project. Need the batch ID to retrieve the plate
	            $scope.editingPlate = fullPlateObj[0].custom_fields
	            $scope.editingPlateId = plateId;
	        	$scope.showEditingForm = true;
	        	
	        	//set it as the plate model for the plate map template
	        	//convert wells from string to json
	        	var wellsObj = angular.fromJson($scope.editingPlate.wells)
	        	$scope.editingPlate['wells'] = {}
	        	$scope.editingPlate['wells'] = angular.copy(wellsObj);
	        	//this is now being done in the directive
	        	
	        }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.patchWholePlate
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Send whole plate, including associated wells, to the batch mechanissm for patching to save.
             * Sets the scope flaag plateSaved for confirmation in user interface.
             *
             */
            $scope.patchWholePlate = function(){
            	//$scope.plates has all the plates
            	//find the one we want as specified by editingPlateId
            	var fullPlateObj = $filter('filter')($scope.plates, {
	                id: $scope.editingPlateId
	            }, true);
	            
	            //edit the cutom fields from the plate form
	            fullPlateObj[0].custom_fields = $scope.editingPlate            	
            	
                //Think I need to change this to use the CBHCompoundBatch method (like saving a plate now does)
            	
                CBHCompoundBatch.patch(fullPlateObj[0]).then(function(data) {
                    //do anything here? Success message of some description
                    $scope.plateSaved = true;
                });

            }

            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:PlatemapCtrl#$scope.pageChanged
             * @methodOf chembiohubAssayApp.controller:PlatemapCtrl
             * @description
             * Pagination function for the plate list
             * Sets the scope flaag plateSaved for confirmation in user interface.
             * @param {integer} newPage the page defining the subset of results to show (based on items per page)
             *
             */
            $scope.pageChanged = function(newPage) {
                $scope.plateSaved = false;
                var newParams = angular.copy($stateParams);
                newParams.page = newPage;
                newParams.compoundBatchesPerPage = $scope.batchesPerPage;
                //newParams.limit = 5
                //newParams.offset = (newPage - 1) * 5;
                $stateParams = newParams
                $scope.loadPlateMaps();
                //do the search here

            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.directive:platemap#$scope.$on
             * @methodOf chembiohubAssayApp.directive:platemap
             * @description
             * This function pulls back the dropdown autocomplete data from the back end and sends it to the appropriate directive via a broadcast
             * @param {string} openedSearchDropdown  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedSearchDropdown", function(event, args){
                //getting compounds rather than platemaps
                var filters = angular.copy($stateParams);
                //call to fetch uuid autocomplete results looks like this:
                //http://localhost:9000/dev/cbh_compound_batches_v2?autocomplete=&autocomplete_field_path=uuid&compoundBatchesPerPage=50&encoded_query=W10%3D&limit=50&offset=0&page=1&pids=3
                filters.autocomplete_field_path = 'uuid';
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    //this is broadcasting to a dynamic $on method within the pickfromlist widget (within cbh_angular_schema_form_extension.js)
                    //which is why if you look for the braodcast name elsewhere you won't find it.
                    //it looks for the name defined in dataArrivesEventName within the schema form element
                    $rootScope.$broadcast("autoCompleteData", result);
                    //also broadcast a page changed event which will pick up paging data as well?
                });
                
            });

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.directive:platemap#$scope.$on
             * @methodOf chembiohubAssayApp.directive:platemap
             * @description
             * This function pulls back the dropdown autocomplete data from the back end and sends it to the appropriate directive via a broadcast
             * @param {string} openedSearchDropdownWell  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedSearchDropdownWell", function(event, args){
                //getting compounds rather than platemaps
                var filters = angular.copy($stateParams);
                //call to fetch uuid autocomplete results looks like this:
                //http://localhost:9000/dev/cbh_compound_batches_v2?autocomplete=&autocomplete_field_path=uuid&compoundBatchesPerPage=50&encoded_query=W10%3D&limit=50&offset=0&page=1&pids=3
                filters.autocomplete_field_path = 'uuid';
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    //this is broadcasting to a dynamic $on method within the pickfromlist widget (within cbh_angular_schema_form_extension.js)
                    //which is why if you look for the braodcast name elsewhere you won't find it.
                    //it looks for the name defined in dataArrivesEventName within the schema form element
                    $rootScope.$broadcast("autoCompleteData", result);
                    //also broadcast a page changed event which will pick up paging data as well?
                });
                
            });
            
            /**
             * @ngdoc method
             * @name chembiohubAssayApp.directive:platemap#$scope.$on
             * @methodOf chembiohubAssayApp.directive:platemap
             * @description
             * This function pulls back the dropdown autocomplete data from the back end and sends it to the appropriate directive via a broadcast
             * @param {string} openedSearchDropdownSGC  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedSearchDropdownSGC", function(event, args){
                //getting compounds rather than platemaps
                var filters = angular.copy($stateParams);
                //call to fetch uuid autocomplete results looks like this:
                //http://localhost:9000/dev/cbh_compound_batches_v2?autocomplete=&autocomplete_field_path=uuid&compoundBatchesPerPage=50&encoded_query=W10%3D&limit=50&offset=0&page=1&pids=3
                filters.autocomplete_field_path = 'custom_fields.SGCGlobalID';
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    //this is broadcasting to a dynamic $on method within the pickfromlist widget (within cbh_angular_schema_form_extension.js)
                    //which is why if you look for the braodcast name elsewhere you won't find it.
                    //it looks for the name defined in dataArrivesEventName within the schema form element
                    $rootScope.$broadcast("autoCompleteData", result);
                    //also broadcast a page changed event which will pick up paging data as well?
                });
                
            });

            $scope.$watch('plateSearchForm.uuidglobal', function(newValue, oldValue){
                $scope.loadPlateMaps();
                
            }, true);

            $scope.$watch('plateSearchForm.oxid', function(newValue, oldValue){
                $scope.loadPlateMaps();
                
            }, true);
        }
    ]);