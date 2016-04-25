'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:AddDataCtrl
 * @description
 * # AddDataCtrl
 * Controller of the chembiohubAssayApp. Used to control addition functions within the app. There are equivalents for Viewing and Editing data
 */
angular.module('chembiohubAssayApp')
  .controller('AddDataCtrl',['$scope', '$stateParams', '$resource', 'AddDataFactory', function ($scope, $stateParams, $resource, AddDataFactory) {

                $scope.cbh.appName = "AssayReg";

  	//we need:
  	var addctrl = this;
  	//method to generate the form for a given level of a given datapoint classification
  	addctrl.getForm = function(dc, level, data_form_id) {
  		console.log("dc is ", dc);
  		console.log("level is ", level);
      var res;
            angular.forEach($scope.assayctrl.proj.enabled_forms, function(form){
              if (form.id == data_form_id){
                res = form[level];

              }

            });

  		//setting a test flag to use the hardcoded json we have to build the forms.
  		var testFlag = false;

  		$scope.dc_data = {};
  		$scope.clone = {};
      $scope.level_datapoint = {};
  		$scope.context_datapoint = {};
  		$scope.test_model = {'project_data': {} };
  		var AddDF = AddDataFactory.dataClassification;
  		var level_uri = "";

  		var adfresult = AddDF.get({'dc': dc});
  		adfresult.$promise.then(function(result){
  			$scope.dc_data = angular.copy(result);
  			$scope.clone = angular.copy(result);
  			
  			//we now need to reset three variables - the dataclassification URI, the level URI and the dataclassification ID
  			//this will ensure that when we post back, we will have new objects created and associated with that dataClassification
  			
  			$scope.clone['resource_uri'] = null;
	  		$scope.clone[level] = "";
	  		$scope.clone['id'] = null;
	  		//retain the uri of the level we need 
	  		level_uri = $scope.dc_data[level];
        var context_level_uri = ""
        if(level != 'l0'){
          //get parent level
          var new_level = "l" + (parseInt(level[1]) + 1).toString();
          context_level_uri = $scope.dc_data[new_level];  
        }

  			if(level) {
				//var level_data = AddDataFactory.level.get({'lev': level});
				//use a resource call to pull in the correct level
				//needs prefix adding
				if(!testFlag){
					var level_datapoint_resource = $resource(level_uri, {});
          if(level != "l0") {
            var context_datapoint_resource = $resource(context_level_uri, {});
            var context_promise = context_datapoint_resource.get();
            context_promise.$promise.then(function(result){
              $scope.context_datapoint = result;  
            });  
          }
					var level_promise = level_datapoint_resource.get();
					level_promise.$promise.then(function(result){
						$scope.level_datapoint = result;
            $scope.level_datapoint.id=null;
            $scope.level_datapoint.resource_uri = null;
						//now get the custom field config from this datapoint
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
				}
				else {
					var level_datapoint = $scope.test_level_datapoint;
				}
				
				/*if(!testFlag){
					var custom_field_config = $resource(level_datapoint['custom_field_config'], {});	
				}
				else {
					var custom_field_config = AddDataFactory.test_cfg;
				}*/
				

				//now map the field in the edit forms and edit schemas into form and schema which the json_schema_form library can use.
				 

			}
  		});
  		
  		
  		


  		//manipulate this to get the appropriate form elements

  		//may need to have more than one form - put into an object and use ng-repeat to create new forms

		//need a model for json_schem_form to be able to use to populate data
		//$scope.test_model = $scope.test_level_datapoint.project_data;
		

		//Because this is an addition controller, we start with an empty data model.

		//If this was an editing controller, you could initialise the data model like so:
		//$scope.test_model = {'project_data': $scope.test_level_datapoint.project_data };


		//do we have a level specified? If so, we need to pull in data from the specified level 
		//and then pull the custom field config from that to generate the form.

		//we also need to pull in the next level above as a viewing data thing to provide context for the form you are filling in.

		

  		
  	}

  	addctrl.submitForm = function() {
  		//need the top level webservice data in order to be able to submit
  		//we make a post request to the correct webservice
  		//should be a simple one-line statement...

  		//then redirect to view this data in a non-edit page, with an edit button for them to make changes, which takes them to the edit page.

  		$scope.level_datapoint.project_data = $scope.test_model.project_data;
  		//console.log($scope.level_datapoint);
  		$scope.clone[$stateParams.lev] = $scope.level_datapoint;
  		//console.log($scope.clone);
  		$scope.clone.$save();

  		// var post_resource = AddDataFactory.dataClassification;
  		// var post_promise = post_resource.get( {'dc': $stateParams.dc}, function(dc){
  		// 	dc = $scope.clone;

  		// 	dc.$save({'dc': $stateParams.dc}, function(data){
  		// 		console.log(data);
  		// 	});
  		// });
  		/*post_promise.$resource.then(function(data){
  			console.log(data);
  		})*/

  	}

  	addctrl.clearForm = function() {
  		$scope.test_model = {'project_data': {} };
  	}

  	//method to send this data to the appropriate post endpoint with a new ID (instead of the default "1") (this point may happen in the service or even at the backend?)

  	addctrl.getForm($stateParams.dc, $stateParams.lev, $stateParams.data_form_id);

    
  }]);
