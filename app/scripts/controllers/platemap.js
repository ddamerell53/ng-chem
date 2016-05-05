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
    .controller('PlatemapCtrl', ['$scope', '$rootScope', 'urlConfig', '$filter', 'loggedInUser', '$stateParams','$state', 'projectKey', 'projectList', 'CBHCompoundBatch',
        function($scope, $rootScope, urlConfig, $filter, loggedInUser, $stateParams, $state, projectKey, projectList, CBHCompoundBatch) {
        	/* Setup stuff */
            angular.forEach(projectList.objects, function(myproj) {
                if (myproj.project_key === projectKey) {
                    $scope.projectObj = myproj;
                }
            });
            $scope.newPlateForm = {}
            $scope.schemaFormHolder = {}

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
            
            

            //$scope.schemaFormHolder.required=[]
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
                        'title' : 'Pick from list',
                        'key' : 'uuid', 
                        'knownBy' : 'uuid', 
                        "htmlClass": "col-sm-6",
                        "onChange": "updated(modelValue,form)",
                        "disableSuccessState":true,
                        "feedback": true,
                        "type" : "filtereddropdown",
                        "options":{
                          "tagging" : true,
                          "fetchDataEventName" : "openedSearchDropdown",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }


                        
                    },
            ];

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
                          "fetchDataEventName" : "openedSearchDropdown",
                          "dataArrivesEventName" : "autoCompleteData",
                          "multiple" : false,
                          "staticItems" : []
                        }

                    },

                    
                },
                "required":[]
            }

            

            /* Functional Stuff */
            $scope.clearForm = function(form){
            	$scope.newPlateForm = {}
            	form.$setPristine();
            	$scope.showPlate = false;
            }
            $scope.showPlate = false;
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

            //we need two different functions for the save action when saving a plate
            //when we have a new plate from scratch, we want to create it in the DB
            //when we are editing a plate, we want to patch the plate
            //pass this function to the directive for the appropriate page
            $scope.saveWholePlate = function(){
            	
                //TODO handle error here

                //proid in this case is from the
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

            $scope.cbh.changeSearchParams = function(newParams, notify) {
                //General function to search and move to a new URL
                
                $state.params = newParams;
                $stateParams = newParams;
                // $location.search(newParams);
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
                //getResultsPage($scope.pagination.current, newParams);
            }


            /* Listings page code */
            $scope.loadPlateMaps = function(){
                //add a project type filter within the params
	            var params = {'pids': $scope.projectObj.id};

                var filters = angular.copy($stateParams);
                

                $scope.cbh.changeSearchParams(filters);
                filters = angular.copy($stateParams);
                if(!filters.page){
                    filters.page = 1;
                }
                filters.limit = $scope.batchesPerPage;
                filters.offset = (filters.page - 1) * 5;
                filters.pids = $scope.projectObj.id;
                CBHCompoundBatch.queryv2(filters).then(function(data) {
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

            /* 
            When we create a new plate, we need to set that plate for editing
            */
            $scope.loadPlateSpecifiedInUrl = function(){
                $scope.loadPlateForEditing(parseInt($stateParams.plate));
            }

            //fetch the whole plate to put into the form for editing.
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

            /* pagination function */
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
        }
    ]);