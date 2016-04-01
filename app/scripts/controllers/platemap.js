'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:PlatemapCtrl
 * @description
 * # PlatemapCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
    .controller('PlatemapCtrl', ['$scope', '$rootScope', 'urlConfig', '$filter', 'loggedInUser', '$stateParams','$state', 'projectKey', 'projectList', 'CBHCompoundBatch',
        function($scope, $rootScope, urlConfig, $filter, loggedInUser, $stateParams, $state, projectKey, projectList, CBHCompoundBatch) {
        	/* Setup stuff */
            angular.forEach(projectList.objects, function(myproj) {
                if (myproj.project_key === projectKey) {
                    $scope.projectObj = myproj;
                    console.log("project is", $scope.projectObj);
                }
            });
            $scope.newPlateForm = {}
            $scope.schemaFormHolder = {}

            //we need to use the searchform object in order to list UOX IDs for compounds
            //cherry pick the form and schema elements
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
            //this needs replacing with the new 'staticItems' for the pick from list widget

            //we end up passing schemaFormHolder through to the platemap directive
            //so that if this ends up coming from a service we can alter it here
            

            $scope.schemaFormHolder.required=[]
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


            	console.log('validation happening')
            	if(form.$valid && $scope.newPlateForm.name != "" && !form.$pristine){
                    //build the well objects
                    console.log('valid form')
                    $scope.showPlate = true;
                    $scope.errormess = "";
	            	//being done in directive
	            	//buildPlate($scope.newPlateForm)
                }
                else if(form.$pristine){
                	console.log('invalid form')
                    $scope.errormess = "You must add a Plate Name";
            
                }

            	
            	

            }

            //we need two different functions for the save action when saving a plate
            //when we have a new plate from scratch, we want to create it in the DB
            //when we are editing a plate, we want to patch the plate
            //pass this function to the directive for the appropriate page
            $scope.saveWholePlate = function(){
            	
                //TODO handle error here

                            //proid in this case is from the
                            console.log($scope.newPlateForm); 
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
                            //console.log(plateMapObj)

                           CBHCompoundBatch.saveSingleCompound(plateMapObj).then(function(data){
                                console.log(data);
                                //forward to list?
                           });
                            
                  
                        
                      
            }


            /* Listings page code */
            $scope.loadPlateMaps = function(){
                //add a project type filter within the params
	            var params = {'creator_uri': loggedInUser.resource_uri};

                //TODO handle error here
                
                //this needs changing as plates are now batches rather than projects - 
                //replicate the CompoundBatch retrieval here for the given project

                //need to use the new search API - build the correct query etc
                //should this just be adapted from the current search controller? we are now looking for batches after all.
	            $http.get( urlConfig.cbh_plate_map.list_endpoint  + "/get_list_elasticsearch/", {'params': params}).then(function(data){
	                
	                $scope.plates = data.data.objects;
	                $scope.$apply();
	                if($stateParams.plate){
                        console.log('plate found in url')
                        console.log("$scope.plates",$scope.plates)
                        $scope.loadPlateSpecifiedInUrl();
                        
                    }
                    else{
                        console.log('Cant find plate', $stateParams)
                    }
	            });
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

	        $scope.loadPlateForEditing = function(plateId){
	        	//find the plate in the list
	        	var fullPlateObj = $filter('filter')($scope.plates, {
	                id: plateId
	            }, true);
	            //set a flag to say the plate template should be shown
                //this now needs changing because multiple plates per project. Need the batch ID to retrieve the plate
	            $scope.editingPlate = fullPlateObj[0].customFields
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
            	//find the one we want
            	var fullPlateObj = $filter('filter')($scope.plates, {
	                id: $scope.editingPlateId
	            }, true);
	            
	            //edit the cutom fields from the plate form
	            fullPlateObj[0].customFields = $scope.editingPlate            	
            	
                //this needs to be changed to use compound batch instead? Maybe not as long as the project key is correct
            	var pmf = PlateMapFactory.list;
                //TODO handle error here
                pmf.update({ customFields : $scope.editingPlate, projectKey: projectKey, id: $scope.editingPlateId }, function(data){
                    //search is now saved - close the modal
                    //make sure reindex is called on the correct thing within data
                    var params = {"id": data.id}

                    $http.post( urlConfig.cbh_plate_map.list_endpoint  + "/reindex_compound/" , params)

                });

            }
        }
    ]);