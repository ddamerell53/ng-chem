'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:PlatemapCtrl
 * @description
 * # PlatemapCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
    .controller('PlatemapCtrl', ['$scope', '$rootScope', 'PlateMapFactory', 'ProjectTypeFactory', 'projectFactory', 'urlConfig', '$filter', 'loggedInUser', '$stateParams','$state',
        function($scope, $rootScope, PlateMapFactory, ProjectTypeFactory, projectFactory, urlConfig, $filter, loggedInUser, $stateParams, $state) {
        	/* Setup stuff */
            $scope.newPlateForm = {}
            $scope.schemaFormHolder = {}

            //we need to use the searchform object in order to list UOX IDs for compounds
            //cherry pick the form and schema elements
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
            $scope.uoxFormItem = $filter('filter')($scope.searchFormSchema.form, {
                key: 'related_molregno__chembl__chembl_id__in'
            }, true);
            $scope.refresh = function(schema, options, search) {
                return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
            }
            $scope.uoxFormItem[0].options.async.call = $scope.refresh;

            //we end up passing schemaFormHolder through to the platemap directive
            //so that if this ends up coming from a service we can alter it here
            $scope.schemaFormHolder.new_form = [
                //need: name, plate size, description, plate type
                //choices here hard coded for now
                {
                    "key": "name",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "title": "Plate Name",
                    "required": true,
                }, {
                    "key": "plate_size",
                    "title": "Plate Size",
                    "type": "select",
                    "titleMap": [
                    	{
	                        "value": 96,
	                        "name": "96"
	                    }, {
	                        "value": 48,
	                        "name": "48"
                    	}
                    ],
                    "htmlClass": "col-sm-2",
                    "disableSuccessState": true,
                    "feedback": false

                }, {
                    "key": "description",
                    "title": "Description",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "feedback": false
                }, {
                    "key": "plate_type",
                    "title": "Plate Type",
                    "type": "select",
                    "titleMap": [
                    	{
	                        "value": 'working',
	                        "name": "working"
	                    }, {
	                        "value": 'backup',
	                        "name": "backup"
                    	}
                    ],
                    "htmlClass": "col-sm-2",
                    "disableSuccessState": true,
                    "feedback": false

                },
            ];

            $scope.schemaFormHolder.new_schema = {
                "type": "object",
                "properties": {
                    "name": {
                        "title": "Plate Name",
                        "type": "string",
                        "pattern": "^[a-zA-Z0-9_ /&]*$",
                        "validationMessage": {
                            202: "Only letters, spaces, numbers, dashes, slashes, & signs and underscores in project names"
                        },


                    },
                    "plate_size": {
                        "title": "Plate Size",
                        "type": "int",
                        "default": 96,

                    },
                    "description": {
                        "title": "Description",
                        "type": "string",
                        "pattern": "^[a-zA-Z0-9_ /&]*$",
	                    "disableSuccessState": true,
	                    "feedback": false

                    },
                    "plate_type": {
                        "title": "Plate Type",
                        "type": "string",
                        "default": 'working',

                    },

                    
                }
            }

            $scope.schemaFormHolder.well_form = [
                //need: name, plate size, description, plate type
                //choices here hard coded for now
                {
                    "key": "barcode",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "title": "Barcode ID",
                    "required": true,
                    "feedback": false
                }, {
                    "key": "units",
                    "title": "Units",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "feedback": false

                }, {
                    "key": "conc",
                    "title": "Concentration",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState": true,
                    "feedback": false
                }, $scope.uoxFormItem[0],
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
                    'related_molregno__chembl__chembl_id__in': {
	                    'type': 'array',
	                    'format': 'uiselect',
	                    
	                },

                    
                }
            }

            

            /* Functional Stuff */
            $scope.clearForm = function(form){
            	$scope.newPlateForm = {}
            	form.$setPristine();
            	$scope.showPlate = false;
            }
            $scope.showPlate = false;
            $scope.setupNewPlateFromForm = function(form){

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
            	
            	ProjectTypeFactory.get({"plate_map_project_type": true}, function(data){
                      //$scope.newPlateForm
                      $scope.plateMapType = data.objects[0];
                      //var template = $scope.savedSearchType.project_template;
                      var d = new Date();
                      $scope.plateMapType.project_template.name = $scope.newPlateForm.name + d.getTime().toString();
                      $scope.plateMapType.project_template.custom_field_config.name = $scope.newPlateForm.name + d.getTime().toString();

                        projectFactory.save($scope.plateMapType.project_template, function(data){
                            var resource_uri = data.resource_uri;
                            var plateMapObj = {
                                "project": data.resource_uri,
                                "projectKey": data.project_key,
                                "blindedBatchId": "EMPTY_STRING",
                                //"customFields": $scope.newPlateForm,
                                "customFields": {
                                	"description": $scope.newPlateForm.description,
									"name": $scope.newPlateForm.name,
									"plate_size": $scope.newPlateForm.plate_size,
									"plate_type": $scope.newPlateForm.plate_type,
									"wells": $scope.newPlateForm.wells,
                                },
                                "uncuratedFields":{},
                                "warnings" :{}, 
                                "properties" :{},  
                                "errors" :{}
                            }
                            console.log(plateMapObj)

                            var pmf = PlateMapFactory.list;


                            pmf.save(plateMapObj, function(data){
                                //search is now saved - close the modal
                                //make sure reindex is called on the correct thing within data
                                console.log('inside save');
                                var params = {"id": data.id}

                                $http.post( urlConfig.cbh_plate_map.list_endpoint  + "/reindex_compound/" , params).then(function(da){
                                    $state.go("cbh.listPlates", {
                                       "plate": data.id,
                                    }, {
                                        reload: true,
                                    });
                                })

                                ///if it's worked, redirect to the edit page for this plate.
                                //from there we know we will be patching an existing record.
                                

                            });

                            
                        });

                        
                      });
            }


            /* Listings page code */
            $scope.loadPlateMaps = function(){
	            var params = {'creator_uri': loggedInUser.resource_uri};


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
            	
            	var pmf = PlateMapFactory.list;

                pmf.update({ customFields : $scope.editingPlate, projectKey: fullPlateObj[0].projectfull.project_key, id: $scope.editingPlateId }, function(data){
                    //search is now saved - close the modal
                    //make sure reindex is called on the correct thing within data
                    var params = {"id": data.id}

                    $http.post( urlConfig.cbh_plate_map.list_endpoint  + "/reindex_compound/" , params)

                });

            }
        }
    ]);