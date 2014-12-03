'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
var app = angular.module('ngChemApp');

app.controller('DemoCtrl', function ($scope, $rootScope, $state, ChEMBLFactory) {

	$scope.formData = {};

	$scope.myData = [];

    $rootScope.step = 0;
    $rootScope.totalSteps = 4;
    $rootScope.dynamic = 0;
    $rootScope.max = 100;

	$scope.alerts = [
        /*{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }*/
	];

	$scope.parsed_input = [];

	this.input_string = "";

	$scope.gridOptions = { data: 'parsed_input',
						   columnDefs: [{field: 'type', displayName: 'Type'},
                                        {field:'input_str', displayName:'Value'},
                                        {field:'extraData', displayName:'From Factory'}]
	                      };

	$scope.parseInput = function (){
		//take string
		//split on delims
		//try and pattern match
		//work out what sort of input it is.
		//for now push our test json to the Input

		//now try a delimited list of SMILES
		var splitted = splitInput(this.input_string);

		jQuery.each(splitted, function(idx,val) {
			
			//intervene here with Chembl calls using the ChEMBLFactory
        	//interrogate each val for its type, then call the appropriate ChEMBL service to retrieve data
        	var returned_json = {}
        	if (val.type == 'InChi') {
        		//val.extraData = ChEMBLFactory.queryInChi();
        		ChEMBLFactory.queryInChi().then(function(response){
		        	$scope.addAlert("success", response.message );
        		},function(error) {
        			$scope.addAlert("danger", response.message );
        		});
        	}
        	else if (val.type == 'InChi Key') {
        		//val.extraData = ChEMBLFactory.queryInChiKey();
        		var returned_json = ChEMBLFactory.queryInChiKey().then(function(response){
		        	$scope.addAlert("success", response.message );
        		},function(error) {
        			$scope.addAlert("danger", response.message );
        		});
        	}
        	else if (val.type == 'SMILES') {
        		//val.extraData = ChEMBLFactory.querySmiles("");
        		var returned_json = ChEMBLFactory.querySmiles("").then(function(response){
		        	$scope.addAlert("success", response.message );
        		},function(error) {
        			$scope.addAlert("danger", response.message );
        		});
        	}
        	else if (val.type == 'ChEMBL ID') {
        		//val.extraData = ChEMBLFactory.queryChemblId();
        		var returned_json = ChEMBLFactory.queryChemblId().then(function(response){
		        	$scope.addAlert("success", response.message );
        		},function(error) {
        			$scope.addAlert("danger", response.message );
        		});
        	}

        	//display errors
        	if (returned_json.resp == "danger") {
        		$scope.addAlert(returned_json.resp, returned_json.message );
        	}
			$scope.parsed_input.push(val);	
		});



		$scope.parsed_input.push(splitted);
	};

    $scope.addAlert = function(message, alert_type){
      $scope.alerts.push({msg: message || 'There has been an error!', type : alert_type || "danger" });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };




});

app.controller('MessageCtrl', function ($scope){
	

});


