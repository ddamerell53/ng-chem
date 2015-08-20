'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddDataCtrl
 * @description
 * # AddDataCtrl
 * Controller of the ngChemApp. Used to control addition functions within the app. There are equivalents for Viewing and Editing data
 */
angular.module('chembiohubAssayApp')
  .controller('EditDataCtrl',['$scope', '$stateParams', '$resource', 'AddDataFactory', function ($scope, $stateParams, $resource, AddDataFactory) {

  	//we need:
  	var editctrl = this;
  	//method to generate the form for a given level of a given datapoint classification
  	editctrl.getForm = function(dc, level) {
  		console.log("dc is ", dc);
  		console.log("level is ", level);

  		//setting a test flag to use the hardcoded json we have to build the forms.
  		var testFlag = false;

  		$scope.dc_data = {};
  		$scope.clone = {};
  		$scope.level_datapoint = {};
  		$scope.test_model = {'project_data': {} };
  		var AddDF = AddDataFactory.dataClassification;
  		var level_uri = "";

  		var adfresult = AddDF.get({'dc': dc});
  		adfresult.$promise.then(function(result){
  			$scope.dc_data = angular.copy(result);
  			$scope.clone = angular.copy(result);
  			console.log($scope.clone);
  			
  			//we now need to reset three variables - the dataclassification URI, the level URI and the dataclassification ID
  			//this will ensure that when we post back, we will have new objects created and associated with that dataClassification
  			
  			//we're editing so we don't need to delete these
			//we will be PATCHing instead of POSTing data
  			//$scope.clone['resource_uri'] = null;
	  		$scope.clone[level] = "";
	  		//$scope.clone['id'] = null;

	  		//retain the uri of the level we need 
	  		level_uri = $scope.dc_data[level];
  			console.log('level_uri', level_uri);

  			if(level) {
				//var level_data = AddDataFactory.level.get({'lev': level});
				//use a resource call to pull in the correct level
				//needs prefix adding
				if(!testFlag){
					var level_datapoint_resource = $resource(level_uri, {});
					var level_promise = level_datapoint_resource.get();
					level_promise.$promise.then(function(result){

						//we're editing so we don't need to delete these
						//we will be PATCHing instead of POSTing data
						/*$scope.level_datapoint = result;
				        $scope.level_datapoint.id=null;
				        $scope.level_datapoint.resource_uri = null;*/

				        $scope.test_model = {'project_data': $scope.level_datapoint.project_data };
						//now get the custom field config from this datapoint
						var custom_field_config_res = $resource(result['custom_field_config'], {});
						var custom_field_config_promise = custom_field_config_res.get();
						custom_field_config_promise.$promise.then(function(res){
							$scope.custom_field_config = res
							$scope.edit_form =  []
							$scope.edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
							$scope.addition_name = $scope.custom_field_config.name;
							angular.forEach($scope.custom_field_config.project_data_fields, function(proj_data){
								//pull out the edit_form.form and edit_schema.schema
											
								$scope.edit_form.push(proj_data.edit_form.form[0]);
								angular.extend($scope.edit_schema.properties, proj_data.edit_schema.properties)


							});
						});
					});
				}
				else {
					var level_datapoint = $scope.test_level_datapoint;
				}
								 

			}
  		});

		//TODO - we also need to pull in the next level above as a viewing data thing to provide context for the form you are filling in.

		
  	}

  	editctrl.submitForm = function() {
  		//need the top level webservice data in order to be able to submit
  		//we make a post request to the correct webservice
  		//should be a simple one-line statement...

  		//add the form data to the level datapoint being changed
  		$scope.level_datapoint.project_data = $scope.test_model.project_data;
  		
  		//add the level datapoint to the datapoint classification it belongs to
  		$scope.clone[$stateParams.lev] = $scope.level_datapoint;

  		//need to PATCH instead of POST
  		//update() is a method defined in the AddDataFactory class
  		//which specifies that PATCH should be used instead of POST
  		$scope.clone.$update({dc: $stateParams.dc});


  	}

  	editctrl.clearForm = function() {
  		$scope.test_model = {'project_data': {} };
  	}

  	editctrl.getForm($stateParams.dc, $stateParams.lev);

    
  }]);
