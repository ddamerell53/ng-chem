'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddDataCtrl
 * @description
 * # AddDataCtrl
 * Controller of the ngChemApp. Used to control addition functions within the app. There are equivalents for Viewing and Editing data
 */
angular.module('chembiohubAssayApp')
  .controller('AddDataCtrl',['$scope', '$stateParams', '$resource', 'AddDataFactory', function ($scope, $stateParams, $resource, AddDataFactory) {

  	//we need:
  	var addctrl = this;
  	//method to generate the form for a given level of a given datapoint classification
  	addctrl.getForm = function(dc, level) {
  		console.log("dc is ", dc);
  		console.log("level is ", level);

  		//setting a test flag to use the hardcoded json we have to build the forms.
  		var testFlag = true;

  		$scope.dc = dc;
  		$scope.lev = level;

  		//$scope.ws_data = AddDataFactory.dataClassification.get({'dc': dc});

  		//manipulate this to get the appropriate form elements

  		//may need to have more than one form - put into an object and use ng-repeat to create new forms

  		$scope.test_ws_data = {
		    "created": "2015-08-13T09:48:17.879682",
		    "created_by": {
		        "date_joined": "2015-02-23T10:34:11",
		        "first_name": "",
		        "id": 1,
		        "is_staff": true,
		        "is_superuser": true,
		        "last_login": "2015-08-13T04:49:22.465231",
		        "last_name": "",
		        "resource_uri": "/test/api/users/1",
		        "username": "andy"
		    },
		    "data_form_config": "/test/api/datastore/cbh_data_form_config/5",
		    "description": null,
		    "id": 3,
		    "l0": "/test/api/datastore/cbh_datapoints/2",
		    "l0_permitted_projects": [],
		    "l1": "/test/api/datastore/cbh_datapoints/3",
		    "l2": "/test/api/datastore/cbh_datapoints/4",
		    "l3": "/test/api/datastore/cbh_datapoints/1",
		    "l4": "/test/api/datastore/cbh_datapoints/1",
		    "modified": "2015-08-13T09:48:17.880126",
		    "resource_uri": "/test/api/datastore/cbh_datapoint_classifications/3"
		};

		$scope.test_level_datapoint = {
		    "created": "2015-08-13T09:39:43.650658",
		    "created_by": {
		        "date_joined": "2015-02-23T10:34:11",
		        "first_name": "",
		        "id": 1,
		        "is_staff": true,
		        "is_superuser": true,
		        "last_login": "2015-08-13T04:49:22.465231",
		        "last_name": "",
		        "resource_uri": "/test/api/users/1",
		        "username": "andy"
		    },
		    "custom_field_config": "/test/api/datastore/cbh_custom_field_config/106",
		    "id": 2,
		    "modified": "2015-08-13T09:39:43.651076",
		    "project_data": {
		        "Abstract": "Biiiiiiiiiiiiiiig abstract",
		        "Project Id": "ttest"
		    },
		    "resource_uri": "/test/api/datastore/cbh_datapoints/2",
		    "supplementary_data": {}
		};

		//need a model for json_schem_form to be able to use to populate data
		//$scope.test_model = $scope.test_level_datapoint.project_data;
		$scope.test_model = {'project_data': {} };

		//Because this is an addition controller, we start with an empty data model.

		//If this was an editing controller, you could initialise the data model like so:
		//$scope.test_model = {'project_data': $scope.test_level_datapoint.project_data };


		//do we have a level specified? If so, we need to pull in data from the specified level 
		//and then pull the custom field config from that to generate the form.

		//we also need to pull in the next level above as a viewing data thing to provide context for the form you are filling in.

		if(level) {
			//var level_data = AddDataFactory.level.get({'lev': level});
			//use a resource call to pull in the correct level
			//needs prefix adding
			if(!testFlag){
				var level_datapoint = $resource($scope.ws_data[level], {});	
			}
			else {
				var level_datapoint = $scope.test_level_datapoint;
			}
			
			//now get the custom field config from this datapoint
			if(!testFlag){
				var custom_field_config = $resource(level_datapoint['custom_field_config'], {});	
			}
			else {
				var custom_field_config = AddDataFactory.test_cfg;
			}
			
			

			//now map the field in the edit forms and edit schemas into form and schema which the json_schema_form library can use.
			$scope.edit_form =  []
			$scope.edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
			$scope.addition_name = custom_field_config.name;
			angular.forEach(custom_field_config.project_data_fields, function(proj_data){
				//pull out the edit_form.form and edit_schema.schema
							
				$scope.edit_form.push(proj_data.edit_form.form[0]);
				angular.extend($scope.edit_schema.properties, proj_data.edit_schema.properties)


			}) 

		}

  		//uses a service to retrieve the necessary data
  		//services wil be based around the api/rest types of call
  		var someData = {};
  		//return someData;
  	}

  	addctrl.submitForm = function() {
  		//need the top level webservice data in order to be able to submit
  		//we make a post request to the correct webservice
  		//should be a simple one-line statement...

  		//then redirect to view this data in a non-edit page, with an edit button for them to make changes, which takes them to the edit page.
  		AddDataFactory.level.post(level_datapoint);
  	}

  	//method to send this data to the appropriate post endpoint with a new ID (instead of the default "1") (this point may happen in the service or even at the backend?)

  	addctrl.getForm($stateParams.dc, $stateParams.lev);

    
  }]);
