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

	$scope.input_string = "";

	$scope.gridOptions = { data: 'parsed_input.compounds'
	                      };

	$scope.parseInput = function (){
		//take string
		//split on delims
		//try and pattern match
		//work out what sort of input it is.
		//for now push our test json to the Input

		//now try a delimited list of SMILES
		var splitted = splitInput(this.input_string);


		angular.each(splitted, function(idx,val) {
			
			//intervene here with Chembl calls using the ChEMBLFactory
        	//interrogate each val for its type, then call the appropriate ChEMBL service to retrieve data
        	//var returned_json = {}
        	if (val.type == 'InChi') {
        		//val.extraData = ChEMBLFactory.queryInChi();
        		$scope.parsed_input.push(new ChEMBLFactory(val.input_str, "inchi"));
        		
        	}
        	else if (val.type == 'InChi Key') {
        		//val.extraData = ChEMBLFactory.queryInChiKey();
        		$scope.parsed_input.push(new ChEMBLFactory(val.input_str, "inchikey"));
        		
        		
        	}
        	else if (val.type == 'SMILES') {
        		$scope.parsed_input = (new ChEMBLFactory(val.input_str, "smiles"));
        		
        		
        	}
        	else if (val.type == 'ChEMBL ID') {
        		$scope.parsed_input.push(new ChEMBLFactory(val.input_str, "chemblid"));
        		
        	}

        	//display errors
        	/*if (returned_json.resp == "danger") {
        		$scope.addAlert(returned_json.resp, returned_json.message );
        	}*/
			//$scope.parsed_input.push(val);	
			console.log($scope.parsed_input);
		});



		//$scope.parsed_input.push(splitted);
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


